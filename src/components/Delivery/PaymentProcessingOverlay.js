"use client"
import { motion } from "framer-motion"
import { Loader2, CheckCircle } from "lucide-react"

const PaymentProcessingOverlay = ({ message, success, orderDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        {success ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>

            {orderDetails && (
              <div className="bg-gray-50 p-4 rounded-md mb-4 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">{orderDetails.orderNumber}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{Number.parseFloat(orderDetails.amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{orderDetails.items}</span>
                </div>
              </div>
            )}

            <p className="text-gray-500 text-sm">Redirecting to order confirmation page...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Loader2 className="h-12 w-12 text-pink-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{message || "Processing your payment..."}</h2>
            <p className="text-gray-500 text-sm">Please don't close this window or refresh the page.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default PaymentProcessingOverlay
