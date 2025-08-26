import { NextResponse } from "next/server"
import Product from "@/models/productModel"
import { connect } from "@/dbConfig/dbConfig"
import { UserAuth } from "@/utils/userAuth"
import "@/models/userModel"
import Review from "@/models/reviewModel"
import { generateFakeReviews, updateProductRatingStats } from "@/utils/fakeReviewGenerator"

// Create a review for a specific product
export async function POST(request, { params }) {
  await connect()
  const { id } = await params
  const { rating, comment, title, reviewerName } = await request.json()

  if (!rating || !comment || !title || rating < 1 || rating > 5) {
    return NextResponse.json({ message: "Invalid rating, title, or comment" }, { status: 400 })
  }

  try {
    let userId = null
    let finalReviewerName = reviewerName

    // Try to get user if logged in
    try {
      userId = await UserAuth()
    } catch (error) {
      // User not logged in, that's okay for anonymous reviews
    }

    // If no reviewer name provided and user is logged in, get from user
    if (!finalReviewerName && userId) {
      const User = require("@/models/userModel").default
      const user = await User.findById(userId)
      finalReviewerName = user?.name || "Anonymous"
    }

    // Default to Anonymous if still no name
    if (!finalReviewerName) {
      finalReviewerName = "Anonymous"
    }

    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Create the review document
    const review = new Review({
      productId: id,
      userId: userId ? userId : undefined,
      reviewerName: finalReviewerName,
      rating: Number(rating),
      title,
      comment,
      isVerifiedPurchase: userId ? true : false, // Only verified if user is logged in
      reviewDate: new Date(),
    })

    await review.save()

    // Update product rating statistics
    await updateProductRatingStats(id)

    return NextResponse.json({ message: "Review added successfully", review }, { status: 201 })
  } catch (error) {
    console.error("Server error:", error.message)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  await connect()
  const { id } = await params
  const url = new URL(request.url)
  const page = Number.parseInt(url.searchParams.get("page")) || 1
  const limit = Number.parseInt(url.searchParams.get("limit")) || 10
  const sortBy = url.searchParams.get("sortBy") || "newest" // newest, oldest, highest, lowest, helpful

  try {
    const product = await Product.findById(id)
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if reviews exist for this product
    const reviewCount = await Review.countDocuments({ productId: id })

    // If no reviews exist, generate fake reviews for demo
    if (reviewCount === 0) {
      const fakeReviews = generateFakeReviews(id, 15)

      // Insert fake reviews
      await Review.insertMany(fakeReviews)

      // Update product statistics
      await updateProductRatingStats(id)
    }

    // Build sort criteria
    let sortCriteria = {}
    switch (sortBy) {
      case "oldest":
        sortCriteria = { reviewDate: 1 }
        break
      case "highest":
        sortCriteria = { rating: -1, reviewDate: -1 }
        break
      case "lowest":
        sortCriteria = { rating: 1, reviewDate: -1 }
        break
      
      default: // newest
        sortCriteria = { reviewDate: -1 }
    }

    // Get paginated reviews
    const reviews = await Review.find({ productId: id })
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const totalReviews = await Review.countDocuments({ productId: id })
    const totalPages = Math.ceil(totalReviews / limit)

    // Get updated product stats
    const updatedProduct = await Product.findById(id).select("averageRating totalReviews ratingDistribution")

    return NextResponse.json(
      {
        reviews,
        totalReviews: updatedProduct.totalReviews,
        averageRating: updatedProduct.averageRating,
        ratingDistribution: updatedProduct.ratingDistribution,
        currentPage: page,
        totalPages,
        hasMore: page < totalPages,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Server error:", error.message)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}
