import mongoose from "mongoose"

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewerName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
   
    reviewDate: {
      type: Date,
      default: Date.now,
    },

  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
reviewSchema.index({ productId: 1, createdAt: -1 })
reviewSchema.index({ productId: 1, rating: -1 })
reviewSchema.index({ productId: 1, helpfulVotes: -1 })

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema)
export default Review
