import { connect } from "@/dbConfig/dbConfig";
import Coupon from "@/models/couponModel";
import User from "@/models/userModel";

export async function POST(req) {
  try {
    await connect();

    const {  couponCode, totalDiscountedPrice } = await req.json();

    // const user = await User.findById(userId);

    // if (!user) {
    //   return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    // }

    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return new Response(JSON.stringify({ success: false, message: "Invalid coupon code" }), { status: 400 });
    }

    // if (user.couponUsed.some((usedCoupon) => usedCoupon._id.toString() === coupon._id.toString())) {
    //   return new Response(JSON.stringify({ success: false, message: "Coupon already used" }), { status: 400 });
    // }

    if (new Date() > coupon.validUntil) {
      return new Response(JSON.stringify({ success: false, message: "Coupon expired" }), { status: 400 });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return new Response(JSON.stringify({ success: false, message: "Coupon usage limit exceeded" }), { status: 400 });
    }

    if (coupon.minimumOrderValue > totalDiscountedPrice) {
      return new Response(JSON.stringify({ success: false, message: `Minimum order amount is ${coupon.minOrderAmount}` }), { status: 400 });
    }


    return new Response(JSON.stringify({ success: true, message: "Coupon is valid", discountType: coupon.discountType, discountValue: coupon.discountValue,minvalue:coupon.minimumOrderValue,couponCode:coupon.code }), { status: 200 });

  } catch (error) {
    console.error("Error validating coupon:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error" }), { status: 500 });
  }
}

export async function GET(req) {
  await connect();
  const coupons = await Coupon.find({});
  return new Response(JSON.stringify(coupons), { status: 200 });
}

