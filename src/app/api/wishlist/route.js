import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { UserAuth } from '@/utils/userAuth';
import { NextResponse } from 'next/server';

export async function GET() {
  await connect();
  try {
        const userId = await  UserAuth();
  const user = await User.findById(userId).populate({path:"wishList"});
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'wishlist get',wishList:user.wishList}, { status: 200 });
} catch (err) {
        console.log(err)
      return NextResponse.json({message:"Error in fetching wishlist",error:err.message},{ status: 500 })
}
}
