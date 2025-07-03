import { NextResponse } from "next/server"
import { trackPurchase } from "@/utils/metaEventHelpers"
import User from "@/models/userModel"
import Order from "@/models/orderModel"

export async function POST(req) {
  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 })
    }

    // Get order details
    const order = await Order.findById(orderId).populate("items.productId")
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Get user details
    const user = await User.findById(order.userId).select("name email phone")
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const result = await trackPurchase(req, user, order)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Purchase tracking error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
