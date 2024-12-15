"use client";
import React from "react";
import Footer from "@/components/HomePage/Footer";
import NavBar from "@/components/HomePage/Navbar";
import Image from "next/image";
import { Button } from "@/MaterialTailwindNext";
import CheckoutLoader from "@/components/Loaders/CheckoutLoader";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { removefromCart } from '@/lib/reducers/cartReducer'
import { AddwishList } from "@/lib/reducers/productbyIdReducer";
export default function ShoppingCart() {
  const {loading,Items,loadingRemoveProduct,discounte, totalDiscountedPrice, totalItem,totalPrice} = useSelector((state)=>state.cart);
  const dispatch = useDispatch();
  const navigate = useRouter();
  const {wishListByID,loadWishlist}= useSelector((state)=>state.wishlist);
  
  const formatPrice = (price) => {
    return price ? `${parseFloat(price).toFixed(2)}` : "N/A";
  };

  return (
    <>
      <NavBar />

      {! loading  ?<div className="container mx-auto p-6">
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
              {Items?.map((item,ind) => {
                return (
                  <div key={ind} className="flex flex-col md:flex-row items-center border p-4 rounded-lg">
                    <Image
                      height={96}
                      width={96}
                      src={item.img_src }
                      alt={item.name }
                      className="w-24 h-24 object-cover mr-4"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[#1E1E1E] font-semibold text-base">
                          {formatPrice(item.discountedPrice)}
                        </span>

                      </div>
                      <h2 className="font-semibold text-[#2A2A2A]">
                        {item.name || "Unknown Product"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Add gift wrap to your order (₹50)
                      </p>

                      <div className="mt-4 md:mt-0 flex space-x-4 w-full">
                   {  loadWishlist === item.productId  ?  <Button className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] hover:text-black transition-colors duration-300 py-2 px-4 rounded-md w-full capitalize text-sm">
                          Adding...
                        </Button>:
                        wishListByID.some((wid)=>wid===item.productId) ?<Button className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] hover:text-black transition-colors duration-300 py-2 px-4 rounded-md w-full capitalize text-sm" >
                       Already In Wishlist
                      </Button>:<Button className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] hover:text-black transition-colors duration-300 py-2 px-4 rounded-md w-full capitalize text-sm" onClick={()=>dispatch(AddwishList(item.productId))}>
                          Add to Wishlist
                        </Button>}
                       {loadingRemoveProduct === item.productId ? <button
                          className="mt-4 border-2  bg-gray-500 text-[#F8C0BF] duration-300 py-2 px-4 rounded-md w-full capitalize text-sm"
                        >
                          Removing...
                        </button> : <Button
                          className="mt-4 border-2 border-gray-500 bg-white text-black hover:bg-[#F8C0BF] transition-colors hover:border-[#F8C0BF] duration-300 py-2 px-4 rounded-md w-full capitalize text-sm"
                          onClick={()=>dispatch(removefromCart(item.productId))}
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
            {totalItem !== 0 ? <div className="mt-8">
          <button className="w-full py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600"
           onClick={()=>navigate.push('/delivery')}>
            Checkout Securely
          </button>
        </div>:""}
          </div>

          {/* Order Summary Section */}
          <div className="border p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-4">
              <span>Estimated Total:</span>
              <span className="font-bold">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Discount :</span>
              <span className="font-bold">-{formatPrice(discounte)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Cart Total:</span>
              <span className="font-bold">{formatPrice(totalDiscountedPrice)}</span>
            </div>
            {/* <div className="flex justify-between mb-4">
              <span>Coupon Applied:</span>
              <span className="font-bold">{-formatPrice(200)}</span>
            </div> */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Coupon Code"
                className="border w-full p-2 rounded-md"
              />
              <p className="text-xs text-gray-400">
                Per India flat shipping for orders above ₹500
              </p>
            </div>
          </div>
          
        </div>

        
      </div>:<CheckoutLoader/> }

      <Footer />
    </>
  );
}
