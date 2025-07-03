"use client"

import { useCallback } from "react"

export const useMetaTracking = () => {
  const trackPageView = useCallback(async (pageData) => {
    try {
      await fetch("/api/meta-events/page-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      })
    } catch (error) {
      console.error("Failed to track page view:", error)
    }
  }, [])

  const trackProductView = useCallback(async (productId) => {
    try {
      await fetch("/api/meta-events/view-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })
    } catch (error) {
      console.error("Failed to track product view:", error)
    }
  }, [])

  const trackAddToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await fetch("/api/meta-events/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })
    } catch (error) {
      console.error("Failed to track add to cart:", error)
    }
  }, [])

  const trackSearch = useCallback(async (searchTerm, category, resultIds = [], totalValue = 0) => {
    try {
      await fetch("/api/meta-events/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm, category, resultIds, totalValue }),
      })
    } catch (error) {
      console.error("Failed to track search:", error)
    }
  }, [])

  const trackLead = useCallback(async (leadData) => {
    try {
      await fetch("/api/meta-events/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      })
    } catch (error) {
      console.error("Failed to track lead:", error)
    }
  }, [])

  return {
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackSearch,
    trackLead,
  }
}
