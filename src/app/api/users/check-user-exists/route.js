import { NextResponse } from "next/server"
import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"

export async function POST(request) {
  await connect()
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 })
    }

    const user = await User.findOne({ email })

    return NextResponse.json({ exists: !!user })
  } catch (error) {
    console.error("Error checking user:", error)
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
  }
}
