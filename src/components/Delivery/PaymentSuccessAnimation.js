"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const PaymentSuccessAnimation = ({ orderDetails, onComplete }) => {
  const [showAnimation, setShowAnimation] = useState(true)
  const [animationStep, setAnimationStep] = useState(1)
  const navigate = useRouter()

  useEffect(() => {
    // Step 1: Initial animation
    const step1Timer = setTimeout(() => {
      setAnimationStep(2)
    }, 1000)

    // Step 2: Show check mark
    const step2Timer = setTimeout(() => {
      setAnimationStep(3)
    }, 2000)

    

    return () => {
      clearTimeout(step1Timer)
      clearTimeout(step2Timer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center"
        >
          <div className="max-w-md w-full px-6">
            {/* PhonePe-style animation */}
            <div className="flex flex-col items-center justify-center">
              {/* Step 1: Logo animation */}
              {animationStep >= 1 && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <Image src="/Jenii-Logo.svg" alt="Jenii Logo" width={120} height={120} className="h-24 w-auto" />
                </motion.div>
              )}

              {/* Step 2: Success checkmark */}
              {animationStep >= 2 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="mb-6"
                >
                  <div className="bg-green-100 rounded-full p-4">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Order details */}
              {animationStep >= 3 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                  <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>

                  {orderDetails && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-gray-50 p-4 rounded-md mb-6 text-left"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-medium">{orderDetails.orderNumber}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">₹{Number.parseFloat(orderDetails.amount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(orderDetails.date).toLocaleDateString("en-IN")}</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
              <button className=" py-2 px-4 bg-pink-400 text-white" onClick={()=>navigate.push("/")}> Go back to home &rarr; </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentSuccessAnimation
