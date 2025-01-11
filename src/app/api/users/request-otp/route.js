import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';
import { sendEmail } from '@/helper/sendEmail';

function generateOTP() {

  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

export async function POST(request) {
  await connect();
  try {
    const { email } = await request.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' });
    }

    // Generate OTP and set expiry time (10 minutes from now)
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    await user.save();

    // Send OTP to user's email
    await sendEmail(email, 'Your OTP Code', `Your OTP is ${otp}`);

    return NextResponse.json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Failed to send OTP', error: error.message }, { status: 500 });
  }
}
