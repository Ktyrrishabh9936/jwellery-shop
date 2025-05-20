import { NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import { sendEmail, generateOTPEmail } from "@/utils/sendMail"
import crypto from "crypto"

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString() // Generates a 6-digit OTP
}

const hashOTP = (otp, secret) => crypto.createHmac("sha256", secret).update(otp).digest("hex")

export async function POST(request) {
  await connect()
  try {
    const { email } = await request.json()

    const otp = generateOTP()
    const hashedOTP = hashOTP(otp, process.env.NEXTAUTH_SECRET)

    // Generate the OTP email using the new template
    const emailContent = generateOTPEmail(email, otp)

    await sendEmail(email, "Jenii - Email Verification Code", emailContent, process.env.BREVO_API_KEY)

    return NextResponse.json({ message: "OTP sent to your email", hashedOTP })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ message: "Failed to send OTP", error: error.message }, { status: 500 })
  }
}
