"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Link from "next/link"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FaGoogle } from "react-icons/fa"
import { signIn, signOut, useSession } from "next-auth/react"
import OTPInput from "@/components/OTPInput/OTPInput"
import { EyeIcon, EyeOffIcon } from "lucide-react"

// Yup validation schema for sign-up
const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().required("Email is required").email("Must be a valid email"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
})

export default function SignUp() {
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showVerification, setShowVerification] = useState(false)
  const [hashedOTP, setHashedOTP] = useState("")
  const [formData, setFormData] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useRouter()

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)

    try {
      // First check if user already exists
      const checkUserResponse = await axios.post("/api/users/check-user-exists", {
        email: data.email,
      })

      if (checkUserResponse.data.exists) {
        setError("User already exists with this email address")
        setLoading(false)
        return
      }

      // Send OTP for verification
      const response = await axios.post("/api/users/send-email-otp", {
        email: data.email,
      })

      setHashedOTP(response.data.hashedOTP)
      setFormData(data)
      setShowVerification(true)
      toast.success("Verification code sent to your email")
    } catch (error) {
      setError(error.response?.data?.message || "Error during registration")
      toast.error(error.response?.data?.message || "Error during registration")
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async (otpValue) => {
    if (!formData || !hashedOTP) {
      toast.error("Missing required information")
      return
    }

    try {
      setLoading(true)

      // First verify the OTP
      const verifyResponse = await axios.post("/api/users/mail-verify-otp", {
        email: formData.email,
        otp: otpValue,
        hashedOTP,
      })

      // If OTP is verified, create the user
      const createUserResponse = await axios.post("/api/users/signup", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        isEmailVerified: true,
      })

      toast.success("User created successfully!")
      navigate.push("/login")
    } catch (error) {
      setError(error.response?.data?.message || "Error during verification")
      toast.error(error.response?.data?.message || "Error during verification")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!formData?.email) return

    try {
      setLoading(true)
      const response = await axios.post("/api/users/send-email-otp", {
        email: formData.email,
      })

      setHashedOTP(response.data.hashedOTP)
      toast.success("New verification code sent to your email")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend verification code")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-[100vh] py-0 sm:py-10 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          {showVerification ? (
            // OTP Verification View
            <div className="text-center">
              <Link href="/">
                <Image width={80} height={80} src="/Jenii-Logo.svg" alt="Jenii" className="mx-auto" />
              </Link>
              <h2 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Verify Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification code to <span className="font-medium">{formData?.email}</span>
              </p>

              <OTPInput length={6} onComplete={verifyOTP} />

              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    loading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#BC264B] text-white hover:bg-red-700"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="h-4 w-4 border-t-transparent border-solid animate-spin rounded-full border-white border-2 mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Resend Code"
                  )}
                </button>

                <div className="mt-4">
                  <button
                    onClick={() => setShowVerification(false)}
                    className="text-gray-600 hover:text-gray-800 underline"
                  >
                    Back to Sign Up
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Registration Form View
            <>
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
              <Link href="/">
                <Image width={80} height={80} src="/Jenii-Logo.svg" alt="Jenii" className="mx-auto" />
              </Link>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    {...register("name")}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    {...register("email")}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    {...register("phone")}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="mt-1 block w-full px-3 py-2 bg-[#F2F2F2] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <Link href="/login" className="text-sm text-red-600 hover:underline">
                    Already have an account? Login
                  </Link>
                  {loading ? (
                    <button
                      type="button"
                      className="bg-[#fe6161] h-max w-max rounded-lg text-white font-bold hover:cursor-not-allowed duration-[500ms,800ms]"
                      disabled
                    >
                      <div className="flex gap-1 items-center justify-center m-[10px]">
                        <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
                        Processing...
                      </div>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#BC264B] text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  )}
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              </form>
              {!session ? (
                <button
                  onClick={() => signIn("google")}
                  className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mx-auto mb-3"
                >
                  <span>
                    <FaGoogle />
                  </span>
                  <span className="pl-3">Continue with Google</span>
                </button>
              ) : (
                <button
                  onClick={() => signOut()}
                  className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mx-auto mb-3"
                >
                  Sign out
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
