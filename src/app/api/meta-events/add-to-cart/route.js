import { NextResponse } from "next/server"
import { trackAddToCart } from "@/utils/metaEventHelpers"
import { UserAuth } from "@/utils/userAuth"
import User from "@/models/userModel"
import Product from "@/models/productModel"

export async function POST(req) {
  try {
    const { productId, quantity = 1 } = await req.json()

    if (!productId) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 })
    }

    // Get product details
    const product = await Product.findById(productId).populate("category")
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Get user if authenticated
    let user = null
    try {
      const userId = await UserAuth()
      if (userId) {
        user = await User.findById(userId).select("name email phone")
      }
    } catch (error) {
      // User not authenticated, continue without user data
    }

    const result = await trackAddToCart(req, user, product, quantity)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Add to cart tracking error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
