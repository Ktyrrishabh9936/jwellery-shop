"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email is required.")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post("/api/users/forgot-password", { email })

      if (response.data.success) {
        setEmailSent(true)
        toast.success("Password reset link sent to your email!")
      }
    } catch (error) {
      console.error("Error sending reset email:", error)
      const errorMessage = error.response?.data?.message || "Failed to send reset email. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>

            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. Please check your email and click the link
              to reset your password.
            </p>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-primary-700">
                <strong>Didn't receive the email?</strong> Check your spam folder or try again in a few minutes.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                }}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Try Different Email
              </button>

              <Link
                href="/login"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 inline-block text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className=" px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Image src="/J-logo.png" alt="Jenii Logo" width={40} height={40} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
            <p className="text-primary-100 mt-2">No worries! Enter your email and we'll send you a reset link.</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                      error ? "border-red-300 bg-red-50" : "border-gray-300 bg-white"
                    }`}
                    placeholder="Enter your email address"
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">!</span>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our{" "}
            <Link href="/ContactUs" className="text-primary-600 hover:text-primary-700 font-medium">
              support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
