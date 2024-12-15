import { NextResponse } from 'next/server';
import Cart from '@/models/cartModel';
import { connect } from '@/dbConfig/dbConfig';
import { UserAuth } from '@/utils/userAuth';
import User from '@/models/userModel';
import Product from '@/models/productModel';
export async function POST(request) {
  await connect();
  try {
    const { productId } = await request.json();
    const userId = await UserAuth();  // Assume `userId` is retrieved from a middleware after authentication
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Invalid User' }, { status: 404 });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Invalid Product ID' }, { status: 404 });
    }
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }
    const item = cart.items.filter(item => item.productId.toString() === productId)
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
 
    if(cart.items.length === 0){
      await Cart.findByIdAndDelete(cart._id);
      return NextResponse.json({successType:"EMPTY"}, { status: 200 });
    }
    else{
      await user.save();
    await cart.save();
    return NextResponse.json({item}, { status: 200 });
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Server error while removing product from cart' }, { status: 500 });
  }
}
