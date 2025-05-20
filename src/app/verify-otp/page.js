"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import OTPInput from "@/components/OTPInput/OTPInput"
import Image from "next/image"
import Link from "next/link"

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const hashedOTP = searchParams.get("hashedOTP")
  const redirectTo = searchParams.get("redirectTo") || "/login"
  const isDeliveryPage = searchParams.get("isDeliveryPage") === "true"
  const isForgotPassword = searchParams.get("forgotPassword") === "true"

  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true)

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setResendDisabled(false)
    }
  }, [countdown])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleResendOTP = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/api/users/send-email-otp", { email })

      // Update URL with new hashedOTP
      const params = new URLSearchParams(window.location.search)
      params.set("hashedOTP", response.data.hashedOTP)
      router.replace(`/verify-otp?${params.toString()}`)

      setCountdown(300)
      setResendDisabled(true)
      toast.success("New OTP sent to your email")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (otpValue) => {
    if (!email || !hashedOTP) {
      toast.error("Missing required information")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("/api/users/mail-verify-otp", {
        email,
        otp: otpValue,
        hashedOTP,
        isDeliveryPage,
      })

      toast.success(response.data.message)

      // Handle different scenarios
      if (isForgotPassword) {
        router.push(`/update-password?userId=${response.data.userId}`)
      } else if (isDeliveryPage) {
        if (response.data.newUserCreated) {
          toast.success("Account created! Check your email for login details.")
        }
        router.push(redirectTo)
      } else {
        router.push("/login")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }

  if (!email || !hashedOTP) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Invalid Request</h2>
          <p className="mb-6">Missing required information to verify OTP.</p>
          <Link
            href="/login"
            className="px-4 py-2 bg-[#BC264B] text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-0 sm:py-10 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/">
            <Image width={80} height={80} src="/Jenii-Logo.svg" alt="Jenii" className="mx-auto" />
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">
            We've sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="mb-8">
          <OTPInput length={6} onComplete={verifyOTP} />

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {countdown > 0 ? (
                <>
                  Code expires in <span className="font-medium">{formatTime(countdown)}</span>
                </>
              ) : (
                <span className="text-red-600">Code expired</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>

          <button
            onClick={handleResendOTP}
            disabled={resendDisabled || loading}
            className={`px-4 py-2 rounded-md transition-colors ${
              resendDisabled || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#BC264B] text-white hover:bg-red-700"
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 border-t-transparent border-solid animate-spin rounded-full border-white border-2 mr-2"></div>
                Processing...
              </div>
            ) : (
              "Resend Code"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
