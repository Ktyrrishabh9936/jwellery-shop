import { NextResponse } from "next/server"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import { connect } from "@/dbConfig/dbConfig"
import { UserAuth } from "@/utils/userAuth"
import Product from "@/models/productModel"
export async function PATCH(request, { params }) {
  await connect()
  try {
    const { orderId } = await params
    const { status } = await request.json()

    // Find the order item and update its status
    const updatedOrderItem = await OrderItem.findOneAndUpdate(
      { orderNumber: orderId },
      { $set: { status: status } },
      { new: true },
    )

    if (!updatedOrderItem) {
      return NextResponse.json({ message: "Order item not found" }, { status: 404 })
    }

    // Also update the main order status if all items have the same status
    const orderItems = await OrderItem.find({ orderId: updatedOrderItem.orderId })
    const allSameStatus = orderItems.every((item) => item.status === status)

    if (allSameStatus) {
      await Order.findByIdAndUpdate(updatedOrderItem.orderId, { $set: { orderStatus: status } }, { new: true })
    }

    return NextResponse.json(
      {
        message: "Order status updated successfully",
        orderItem: updatedOrderItem,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  await connect()
  try {
    const { orderId } = await params
    const userId = await UserAuth()

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // First try to find by orderNumber
    const order = await Order.findOne({ orderNumber: orderId })
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

    // Verify this order belongs to the authenticated user
    if (order.userId.toString() !== userId.toString()) {
      return NextResponse.json({ message: "Unauthorized access to this order" }, { status: 403 })
    }

    // Format the response to match the expected structure in the frontend
    const formattedOrder = {
      _id: order._id,
      orderID: order.orderNumber,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      subtotal:order.subtotal,
      discount:order.discount,
      shippingCost:order.shippingCost,
      amount: order.totalAmount,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.discountedPrice,
        _id: item._id,
      })),
      payment: {
        mode: order.payment.mode,
        paymentId: order.payment.paymentId ? order.payment.paymentId._id : null,
      },
      shipping: {
        courier: order.shipping.courier,
        deliveryOption: order.shipping.deliveryOption,
        estimatedDelivery: order.shipping.estimatedDelivery,
        trackingUrl: order.shipping.trackingUrl,
        shipmentID: order.shipping.shipmentID,
        awb: order.shipping.awb,
      },
      customer: {
        name: order.shippingAddress.name,
        email: order.shippingAddress.email,
        contact: order.shippingAddress.contact,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode,
        country: order.shippingAddress.country,
      },
      coupon: order.coupon,
    }

    return NextResponse.json({ order: formattedOrder }, { status: 200 })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}
