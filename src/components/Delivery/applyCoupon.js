import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon } from "@/redux/features/coupon/couponSlice";

const CouponComponent = ({ orderValue }) => {
  const dispatch = useDispatch();
  const { coupon_info, loading, error } = useSelector((state) => state.coupon);
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    dispatch(applyCoupon({ code: couponCode, orderValue }));
  };

  return (
    <div className="coupon-component">
      <h2 className="text-xl font-bold mb-4">Apply Coupon</h2>
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Enter coupon code"
        className="border bg-[#F2F2F2] text-black rounded-lg p-3 w-full md:w-1/2 mb-6"
      />
      <button
        onClick={handleApplyCoupon}
        className="bg-[#BC264B] hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg"
        disabled={loading}
      >
        {loading ? "Applying..." : "Apply Coupon"}
      </button>
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
      {coupon_info && (
        <div className="mt-4 p-4 border rounded-lg bg-green-100">
          <h3 className="text-lg font-semibold">Coupon Applied</h3>
          <p>Code: {coupon_info.code}</p>
          <p>Discount: {coupon_info.discountValue} {coupon_info.discountType === "percentage" ? "%" : "$"}</p>
        </div>
      )}
    </div>
  );
};

export default CouponComponent;