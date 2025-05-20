import { NextResponse } from "next/server"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import Payment from "@/models/paymentModel"
import Product from "@/models/productModel"
import { connect } from "@/dbConfig/dbConfig"
import { UserAuth } from "@/utils/userAuth"
import { sendEmail } from "@/utils/sendMail"
import Razorpay from "razorpay"

export async function POST(request, { params }) {
  await connect()
  try {
    const { orderId } = await params;
    const userId = await UserAuth()
    const { reason, upiId } = await request.json()

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Find the order
    const order = await Order.findOne({ orderNumber: orderId, userId })
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
        },
      })
      .populate("payment.paymentId")

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Check if order can be cancelled (not shipped, delivered, or already cancelled)
    const nonCancellableStatuses = ["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]
    if (nonCancellableStatuses.includes(order.orderStatus)) {
      return NextResponse.json(
        { message: "Cannot cancel orders that are already shipped, delivered, or cancelled" },
        { status: 400 },
      )
    }

    // Update order status to CANCELLED
    order.orderStatus = "CANCELLED"
    await order.save()

    // Update all order items status to CANCELLED
    await OrderItem.updateMany({ orderId: order._id }, { $set: { status: "CANCELLED" } })

    // Return items to inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: item.quantity } })
    }

    // Handle refund for prepaid orders
    let refundId = null
    if (order.payment.mode === "Prepaid" && order.payment.paymentId) {
      try {
        const payment = await Payment.findById(order.payment.paymentId)

        if (payment && payment.rzr_payment_id) {
          // Initialize Razorpay
          const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
          })

          // Create refund
          const refund = await razorpay.payments.refund(payment.rzr_payment_id, {
            amount: order.totalAmount * 100, // Razorpay expects amount in paise
            speed: "optimum",
            receipt: `refund-${order.orderNumber}`,
            notes: {
              reason: reason,
              order_id: order.orderNumber,
              upi_id: upiId || "Not provided",
            },
          })

          refundId = refund.id

          // Update payment status
          payment.status = "REFUNDED"
          await payment.save()
        }
      } catch (refundError) {
        console.error("Error processing refund:", refundError)
        // Continue with cancellation even if refund fails
      }
    }

    // Send cancellation email to customer
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #e91e63;">Order Cancellation Confirmation</h2>
          </div>
          <p>Dear ${order.shippingAddress.name},</p>
          <p>Your order <strong>#${order.orderNumber}</strong> has been successfully cancelled.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Cancellation Details:</strong></p>
            <p>Order Number: #${order.orderNumber}</p>
            <p>Cancellation Date: ${new Date().toLocaleDateString()}</p>
            <p>Reason: ${reason}</p>
            ${
              order.payment.mode === "Prepaid"
                ? `<p>Refund Status: ${refundId ? "Initiated" : "Pending"}</p>
               ${refundId ? `<p>Refund ID: ${refundId}</p>` : ""}
               ${upiId ? `<p>UPI ID for Refund: ${upiId}</p>` : ""}`
                : ""
            }
          </div>
          
          <p>If you have any questions about your cancellation or refund, please contact our customer support team.</p>
          <p>Thank you for shopping with JENII.</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} JENII. All rights reserved.</p>
          </div>
        </div>
      `

      await sendEmail(
        order.shippingAddress.email,
        `JENII - Your Order #${order.orderNumber} has been Cancelled`,
        emailHtml,
        process.env.BREVO_API_KEY,
      )
    } catch (emailError) {
      console.error("Error sending cancellation email:", emailError)
      // Continue with response even if email fails
    }

    return NextResponse.json(
      {
        message: "Order cancelled successfully",
        order: {
          orderID: order.orderNumber,
          status: "CANCELLED",
          refundId: refundId,
          refundStatus: order.payment.mode === "Prepaid" ? "Initiated" : "Not Applicable",
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error cancelling order:", error)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}
