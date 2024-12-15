import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { UserAuth } from '@/utils/userAuth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connect();

  try {
        const userId = await  UserAuth();
        const { productId } = await request.json();
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  user.wishList = user.wishList.filter((id) => id.toString() !== productId);
  await user.save();

  return NextResponse.json({ message: 'Product removed from wishlist',wishList:user.wishList}, { status: 200 });
} catch (err) {
        console.log(err)
      return NextResponse.json({message:"Error in removing Items from wishlist",error:err.message},{ status: 500 })
}
}
