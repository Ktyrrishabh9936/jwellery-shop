import { connect } from "@/dbConfig/dbConfig";
import Coupon from "@/models/couponModel";
export async function GET(req) {
  await connect();
  const coupons = await Coupon.find({});
  return new Response(JSON.stringify(coupons), { status: 200 });
}

