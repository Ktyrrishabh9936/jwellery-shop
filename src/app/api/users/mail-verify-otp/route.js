import { NextResponse } from "next/server"
import crypto from "crypto"
import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import bcrypt from "bcryptjs"
import { generateStrongPassword, extractNameFromEmail } from "@/utils/passwordGenerator"
import { sendEmail, generateWelcomeEmail } from "@/utils/sendMail"
import { getServerSession } from "next-auth"
import authOptions from "@/app/api/auth/[...nextauth]/options"

const hashOTP = (otp, secret) => crypto.createHmac("sha256", secret).update(otp).digest("hex")

export async function POST(request) {
  await connect()
  try {
    const { email, otp, hashedOTP, isDeliveryPage = true } = await request.json()

    if (!otp || !hashedOTP) {
      return NextResponse.json({ message: "Invalid request" }, { status: 403 })
    }

    const hashedInput = hashOTP(otp, process.env.NEXTAUTH_SECRET)

    if (hashedInput === hashedOTP) {
      let user = await User.findOne({ email })
      let newUserCreated = false
      let generatedPassword = null

      // If user doesn't exist and we're on the delivery page, create a new user
      if (!user && isDeliveryPage) {
        // Extract name from email
        const name = extractNameFromEmail(email)

        // Generate a strong password
        generatedPassword = generateStrongPassword(12)
        const hashedPassword = await bcrypt.hash(generatedPassword, 10)

        // Create new user
        user = await User.create({
          email,
          name,
          password: hashedPassword,
          isEmailVerified: true,
        })

        newUserCreated = true

        // Send welcome email with credentials
        console.log("email")
        const welcomeEmailContent = generateWelcomeEmail(name, email, generatedPassword)
        await sendEmail(
          email,
          "Welcome to Jenii - Your Account Details",
          welcomeEmailContent,
          process.env.BREVO_API_KEY,
        )
      } else if (user) {
        // If user exists, mark email as verified
        user.isEmailVerified = true
        await user.save()
      }

      // Create session if on delivery page and user exists
      let session = null
      if (isDeliveryPage && user) {
        session = await getServerSession(authOptions)
      }

      return NextResponse.json({
        message: "OTP Verified Successfully!",
        userId: user?._id,
        newUserCreated,
        credentials: newUserCreated ? { email, password: generatedPassword } : null,
        session,
      })
    } else {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}
