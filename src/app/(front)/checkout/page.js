"use client";
import React, { useEffect, useState } from "react";
import Footer from "@/components/HomePage/Footer";
import NavBar from "@/components/HomePage/Navbar";
import Image from "next/image";
import { Button } from "@/MaterialTailwindNext";
import CheckoutLoader from "@/components/Loaders/CheckoutLoader";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, applyCoupon, removeCoupon, removefromCart } from '@/lib/reducers/cartReducer'
import { AddwishList } from "@/lib/reducers/productbyIdReducer";
import { CheckCircle, LoaderPinwheel, X } from "lucide-react";
import Cookies from "js-cookie";
export default function ShoppingCart() {
  const { loading, Items, loadingRemoveProduct, discounte, loadingProductId, totalDiscountedPrice, totalItem, totalPrice,coupon,couponDiscount,loadingCoupon } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { wishListByID, loadWishlist } = useSelector((state) => state.wishlist);
  const { user } = useSelector((store) => store.user);

  const [couponCode,setCouponCode]=useState("");
  // const [success,setSuccess]=useState(false);
  // const [error,setError]=useState(false);
  // const handleCheckout = () => {
  //   if (user) {
  //     navigate.push('/delivery')
  //   }
  //   else {
  //     navigate.push('/login')
  //   }
  // }
  useEffect(() => {
    if(!coupon){
    const couponCode = Cookies.get("cpn-cde");
    if (couponCode) { dispatch(applyCoupon({couponCode})) }
    }
  }, [])
  const formatPrice = (price) => {
    return price ? ` ₹ ${parseFloat(price).toFixed(2)}` : "N/A";
  };



  return (
    <>
      <NavBar />

      {!loading ? <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
        {/* Cart Items Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {totalItem === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-full shadow-md">
                  <ShoppingBagIcon className="h-16 w-16 text-gray-400" />
                </div>

                <h2 className="text-2xl font-semibold text-gray-700 mt-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>

                <Link href="/shop">
                  <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition duration-300">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            ) : (
              <>
                {Items?.map((item, ind) => {
                  return (
                    <div key={ind} className="flex flex-col md:flex-row items-center border p-4 rounded-lg">
                      <Image
                        height={96}
                        width={96}
                        src={item.img_src}
                        alt={item.name}
                        className="w-24 h-24 object-cover mr-4"
                      />
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[#1E1E1E] font-semibold text-base">
                            {formatPrice(item.discountedPrice)}
                          </span>
                          <strike className=" text-[#F42222] text-xs  line-clamp-1">
                            {formatPrice(item.price)}
                          </strike>

                        </div>
                        <h2 className="font-semibold text-[#2A2A2A]">
                          {item.name || "Unknown Product"}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {/* Add gift wrap to your order (₹50) */}
                          Quantity - {item.quantity}
                        </p>

                        <div className="mt-4 md:mt-0 flex space-x-4 w-full">
                          {user ? loadWishlist === item.productId ? <Button className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] hover:text-black transition-colors duration-300 py-2 px-4 rounded-md w-full capitalize text-sm">
                            Adding...
                          </Button> :
                            wishListByID.some((wid) => wid === item.productId) ? <Button className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] hover:text-black transition-colors duration-300 py-2 px-4 rounded-md w-full capitalize text-sm" >
                              Already In Wishlist
                            </Button> : <Button className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] hover:text-black transition-colors duration-300 py-2 px-4 rounded-md w-full capitalize text-sm" onClick={() => dispatch(AddwishList(item.productId))}>
                              Add to Wishlist
                            </Button> : ""}
                          {!user && <Button
                            className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] transition-colors py-2 duration-300 px-4 rounded-md w-full capitalize text-sm"
                            onClick={() => dispatch(addToCart(item))}
                            disabled={loadingProductId === item.productId}
                          >
                            {loadingProductId === item.productId ? "Adding..." : "Add More"}
                          </Button>}
                          {loadingRemoveProduct === item.productId ? <button
                            className="mt-4 border-2  bg-gray-500 text-[#F8C0BF] duration-300 py-2 px-4 rounded-md w-full capitalize text-sm"
                          >
                            Removing...
                          </button> : <Button
                            className="mt-4 border-2 border-gray-500 bg-white text-black hover:bg-[#F8C0BF] transition-colors hover:border-[#F8C0BF] duration-300 py-2 px-4 rounded-md w-full capitalize text-sm"
                            onClick={() => dispatch(removefromCart(item.productId))}
                          >
                            Remove
                          </Button>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )
            }
            {/* {totalItem !== 0 ? <div className="mt-8">
          <button className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600"
           onClick={()=>navigate.push('/delivery')}>
            Checkout Securely
          </button>
        </div>:""} */}
          </div>
<div className="p-6  ">
<h2 className="text-xl font-semibold mb-4 ">Apply Coupons</h2>
          <div className="space-y-2 mb-4">
             { loadingCoupon ?  <div className=" inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin">
            <LoaderPinwheel size={50} className="text-pink-400" />
          </div>
        </div> : coupon ?   <div className="flex items-center justify-between border border-green-400 rounded-lg p-4 bg-green-50">
      <div className="flex items-center gap-2">
        <CheckCircle className="text-green-500 w-5 h-5" />
        <div>
          <p className="font-semibold text-gray-900">{coupon?.couponCode} applied</p>
          { coupon.discountType === "percentage" ? <p className="text-sm text-gray-600">{couponDiscount.toFixed(2)} ({coupon?.discountValue})% off</p>:<p className="text-sm text-gray-600">Rs {couponDiscount.toFixed(2)} OFF</p>}
        </div>
      </div>
      <button onClick={()=>dispatch(removeCoupon())}  className="text-pink-500 font-semibold hover:underline">
        Remove
      </button>
    </div>: <div className=" flex justify-between "> 
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border border-pink-300  bg-gray-50 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
                  />
                  <button
                    className="bg-pink-500 hover:bg-pink-300 text-yellow-50 font-bold p-2 rounded-md transition duration-300 mt-3 md:mt-0 text-sm px-3 py-2"
                    onClick={()=>dispatch(applyCoupon({  couponCode, totalDiscountedPrice }))}
                  >
                    Apply Coupon
                  </button>
              </div>}

              
            
            </div>

          {/* Order Summary Section */}
          <div className="border  rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span>Estimated Total:</span>
              <span className="font-bold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Discount :</span>
              <span className="font-bold">-{formatPrice(discounte)}</span>
            </div>
          {coupon &&  <div className="flex justify-between mb-4">
              <span>Coupon Discount:</span>
              <span className="font-bold">-{formatPrice(couponDiscount)}</span>
            </div>}
            <div className="flex justify-between mb-4">
              <span>Cart Total:</span>
              <span className="font-bold">{formatPrice(totalDiscountedPrice)}</span>
            </div>
         
            {totalItem !== 0 ? <div className="mt-8">
              <button className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600"
                onClick={()=> navigate.push('/delivery')}>
                Checkout Securely
              </button>
            </div> : ""}
          </div>
          </div>

        </div>


      </div> : <CheckoutLoader />}

      <Footer />
    </>
  );
}
