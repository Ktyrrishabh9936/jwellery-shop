import { NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import { UserAuth } from "@/utils/userAuth"
import { generateOrderConfirmationEmail } from "@/utils/sendMail"
import { sendEmail } from "@/utils/sendMail"

export async function GET(request, { params }) {
  await connect()

  try {
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 })
    }

    // Authenticate user
    const userId = await UserAuth(request)
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Find the order
    const order = await Order.findOne({
      userId,
      "orders.orderID": orderId,
    })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Find the specific order in the orders array
    const specificOrder = order.orders.find((o) => o.orderID === orderId)
    if (!specificOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Get order items
    const orderItems = await OrderItem.find({
      orderId: order._id,
      orderNumber: specificOrder.orderNumber,
    }).populate("productId")

    // Generate tracking URL
    const trackingUrl =
      specificOrder.shipping?.trackingUrl ||
      (specificOrder.shipping?.awb ? `https://shiprocket.co/tracking/${specificOrder.shipping.awb}` : null)

    // Format order data for the confirmation page
    const orderData = {
      id: specificOrder.orderID,
      orderNumber: specificOrder.orderNumber,
      createdAt: specificOrder.createdAt || order.createdAt,
      orderStatus: specificOrder.orderStatus,
      payment: {
        mode: specificOrder.payment.mode,
        paymentId: specificOrder.payment.paymentId,
      },
      shipping: {
        deliveryOption: specificOrder.shipping?.deliveryOption || "standard",
        courier: specificOrder.shipping?.courier || { name: "Standard Delivery" },
        estimatedDelivery: specificOrder.shipping?.estimatedDelivery,
        trackingUrl: trackingUrl,
        awb: specificOrder.shipping?.awb,
      },
      shippingAddress: specificOrder.shippingAddress,
      billingAddress: specificOrder.billingAddress,
      subtotal: specificOrder.subtotal,
      shippingCost: specificOrder.shippingCost,
      discount: specificOrder.discount,
      totalAmount: specificOrder.totalAmount,
      coupon: specificOrder.coupon,
      items: orderItems.map((item) => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.discountedPrice,
        totalPrice: item.totalPrice,
        image: item.productId?.images[0] || item.image,
        productId: {
          _id: item.productId?._id,
          name: item.productId?.name,
          images: item.productId?.images || [],
          category: item.productId?.category,
        },
      })),
    }

    return NextResponse.json({
      success: true,
      order: orderData,
    })
  } catch (error) {
    console.error("Error fetching order confirmation:", error)
    return NextResponse.json(
      {
        message: "Failed to fetch order confirmation",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request, { params }) {
  await connect()

  try {
    const { orderId } = params
    const { resendEmail } = await request.json()

    if (!orderId) {
      return NextResponse.json({ message: "Order ID is required" }, { status: 400 })
    }

    // Authenticate user
    const userId = await UserAuth(request)
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Find the order
    const order = await Order.findOne({
      userId,
      "orders.orderID": orderId,
    })

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Find the specific order in the orders array
    const specificOrder = order.orders.find((o) => o.orderID === orderId)
    if (!specificOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Get order items
    const orderItems = await OrderItem.find({
      orderId: order._id,
      orderNumber: specificOrder.orderNumber,
    }).populate("productId")

    // Generate tracking URL
    const trackingUrl =
      specificOrder.shipping?.trackingUrl ||
      (specificOrder.shipping?.awb ? `https://shiprocket.co/tracking/${specificOrder.shipping.awb}` : null)

    // Generate email content
    const emailHtml = generateOrderConfirmationEmail(specificOrder, orderItems, trackingUrl)

    // Send confirmation email
    await sendEmail(
      specificOrder.shippingAddress.email,
      `JENII - Your Order #${specificOrder.orderNumber} Confirmation`,
      emailHtml,
      process.env.BREVO_API_KEY,
    )

    return NextResponse.json({
      success: true,
      message: "Order confirmation email sent successfully",
    })
  } catch (error) {
    console.error("Error sending order confirmation email:", error)
    return NextResponse.json(
      {
        message: "Failed to send order confirmation email",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
