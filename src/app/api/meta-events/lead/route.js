import { NextResponse } from "next/server"
import metaAPI from "@/utils/metaConversionAPI"
import { extractUserInfo } from "@/utils/metaEventHelpers"

export async function POST(req) {
  try {
    const { email, phone, name, leadType = "Newsletter Signup", category = "engagement" } = await req.json()

    if (!email && !phone) {
      return NextResponse.json({ success: false, error: "Email or phone is required" }, { status: 400 })
    }

    const userInfo = extractUserInfo({ email, phone, name })
    const leadData = {
      leadType,
      category,
      value: 0,
    }

    const result = await metaAPI.trackLead(req, userInfo, leadData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Lead tracking error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
