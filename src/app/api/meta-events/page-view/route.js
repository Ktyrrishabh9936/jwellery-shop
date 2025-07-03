import { NextResponse } from "next/server"
import { trackPageView } from "@/utils/metaEventHelpers"
import { UserAuth } from "@/utils/userAuth"
import User from "@/models/userModel"

export async function POST(req) {
  try {
    const { pageName, category, contentIds, value } = await req.json()

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

    const pageData = {
      pageName,
      category,
      contentIds,
      value,
    }

    const result = await trackPageView(req, user, pageData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Page view tracking error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
