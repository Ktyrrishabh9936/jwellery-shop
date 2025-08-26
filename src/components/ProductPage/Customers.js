"use client"
import { useState } from "react"
import ReviewsSection from "./ReviewsSection"

export default function Customers({ productId }) {
  const [activeTab, setActiveTab] = useState("reviews")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Customer Reviews
          </button>
         
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "reviews" && <ReviewsSection productId={productId} />}
        {activeTab === "qa" && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Questions & Answers</h3>
            <p className="text-gray-600">No questions yet. Be the first to ask!</p>
            <button className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors">
              Ask a Question
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
