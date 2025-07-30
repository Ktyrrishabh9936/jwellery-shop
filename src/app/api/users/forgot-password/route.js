import { NextResponse } from "next/server"
import crypto from "crypto"
import User from "@/models/userModel"
import { connect } from "@/dbConfig/dbConfig"
import { sendEmail, generatePasswordResetEmail } from "@/utils/sendMail"

export async function POST(request) {
  await connect()

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: "If an account with that email exists, we have sent a password reset link.",
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")

    // Set reset token and expiry (1 hour from now)
    user.passwordResetToken = resetTokenHash
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save()

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`

    // Send email
    const emailContent = generatePasswordResetEmail(user.name, email, resetUrl)
    await sendEmail(email, "Reset Your Jenii Account Password", emailContent, process.env.BREVO_API_KEY)

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to your email",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
