import { NextResponse } from "next/server"
import metaAPI from "@/utils/metaConversionAPI"
import { extractUserInfo } from "@/utils/metaEventHelpers"
import { UserAuth } from "@/utils/userAuth"
import User from "@/models/userModel"

export async function POST(req) {
  try {
    const { searchTerm, category, resultIds = [], totalValue = 0 } = await req.json()

    if (!searchTerm) {
      return NextResponse.json({ success: false, error: "Search term is required" }, { status: 400 })
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

    const userInfo = extractUserInfo(user)
    const searchData = {
      searchTerm,
      category,
      resultIds,
      totalValue,
    }

    const result = await metaAPI.trackSearch(req, userInfo, searchData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Search tracking error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
