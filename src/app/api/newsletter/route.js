import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import { sendEmail } from '@/utils/sendMail';

export async function POST(request) {
  await connect();
  try {
    const { email } = await request.json();

    await sendEmail(email, 'New Newsletter Subscription', `You have a new subscriber: ${email}`,process.env.BREVO_API_KEY);

    return NextResponse.json({ message: 'Subscription successful!' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Failed to send OTP', error: error.message }, { status: 500 });
  }
}
