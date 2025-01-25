import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';
import { UserAuth } from '@/utils/userAuth';

export async function PUT(request) {
  await connect();
  try {
    const userId = await UserAuth();
    const { image } = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.image = image;
    await user.save();

    return NextResponse.json({ image: user.image}, { status: 200 });
  } catch (err) {
        console.log(err)
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}