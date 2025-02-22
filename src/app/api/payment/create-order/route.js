import { connect } from '@/dbConfig/dbConfig';
import Address from '@/models/addressModel';
import Cart from '@/models/cartModel';
import couponModel from '@/models/couponModel';
import User from '@/models/userModel';
import { UserAuth } from '@/utils/userAuth';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req) {
  await connect();
  try {
    const {userId,Items,couponCode} = await req.json();
    let Id;
    if(!userId) {
     Id = await UserAuth();
  }else{
    Id = userId;
  }
    const user = await User.findById(Id);
    if (!user) {
      return NextResponse.json({ message: 'Invaild user' }, { status: 404 });
    }
   
    let total = 0;
     total = Items.reduce((acc, item) => {
      const price = item.discountedPrice; // Optional chaining
      const quantity = item.quantity || 1; // Default to 1 if quantity is not defined

      if (typeof price !== 'number' || isNaN(price)) {
        return NextResponse.json({ message: 'Price is not a valid type' }, { status: 403 });
      }
      return acc + price * quantity; // Calculate total
    }, 0);
    if(couponCode){
    const coupon = await couponModel.findOne({ code: couponCode });
    if (coupon) {
      if (coupon.minimumOrderValue > total) {
        return NextResponse.json({ message: `Minimum order amount is ${coupon.minOrderAmount}` }, { status: 403 });
      }
      if (coupon.discountType === 'percentage') {
        total -= (total * coupon.discountValue) / 100;
      } else if (coupon.discountType === 'fixed') {
        total -= coupon.discountValue;
      }
    }
  }
    const amountInPaise = Math.round(total * 100);
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt#${Date.now()}`,
    };
    const order = await razorpayInstance.orders.create(options);
      return NextResponse.json({ message: 'Order created successfully', order:order,amount:total}, { status: 200 });
   
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Error creating Razorpay order', error: error.message }, { status: 500 });
  }
}
