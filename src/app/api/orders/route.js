import { NextResponse } from "next/server"
import Order from "@/models/orderModel"
import { connect } from "@/dbConfig/dbConfig"
import { UserAuth } from "@/utils/userAuth"
import OrderItem from "@/models/orderItemModel"
import Payment from "@/models/paymentModel"
import Product from "@/models/productModel"
export async function GET(request) {
  await connect()
  try {
    const userId = await UserAuth()

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page")) || 1
    const limit = Number.parseInt(url.searchParams.get("limit")) || 10
    const status = url.searchParams.get("status")

    // Calculate skip for pagination
    const skip = (page - 1) * limit

    // Build query
    const query = { userId }
    if (status && status !== "all") {
      query.orderStatus = status.toUpperCase()
    }

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query)

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "items",
        populate: {
          path: "productId",
          select: "name images category price",
        },
      })
      .populate("payment.paymentId")

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      orderID: order.orderNumber,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
      amount: order.totalAmount,
      paymentMode: order.payment.mode,
      items: order.items,
      shipping: {
        courier: order.shipping.courier,
        trackingUrl: order.shipping.trackingUrl,
        estimatedDelivery: order.shipping.estimatedDelivery,
      },
    }))

    return NextResponse.json(
      {
        orders: formattedOrders,
        pagination: {
          total: totalOrders,
          page,
          limit,
          pages: Math.ceil(totalOrders / limit),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}
