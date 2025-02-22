
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
const hashOTP = (otp, secret) => crypto.createHmac("sha256", secret).update(otp).digest("hex");

export async function POST(request) {
  await connect();
  try {
    const { email, otp, hashedOTP } = await request.json();
    if (!otp || !hashedOTP) return  NextResponse.json({ message: "Invalid request" },{status: 403});
    const hashedInput = hashOTP(otp,process.env.NEXTAUTH_SECRET);
  if (hashedInput === hashedOTP) {
        let user = await User.findOne({ email });
        if (!user) {
                user = await User.create({
                        email,
                        name: "Anonymous",
                      });
        }
    return NextResponse.json({ message: "OTP Verified Successfully!", userId: user._id });
  } else {
    return NextResponse.json({ message: "Invalid OTP" },{status: 400});
  }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
