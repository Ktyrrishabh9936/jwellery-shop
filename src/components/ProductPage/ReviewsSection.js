"use client"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { Star, ChevronDown } from "lucide-react"

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [showWriteReview, setShowWriteReview] = useState(false)

  // Review form state
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: "",
    comment: "",
    reviewerName: "",
    isAnonymous: false,
  })

  const { user } = useSelector((store) => store.user)

  const fetchReviews = async (pageNum = 1, sort = "newest", reset = false) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/${productId}/reviews?page=${pageNum}&limit=5&sortBy=${sort}`)
      const data = await response.json()

      if (response.ok) {
        if (reset || pageNum === 1) {
          setReviews(data.reviews)
        } else {
          setReviews((prev) => [...prev, ...data.reviews])
        }

        setReviewStats({
          totalReviews: data.totalReviews,
          averageRating: data.averageRating,
          ratingDistribution: data.ratingDistribution,
        })
        setHasMore(data.hasMore)
      } else {
        console.error(data.message)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(1, sortBy, true)
  }, [productId, sortBy])

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchReviews(nextPage, sortBy)
    }
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    setPage(1)
  }

  const submitReview = async (e) => {
    e.preventDefault()

    if (newReview.rating < 1 || newReview.rating > 5 || !newReview.title.trim() || !newReview.comment.trim()) {
      toast.error("Please provide a rating, title, and comment.")
      return
    }

    

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      })
      const data = await res.json()

      if (res.ok) {
        toast.success("Review submitted successfully!")
        setNewReview({
          rating: 0,
          title: "",
          comment: "",
        })
        setShowWriteReview(false)
        fetchReviews(1, sortBy, true) // Refresh reviews
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    }
  }



  return (
    <div className="py-8 bg-white">
      {/* Reviews Header */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Rating Summary */}
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">{reviewStats.averageRating}</div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(reviewStats.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600">Based on {reviewStats.totalReviews} reviews</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          reviewStats.totalReviews > 0
                            ? (reviewStats.ratingDistribution[rating] / reviewStats.totalReviews) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-right">{reviewStats.ratingDistribution[rating]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Write Review Button */}
        <div className="lg:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Reviews ({reviewStats.totalReviews})</h3>
            <button
              onClick={() => setShowWriteReview(!showWriteReview)}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Write a Review
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2 mb-6">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-pink-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Form */}
      {showWriteReview && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
          <form onSubmit={submitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                    className={`w-8 h-8 ${
                      star <= newReview.rating ? "text-yellow-400" : "text-gray-300"
                    } hover:text-yellow-400 transition-colors`}
                  >
                    <Star className="w-full h-full fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review Title *</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="Summarize your review in one line"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                placeholder="Tell others about your experience with this product"
                required
              />
            </div>

            

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowWriteReview(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <ReviewCard key={review._id || idx} review={review} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More Reviews"}
          </button>
        </div>
      )}
    </div>
  )
}

function ReviewCard({ review }) {
  const [showFullComment, setShowFullComment] = useState(false)
  const isLongComment = review.comment.length > 200

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-pink-600 font-semibold text-lg">{review.reviewerName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{review.isAnonymous ? "Anonymous" : review.reviewerName}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{formatDate(review.reviewDate)}</span>
              {review.isVerifiedPurchase && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verified Purchase</span>
              )}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Review Title */}
      <h4 className="font-semibold text-lg mb-2">{review.title}</h4>

      {/* Review Comment */}
      <div className="text-gray-700 mb-4">
        {isLongComment && !showFullComment ? (
          <>
            {review.comment.substring(0, 200)}...
            <button
              onClick={() => setShowFullComment(true)}
              className="text-pink-500 hover:text-pink-600 ml-2 font-medium"
            >
              Read more
            </button>
          </>
        ) : (
          <>
            {review.comment}
            {isLongComment && showFullComment && (
              <button
                onClick={() => setShowFullComment(false)}
                className="text-pink-500 hover:text-pink-600 ml-2 font-medium"
              >
                Show less
              </button>
            )}
          </>
        )}
      </div>

      
    </div>
  )
}
