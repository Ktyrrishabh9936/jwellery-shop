"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import Image from "next/image"
import { ChevronDown, ChevronUp, ShoppingBag, Tag, Truck, Clock } from "lucide-react"

const OrderCart = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const { Items, totalDiscountedPrice, coupon, couponDiscount } = useSelector((state) => state.cart)

  // Calculate delivery charges based on the delivery option (this should be synced with DeliveryForm)
  const deliveryCharge = 60 // Default to standard delivery
  const codFee = 0 // Default to prepaid

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  if (!Items || Items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 text-sm">Add items to your cart to proceed with checkout</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
        <button
          onClick={toggleExpand}
          className="text-gray-500 hover:text-gray-700 md:hidden"
          aria-label={isExpanded ? "Collapse order summary" : "Expand order summary"}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-4 mb-6">
            {Items.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + item.img_src || "/placeholder.svg"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium text-gray-900">₹{item.discountedPrice.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{totalDiscountedPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>
            </div>

            {codFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">COD Fee</span>
                <span className="font-medium">₹{codFee.toFixed(2)}</span>
              </div>
            )}

            {coupon && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center">
                  <Tag className="h-3 w-3 mr-1" /> Coupon Discount
                </span>
                <span>-₹{couponDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-pink-600">
                  ₹{(totalDiscountedPrice + deliveryCharge + codFee - (couponDiscount || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-start">
            <Truck className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Estimated delivery: 5-7 business days</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Order processing time: 1-2 business days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderCart
