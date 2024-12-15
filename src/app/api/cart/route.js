import { NextResponse } from 'next/server';
import Cart from '@/models/cartModel';
import { connect } from '@/dbConfig/dbConfig';
import { UserAuth } from '@/utils/userAuth';
import User from '@/models/userModel';

export async function GET() {
  await connect()
  try {
    const userId =  await UserAuth();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Invalid User' }, { status: 500 });
    }

    let cart = await Cart.findOne({ userId }).populate({path:'items.productId',select:"price discountPrice "});// Populate product details
    if (!cart) {
      return NextResponse.json({ successType:"EMPTY",message: 'Cart is Empty' }, { status: 200 });
    }
    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    cart.items.forEach((item) => {
      item.price = item.productId.price;
      item.discountedPrice =item.productId.discountPrice;
      totalPrice += item.productId.price * item.quantity;
      totalItem+=item.quantity;
      totalDiscountedPrice += item.productId.discountPrice * item.quantity;
    });
    cart.totalPrice = totalPrice;
    cart.totalDiscountedPrice = totalDiscountedPrice;
    cart.totalItem = totalItem;
    cart.discounte = totalPrice - totalDiscountedPrice;
  user.ItemsInCart = totalItem;
   await cart.save();
  await user.save();
  const Productcart = await Cart.findOne({ userId });
  return NextResponse.json({ message: 'Fetch cart successfully',cart:Productcart}, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message,message:'Server error while fetching cart'}, { status: 500 });
  }
}
