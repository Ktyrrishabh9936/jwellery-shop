import { NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import Review from "@/models/reviewModel"

export async function POST(request, { params }) {
  await connect()
  const { id } = await params
  const { reviewId, type } = await request.json()

  if (!reviewId || !type || !["helpful", "unhelpful"].includes(type)) {
    return NextResponse.json({ message: "Invalid request data" }, { status: 400 })
  }

  try {
    const review = await Review.findOne({ _id: reviewId, productId: id })

    if (!review) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 })
    }

    // Update the vote count
    if (type === "helpful") {
      review.helpfulVotes += 1
    } else {
      review.unhelpfulVotes += 1
    }

    await review.save()

    return NextResponse.json({
      message: "Vote recorded successfully",
      helpfulVotes: review.helpfulVotes,
      unhelpfulVotes: review.unhelpfulVotes,
    })
  } catch (error) {
    console.error("Server error:", error.message)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}
