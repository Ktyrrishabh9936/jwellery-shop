
import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';

export async function POST(request) {
  await connect();
  try {
    const { email, otp } = await request.json();
    console.log(email, otp)

    // Find user by email and OTP, and check if OTP has not expired
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }, // Check if OTP is still valid
    });

    console.log(user)

    // Check if user exists and OTP is valid
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // OTP is valid; return success response
    return NextResponse.json(
      {
        message: 'OTP verified successfully. You can now set a new password.',
        userId: user._id
      }
      
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
