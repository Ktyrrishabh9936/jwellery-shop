
import { NextResponse } from 'next/server';
import Cart from '@/models/cartModel';
import { connect } from '@/dbConfig/dbConfig';
import { UserAuth } from '@/utils/userAuth';
import couponModel from '@/models/couponModel';
export async function POST(req) {
  await connect()
  try {
    const userId =  await UserAuth();
    const { couponCode } = await req.json();
    const cart = await Cart.findOne({ userId }).populate('items.productId');// Populate product details
    if (!cart) {
      return NextResponse.json({ errorType:"EMPTY",message: 'Cart is Empty' }, { status: 404 });
    }
    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    cart.items.forEach((item) => {
      totalPrice += item.productId.price * item.quantity;
      totalItem+=item.quantity;
      totalDiscountedPrice += item.productId.discountPrice * item.quantity;
    });
    let discounte = totalPrice - totalDiscountedPrice;
    let cartTotal = totalDiscountedPrice;
    if(couponCode){
    const coupon = await couponModel.findOne({
      code: couponCode,
      validUntil: { $gte: new Date() },
    });
    if (!coupon) {
      return NextResponse.json({ errorType:"COUPON",message: 'Invalid or Expired Coupon Code' }, { status: 404 });
    }
    if(minimumOrderValue > totalDiscountedPrice ){
      return NextResponse.json({ errorType:"COUPON",message: 'Copuon not reach minimum order value ' }, { status: 403 });
}
if (coupon.usedCount >= coupon.usageLimit) {
  return NextResponse.json({ errorType:"COUPON",message: 'Expired Coupon Code' }, { status: 403 });
}

// Apply coupon logic
 let  couponDiscount  = 0;
if (coupon.discountType === 'fixed') {
  couponDiscount =  coupon.discountValue;
} else if (coupon.discountType === 'percentage') {
  couponDiscount = (totalDiscountedPrice * coupon.discountValue) / 100;
}
 cartTotal =Math.max(0, totalDiscountedPrice-couponDiscount);

// Save applied coupon to cart
return NextResponse.json({ successType:"COUPON" ,message: 'Coupon Applied',couponCode,couponDiscount,discounte,cartTotal,totalPrice,totalDiscountedPrice,totalItem,items:cart.items}, { status: 200 });
  }
  return NextResponse.json({ message: 'Cart Total',discounte,cartTotal,totalPrice,totalDiscountedPrice,totalItem,items:cart.items}, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message,message:'Server error in getting price'}, { status: 500 });
  }
}
