import { NextResponse } from "next/server"
import crypto from "crypto"
import User from "@/models/userModel"
import { connect } from "@/dbConfig/dbConfig"

export async function POST(request) {
  await connect()

  try {
    const { token, email } = await request.json()

    if (!token || !email) {
      return NextResponse.json({ success: false, message: "Token and email are required" }, { status: 400 })
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find user with matching email and valid reset token
    const user = await User.findOne({
      email: email.toLowerCase(),
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Token is valid",
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
