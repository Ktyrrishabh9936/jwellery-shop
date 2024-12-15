import { NextResponse } from 'next/server';
import Cart from '@/models/cartModel';
import { connect } from '@/dbConfig/dbConfig';
import { UserAuth } from '@/utils/userAuth';
import User from '@/models/userModel';
import Product from '@/models/productModel';
export async function POST(request) {
  await connect();
  const userId = await  UserAuth();  // Assume `userId` is retrieved from a middleware after authentication
  const { productId,quantity } = await request.json();

  try {
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
      cart = new Cart({ userId, items: []});
      user.cart = cart._id;
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    let idx ;
    let isExist = false;
    if (itemIndex > -1) {
      idx = itemIndex;
      cart.items[itemIndex].quantity += quantity;
      isExist = true;
    } else {
      const len = cart.items.push({ productId,name:product.name, quantity,img_src:product.images[0],price:product.price,discountedPrice:product.discountPrice,category:product.category.name});
      idx = len-1;
    }
    await cart.save();
    await user.save();
    return NextResponse.json({item:cart.items[idx],isExist}, { status: 200 });
  } catch (error) {
    console.log(error.message)
    return NextResponse.json({ message: 'Server error while adding to cart' }, { status: 500 });
  }
}