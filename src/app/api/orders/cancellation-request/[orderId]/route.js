import { NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import Order from "@/models/orderModel"
import CancellationRequest from "@/models/cancellationRequestModel"
import { UserAuth } from "@/utils/userAuth"
import { sendEmail } from "@/utils/sendMail"

export async function POST(req, { params }) {
  await connect()
  try {
    const { orderId } = await params
    const { reason, additionalInfo } = await req.json()

    // Validate input
    if (!reason) {
      return NextResponse.json({ message: "Cancellation reason is required" }, { status: 400 })
    }

    // Get authenticated user
    const userId = await UserAuth()
    if (!userId) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Find the order
    const order = await Order.findOne({orderNumber:orderId}).populate("items")
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

   
    if (order.userId.toString() !== userId.toString()) {
      return NextResponse.json({ message: "Unauthorized access to this order" }, { status: 403 })
    }

    // Check if order can be cancelled
    if (["CANCELLED", "DELIVERED", "REFUNDED", "RTO_DELIVERED"].includes(order.orderStatus)) {
      return NextResponse.json(
        {
          message: `Order cannot be cancelled in ${order.orderStatus} status`,
          details:
            order.orderStatus === "DELIVERED"
              ? "Please initiate a return request instead"
              : "This order is already cancelled or completed",
        },
        { status: 400 },
      )
    }

    // Check if there's already a pending cancellation request
    const existingRequest = await CancellationRequest.findOne({
      orderId: orderId,
      status: { $in: ["PENDING", "APPROVED"] },
    })

    if (existingRequest) {
      return NextResponse.json(
        {
          message: "A cancellation request already exists for this order",
          requestId: existingRequest._id,
          status: existingRequest.status,
        },
        { status: 409 },
      )
    }

    // Create cancellation request
    const cancellationRequest = new CancellationRequest({
      orderId: order._id,
      orderNumber: order.orderNumber,
      userId: userId,
      reason: reason,
      additionalInfo: additionalInfo || "",
      orderStatus: order.orderStatus, // Store current order status
    })

    await cancellationRequest.save()

    // Send notification to admin
    const adminNotificationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #BC264B;">New Order Cancellation Request</h2>
        <p>A customer has requested to cancel their order.</p>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Current Status:</strong> ${order.orderStatus}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        ${additionalInfo ? `<p><strong>Additional Information:</strong> ${additionalInfo}</p>` : ""}
        <p>Please review this request in the admin dashboard.</p>
        <p>This is an automated notification.</p>
      </div>
    `

    await sendEmail(
      process.env.ADMIN_EMAIL,
      `[JENII] Order Cancellation Request #${order.orderNumber}`,
      adminNotificationHtml,
    )

    // Send confirmation to customer
    const customerNotificationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #BC264B;">Cancellation Request Received</h2>
        <p>We have received your request to cancel order #${order.orderNumber}.</p>
        <p>Our team will review your request and process it as soon as possible. You will receive an email notification once your request has been processed.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li>Order Number: ${order.orderNumber}</li>
          <li>Request Date: ${new Date().toLocaleDateString()}</li>
          <li>Reason: ${reason}</li>
        </ul>
        <p>If you have any questions, please contact our customer support.</p>
        <p>Thank you for shopping with Jenii.</p>
      </div>
    `

    await sendEmail(
      order.shippingAddress.email,
      `Your Cancellation Request for Order #${order.orderNumber}`,
      customerNotificationHtml,
    )

    return NextResponse.json(
      {
        success: true,
        message: "Cancellation request submitted successfully",
        requestId: cancellationRequest._id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating cancellation request:", error)
    return NextResponse.json(
      { message: "Error processing cancellation request", error: error.message },
      { status: 500 },
    )
  }
}

export async function GET(req, { params }) {
  await connect()
  try {
    const { orderId } = params

    // Get authenticated user
    const userId = await UserAuth()
    if (!userId) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 })
    }

    // Find cancellation requests for this order
    const requests = await CancellationRequest.find({ orderId }).sort({ createdAt: -1 })

    // Verify the requests belong to the user
    if (requests.length > 0 && requests[0].userId.toString() !== userId.toString()) {
      return NextResponse.json({ message: "Unauthorized access to these requests" }, { status: 403 })
    }

    return NextResponse.json(
      {
        success: true,
        requests: requests,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching cancellation requests:", error)
    return NextResponse.json({ message: "Error fetching cancellation requests", error: error.message }, { status: 500 })
  }
}
