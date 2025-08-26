import { NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import Review from "@/models/reviewModel"
import Product from "@/models/productModel"
import { generateFakeReviews, updateProductRatingStats } from "@/utils/fakeReviewGenerator"

export async function POST(request) {
  await connect()

  try {
    const { productId, count = 15 } = await request.json()

    if (!productId) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 })
    }

    // Check if product exists
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Delete existing reviews for this product
    await Review.deleteMany({ productId })

    // Generate new fake reviews
    const fakeReviews = generateFakeReviews(productId, count)

    // Insert fake reviews
    const insertedReviews = await Review.insertMany(fakeReviews)

    // Update product statistics
    const stats = await updateProductRatingStats(productId)

    return NextResponse.json({
      message: "Fake reviews generated successfully",
      reviewsGenerated: insertedReviews.length,
      productStats: stats,
    })
  } catch (error) {
    console.error("Server error:", error.message)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}

// Get all products for admin to generate reviews
export async function GET() {
  await connect()

  try {
    const products = await Product.find({}, "name _id totalReviews averageRating").limit(50)

    return NextResponse.json({
      products,
      message: "Products fetched successfully",
    })
  } catch (error) {
    console.error("Server error:", error.message)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}
