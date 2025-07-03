"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import axios from "axios"
import Script from "next/script"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useSession } from "next-auth/react"
import { applyCoupon, clearCart } from "@/lib/reducers/cartReducer"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import debounce from "lodash/debounce"

// Icons
import {
  CheckCircle,
  Truck,
  MapPin,
  CreditCard,
  AlertCircle,
  Loader2,
  Building,
  Mail,
  ShieldCheck,
  Clock,
  ChevronRight,
  ArrowLeft,
  LockKeyhole,
  CreditCardIcon,
  BanknoteIcon,
  BadgeCheck,
  Info,
  Tag,
  Zap,
} from "lucide-react"

// Custom components
import Addressform from "./Addressform"
import PaymentProcessingOverlay from "./PaymentProcessingOverlay"
import PaymentSuccessAnimation from "./PaymentSuccessAnimation"

const DeliveryForm = () => {
  const navigate = useRouter()
  const dispatch = useDispatch()
  const { Items, coupon, couponDiscount, loadingCoupon, totalDiscountedPrice, totalPrice, discounte } = useSelector(
    (state) => state.cart,
  )

  const { user } = useSelector((state) => state.user)
  const session = useSession()
  const razorpayRef = useRef(null)

  // State management
  const [activeStep, setActiveStep] = useState(1) // 1: Shipping, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState("Prepaid")
  const [showThankYou, setShowThankYou] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sameBillingAddress, setSameBillingAddress] = useState(true)
  const [pincodeServiceable, setPincodeServiceable] = useState(null)
  const [checkingPincode, setCheckingPincode] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState("standard")
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [email, setEmail] = useState("")
  const [verifyOtp, setverifyOtp] = useState("")
  const [hashedOTP, setHashedOTP] = useState(null)
  const [showotp, setshowotp] = useState(false)
  const [userId, setUserId] = useState("")
  const [timer, setTimer] = useState(30)
  const [isResendDisabled, setIsResendDisabled] = useState(false)
  const [getotperror, setgetotpError] = useState("")
  const [getotpLoading, setgetotpLoading] = useState(false)
  const [verifyOtperror, setverifyOtpError] = useState("")
  const [verifyOtpLoading, setverifyOtpLoading] = useState(false)
  const [deliveryEstimate, setDeliveryEstimate] = useState(null)
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false)
  const [shippingOptions, setShippingOptions] = useState({
    standard: null,
    express: null,
  })
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const [processingMessage, setProcessingMessage] = useState("Processing your payment...")

  // Form validation schema
  const AddressSchema = Yup.object().shape({
    sameBillingAddress: Yup.boolean().required().default(true),
    email: user
      ? Yup.string().email("Invalid Email")
      : Yup.string().email("Invalid Email").required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    contact: Yup.string()
      .matches(/^\d{7,15}$/, "Phone number must be between 7-15 digits")
      .required("Phone number is required"),
    addressline1: Yup.string().required("Address Line 1 is required"),
    addressline2: Yup.string(),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    postalCode: Yup.string()
      .required("Postal code is required")
      .matches(/^[0-9]{6}$/, "Must be a valid 6-digit postal code"),
    countryCode: Yup.string().required("Country code is required"),
    // Billing address fields (conditional)
    billingFirstName: Yup.string().when("sameBillingAddress", {
      is: false,
      then: () => Yup.string().required("Billing First Name is required"),
      otherwise: () => Yup.string(),
    }),
    billingLastName: Yup.string().when("sameBillingAddress", {
      is: false,
      then: () => Yup.string().required("Billing Last Name is required"),
      otherwise: () => Yup.string(),
    }),
    billingContact: Yup.string().when("sameBillingAddress", {
      is: false,
      then: () =>
        Yup.string()
          .matches(/^\d{7,15}$/, "Phone number must be between 7-15 digits")
          .required("Billing Phone number is required"),
      otherwise: () => Yup.string(),
    }),
    billingAddressline1: Yup.string().when("sameBillingAddress", {
      is: false,
      then: () => Yup.string().required("Billing Address Line 1 is required"),
      otherwise: () => Yup.string(),
    }),
    billingCity: Yup.string().when("sameBillingAddress", {
      is: false,
      then: () => Yup.string().required("Billing City is required"),
      otherwise: () => Yup.string(),
    }),
    billingState: Yup.string().when("sameBillingAddress", {
      is: false,
      then: () => Yup.string().required("Billing State is required"),
      otherwise: () => Yup.string(),
    }),
    billingCountry: Yup.string().when("sameBillingAddress", {
      is: false,
      then: () => Yup.string().required("Billing Country is required"),
      otherwise: () => Yup.string(),
    }).default("India"),
    billingPostalCode: Yup.string().when("sameBillingAddress", {
      is: false,
      then: () =>
        Yup.string()
          .required("Billing Postal code is required")
          .matches(/^[0-9]{6}$/, "Must be a valid 6-digit postal code"),
      otherwise: () => Yup.string(),
    }),
  })

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
    reset,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(AddressSchema),
    defaultValues: {
      countryCode: "+91",
      email: user ? user?.email : "",
      sameBillingAddress: true,
      billingCountry:"India"
    },
    mode: "onChange",
  })

  const watchPostalCode = watch("postalCode")
  const verifiedEmail = watch("email")

  // Debounced pincode check
  const debouncedCheckPincode = useCallback(
    debounce((pincode) => {
      checkPincodeServiceability(pincode)
    }, 500),
    [paymentMethod, totalDiscountedPrice],
  )

  // Effects
  useEffect(() => {
    if (!coupon) {
      const couponCode = Cookies.get("cpn-cde")
      if (couponCode) {
        dispatch(applyCoupon({ couponCode, totalDiscountedPrice }))
      }
    }

    // Set user email if available
    if (user && user.email) {
      setValue("email", user.email)
      setEmail(user.email)
    }
  }, [])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setIsResendDisabled(false)
    }
  }, [timer])

  // Check pincode serviceability when postal code or payment method changes
  useEffect(() => {
    if (watchPostalCode && watchPostalCode.length === 6) {
      debouncedCheckPincode(watchPostalCode)
    } else {
      setPincodeServiceable(null)
      setDeliveryEstimate(null)
      setShippingOptions({ standard: null, express: null })
    }
  }, [watchPostalCode, paymentMethod, debouncedCheckPincode])

  // Update delivery charge when delivery option or payment method changes
  useEffect(() => {
    if (shippingOptions) {
      const selectedOption = deliveryOption === "express" ? shippingOptions.express : shippingOptions.standard

      if (selectedOption) {
        // Base shipping rate
        const rate = selectedOption.rate || 0

        // Add COD fee if applicable
        setDeliveryCharge(rate)

        // Set delivery estimate
        setDeliveryEstimate(selectedOption.etd || (deliveryOption === "express" ? 2 : 5))
      } else {
        setDeliveryCharge(0)
        setDeliveryEstimate(null)
      }
    }
  }, [shippingOptions, deliveryOption, paymentMethod])

  // Cleanup Razorpay instance on unmount
  useEffect(() => {
    return () => {
      if (razorpayRef.current) {
        razorpayRef.current.close()
      }
    }
  }, [])

  // Handlers
  const checkPincodeServiceability = async (pincode) => {
    if (!pincode || pincode.length !== 6) return

    setCheckingPincode(true)
    setPincodeServiceable(null)
    setShippingOptions({ standard: null, express: null })

    try {
      const response = await axios.get(
        `/api/shipping/check-pincode?pincode=${pincode}&ordervalue=${totalDiscountedPrice}&cod=${paymentMethod === "COD" ? 1 : 0}`,
      )

      if (response.data.success && response.data.serviceability) {
        setPincodeServiceable(true)
        setShippingOptions(response.data.shipping_options)

        // Set city and state from pincode data if available
        if (response.data.shipping_options.standard) {
          if (activeStep === 1) {
            setValue("state", response.data.shipping_options.standard.state);
            setValue("city", response.data.shipping_options.standard.city)
          }
          setValue("state", response.data.shipping_options.standard.state)
          setDeliveryOption("standard")
          setDeliveryEstimate(response.data.shipping_options.standard.etd || 5)
        } else if (response.data.shipping_options.express) {
          setDeliveryOption("express")
          setDeliveryEstimate(response.data.shipping_options.express.etd || 2)
        }

      } else {
        setPincodeServiceable(false)
        setDeliveryEstimate(null)
        toast.error(response.data.message || "Delivery not available to this pincode")
      }
    } catch (error) {
      setPincodeServiceable(false)
      setDeliveryEstimate(null)
      toast.error(error.response?.data?.message || "Unable to check pincode serviceability")
    } finally {
      setCheckingPincode(false)
    }
  }

  const getOtpverifyEmail = async (e) => {
    e.preventDefault()
    setgetotpError("")

    if (!email) {
      setgetotpError("Email is required.")
      return
    }

    setgetotpLoading(true)
    try {
      const response = await axios.post("/api/users/send-email-otp", { email })
      if (response.data.hashedOTP) {
        setHashedOTP(response.data.hashedOTP)
        setgetotpLoading(false)
        setTimer(30)
        setIsResendDisabled(true)
        setshowotp(true)
        toast.success(response.data.message || "OTP sent successfully")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      setgetotpError("Failed to send OTP.")
      setgetotpLoading(false)
      toast.error("Failed to send OTP. Please try again.")
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!verifyOtp) {
      setverifyOtpError("OTP is required.")
      return
    }

    setverifyOtpLoading(true)
    try {
      const response = await axios.post("/api/users/mail-verify-otp", {
        email,
        otp: verifyOtp,
        hashedOTP,
        isDeliveryPage:true
      })
      toast.success(response.data.message)
      setValue("email", email)
      setUserId(response.data.userId)
      setverifyOtpLoading(false)
    } catch (error) {
      setverifyOtpError("Failed to verify OTP.")
      toast.error("Failed to verify OTP. Please try again.")
      setverifyOtpLoading(false)
    }
  }

  const handleContinueToPayment = async () => {
    // Validate the form
    const isFormValid = await trigger()
    if (isFormValid && (user || userId)) {
      if (!pincodeServiceable) {
        toast.error("Delivery is not available to this pincode")
        return
      }
      setActiveStep(2)
      scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      
    } else {
      toast.error("Please complete all required fields and verify your email")
    }
  }

  const handleBackToShipping = () => {
    setActiveStep(1)
    scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const onSubmitPrepaid = async (formdata) => {
    if (!pincodeServiceable) {
      toast.error("Delivery is not available to this pincode")
      return
    }

    try {
      setIsLoading(true)
      setShowProcessingOverlay(true)
      setProcessingMessage("Creating your order...")

      // Format shipping address
      const shippingAddress = {
        name: formdata.firstName,
        lastname: formdata.lastName,
        email: formdata.email || user?.email,
        contact: formdata.contact,
        address: formdata.addressline1,
        addressline2: formdata.addressline2,
        city: formdata.city,
        state: formdata.state,
        country: formdata.country,
        pincode: formdata.postalCode,
      }

      // Format billing address if different
      let billingAddress = null
      if (!sameBillingAddress) {
        billingAddress = {
          name: formdata.billingFirstName,
          lastname: formdata.billingLastName,
          contact: formdata.billingContact,
          address: formdata.billingAddressline1,
          addressline2: formdata.billingAddressline2,
          city: formdata.billingCity,
          state: formdata.billingState,
          country: formdata.billingCountry,
          pincode: formdata.billingPostalCode,
        }
      }

      // Get selected shipping option
      const selectedShippingOption = deliveryOption === "express" ? shippingOptions.express : shippingOptions.standard

      // Add delivery option and charge to the order data
      const orderData = {
        Items,
        couponCode: coupon?.couponCode,
        userId: user?._id || userId,
        deliveryOption,
        deliveryCharge,
        selectedCourier: selectedShippingOption,
        shippingAddress,
        billingAddress,
        useSameForBilling: sameBillingAddress,
      }

      setProcessingMessage("Connecting to payment gateway...")
      const { data } = await axios.post("/api/payment/create-order", orderData)
      const { order, amount, orderID, orderNumber } = data

      setProcessingMessage("Initializing payment...")
      const razorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Jenii JP Sterling Silver",
        description: "Purchase Product",
        image: "https://cdn.bio.link/uploads/profile_pictures/2024-10-07/WpsNql0qow0baLnfnBowFm8v5fK9twVm.png",
        order_id: order.id,
        handler: async (response) => {
          try {
            setProcessingMessage("Verifying payment...")
            // Payment successful, send data to backend
            const paymentData = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount,
              shippingAddress,
              Items,
              userId: user?._id || userId,
              couponCode: coupon?.couponCode,
              deliveryOption,
              deliveryCharge,
              selectedCourier: selectedShippingOption,
              orderID,
              billingAddress,
              orderNumber,
              useSameForBilling: sameBillingAddress,
            }

            const verifyResponse = await axios.post(`/api/payment/verify-payment/`, paymentData)

            if (verifyResponse.data.success) {
              setProcessingMessage("Payment successful!")
              
              setOrderDetails({
                orderNumber: orderNumber,
                amount: amount,
                orderID: orderID,
                items: Items.length,
                date: new Date().toISOString(),
              })

              // Show success animation
              
              // Clear the cart
              setPaymentSuccess(true)
              
              dispatch(clearCart())
              setIsLoading(false)
              // navigate.push(`/order-confirmation/${orderNumber}`)
            } else {
              setShowProcessingOverlay(false)
              toast.error("Payment verification failed. Please contact support.")
              setIsLoading(false)
            }
          } catch (error) {
            setShowProcessingOverlay(false)
            toast.error("Payment verification failed. Please contact support.")
            setIsLoading(false)
          }
        },
        prefill: {
          name: `${formdata.firstName} ${formdata.lastName}`,
          email: formdata.email || user?.email,
          contact: formdata.countryCode + formdata.contact,
        },
        theme: {
          color: "#BC264B",
        },
        modal: {
          ondismiss: () => {
            // setShowProcessingOverlay(false)
            setIsLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(razorpayOptions)
      razorpayRef.current = razorpay
      razorpay.open()

      razorpay.on("payment.failed", (response) => {
        // setShowProcessingOverlay(false)
        toast.error("Payment failed: " + response.error.description)
        setIsLoading(false)
      })
    } catch (error) {
      setShowProcessingOverlay(false)
      console.error("Error in submitting form:", error)
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  const handleCODPayment = async (formdata) => {
    if (!pincodeServiceable) {
      toast.error("Delivery is not available to this pincode")
      return
    }

    try {
      setIsLoading(true)
      setShowProcessingOverlay(true)
      setProcessingMessage("Processing your COD order...")

      // Format shipping address
      const shippingAddress = {
        name: formdata.firstName,
        lastname: formdata.lastName,
        email: formdata.email || user?.email,
        contact: formdata.contact,
        address: formdata.addressline1,
        addressline2: formdata.addressline2 ? formdata.addressline2 : undefined,
        city: formdata.city,
        state: formdata.state,
        country: formdata.country,
        pincode: formdata.postalCode,
      }

      // Format billing address if different
      let billingAddress = null
      if (!sameBillingAddress) {
        billingAddress = {
          name: formdata.billingFirstName,
          lastname: formdata.billingLastName,
          contact: formdata.billingContact,
          address: formdata.billingAddressline1,
          addressline2: formdata.billingAddressline2,
          city: formdata.billingCity,
          state: formdata.billingState,
          country: formdata.billingCountry,
          pincode: formdata.billingPostalCode,
        }
      }

      // Get selected shipping option
      const selectedShippingOption = deliveryOption === "express" ? shippingOptions.express : shippingOptions.standard

      const orderData = {
        Items,
        couponCode: coupon?.couponCode,
        userId: user?._id || userId,
        shippingAddress,
        deliveryOption,
        deliveryCharge,
        selectedCourier: selectedShippingOption,
        amount: calculateTotal(),
        billingAddress,
      }

      setProcessingMessage("Creating your order...")
      const { data } = await axios.post("/api/payment/cod-order", orderData)

      if (data.success) {
        setProcessingMessage("Order placed successfully!")
        setOrderDetails({
          orderNumber: data.order.orderNumber,
          amount: calculateTotal(),
          orderID: data.order.orderID,
          items: Items.length,
          date: new Date().toISOString(),
        })

        // Show success animation
        setPaymentSuccess(true)

        // Clear the cart
        dispatch(clearCart())
        
        // Wait for animation to complete before redirecting
        // setTimeout(() => {
        //   navigate.push(`/order-confirmation/${data.order.orderNumber}`)
        // }, 3000)
        setIsLoading(false)
      } else {
        setShowProcessingOverlay(false)
        toast.error(data.message || "Failed to place order")
        setIsLoading(false)
      }
    } catch (error) {
      setShowProcessingOverlay(false)
      console.error("COD payment processing failed:", error)
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.")
      setIsLoading(false)
    }
  }

  // Calculate total with all charges
  const calculateTotal = () => {
    const subtotal = totalDiscountedPrice || 0
    const shipping = deliveryCharge || 0

    return (subtotal + shipping ).toFixed(2)
  }

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Payment Processing Overlay */}
      {showProcessingOverlay && (
        <PaymentProcessingOverlay message={processingMessage} success={paymentSuccess} orderDetails={orderDetails} />
      )}

      {/* Payment Success Animation */}
      {paymentSuccess && orderDetails && (
        <PaymentSuccessAnimation
          orderDetails={orderDetails}
          onComplete={() => {
            setShowProcessingOverlay(false)
            setPaymentSuccess(false)
          }}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep >= 1 ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                <MapPin className="h-5 w-5" />
              </div>
              <span className={`text-sm mt-2 ${activeStep >= 1 ? "text-pink-600 font-medium" : "text-gray-500"}`}>
                Shipping
              </span>
            </div>

            <div className={`h-1 flex-1 mx-2 ${activeStep >= 2 ? "bg-pink-600" : "bg-gray-200"}`}></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep >= 2 ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                <CreditCard className="h-5 w-5" />
              </div>
              <span className={`text-sm mt-2 ${activeStep >= 2 ? "text-pink-600 font-medium" : "text-gray-500"}`}>
                Payment
              </span>
            </div>

            <div className={`h-1 flex-1 mx-2 ${activeStep >= 3 ? "bg-pink-600" : "bg-gray-200"}`}></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep >= 3 ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className={`text-sm mt-2 ${activeStep >= 3 ? "text-pink-600 font-medium" : "text-gray-500"}`}>
                Confirmation
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeStep === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>

                  {/* Email Verification for Guest Users */}
                  {!user && (
                    <div className="mb-8 bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                        <Mail className="mr-2 h-5 w-5 text-pink-600" /> Contact Information
                      </h3>

                      {userId ? (
                        <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <p className="text-gray-700">
                              <span className="font-medium">{verifiedEmail}</span>
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Verified
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-grow">
                              <div className="relative">
                                <input
                                  type="email"
                                  placeholder="Email address"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                />
                                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                              </div>
                              {getotperror && <p className="text-red-500 text-sm mt-1">{getotperror}</p>}
                            </div>
                            <button
                              onClick={getOtpverifyEmail}
                              disabled={getotpLoading || isResendDisabled}
                              className={`px-4 py-3 rounded-md font-medium transition-colors ${
                                getotpLoading || isResendDisabled
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-pink-600 text-white hover:bg-pink-700"
                              }`}
                            >
                              {getotpLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                              ) : isResendDisabled ? (
                                `Resend in ${timer}s`
                              ) : (
                                "Verify Email"
                              )}
                            </button>
                          </div>

                          {showotp && (
                            <div className="p-5 border border-gray-200 rounded-md bg-gray-50">
                              <h4 className="font-medium mb-3 text-gray-700">Enter Verification Code</h4>
                              <div className="flex gap-2">
                                <div className="relative flex-grow">
                                  <input
                                    type="text"
                                    maxLength={6}
                                    value={verifyOtp}
                                    onChange={(e) => setverifyOtp(e.target.value)}
                                    placeholder="6-digit code"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                  />
                                  <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                </div>
                                <button
                                  onClick={handleVerifyOtp}
                                  disabled={verifyOtpLoading}
                                  className={`px-4 py-3 rounded-md font-medium transition-colors ${
                                    verifyOtpLoading
                                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      : "bg-pink-600 text-white hover:bg-pink-700"
                                  }`}
                                >
                                  {verifyOtpLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                                  ) : (
                                    "Verify"
                                  )}
                                </button>
                              </div>
                              {verifyOtperror && <p className="text-red-500 text-sm mt-1">{verifyOtperror}</p>}
                              {isResendDisabled && (
                                <p className="text-gray-500 text-sm mt-3 flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Didn't receive the code? You can resend in {timer}s
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Shipping Address Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                      <MapPin className="mr-2 h-5 w-5 text-pink-600" /> Shipping Address
                    </h3>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <Addressform
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                        control={control}
                      />
                    </div>
                  </div>

                  {/* Pincode Serviceability Check */}
                  {watchPostalCode && watchPostalCode.length === 6 && (
                    <div className="mb-6">
                      {checkingPincode ? (
                        <div className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-md">
                          <Loader2 className="h-5 w-5 animate-spin mr-3 text-pink-600" />
                          <p className="text-gray-700">Checking delivery availability...</p>
                        </div>
                      ) : pincodeServiceable === true ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-green-800">Delivery Available</h4>
                            <p className="text-green-700 text-sm">
                              We can deliver to this pincode. Please select your preferred delivery option.
                            </p>
                            {deliveryEstimate && (
                              <p className="text-green-700 text-sm mt-1">
                                Estimated delivery time: {deliveryEstimate} days
                              </p>
                            )}
                          </div>
                        </div>
                      ) : pincodeServiceable === false ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-red-800">Delivery Not Available</h4>
                            <p className="text-red-700 text-sm">
                              Sorry, we currently don't deliver to this pincode. Please try a different address.
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Simplified Delivery Options */}
                  {pincodeServiceable && (shippingOptions.standard || shippingOptions.express) && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                        <Truck className="mr-2 h-5 w-5 text-pink-600" /> Delivery Options
                      </h3>

                      <div className="space-y-3">
                        {/* Standard Delivery Option */}
                        {shippingOptions.standard && (
                          <label
                            className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                              deliveryOption === "standard" ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryOption"
                              value="standard"
                              checked={deliveryOption === "standard"}
                              onChange={() => setDeliveryOption("standard")}
                              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center">
                                    <p className="font-medium text-gray-800">Standard Delivery</p>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    Delivery in {shippingOptions.standard.etd || 5}-
                                    {(parseInt(shippingOptions.standard.etd) || 5) + 2} business days
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-800">
                                  ₹{shippingOptions.standard.rate.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </label>
                        )}

                        {/* Express Delivery Option */}
                        {shippingOptions.express && (
                          <label
                            className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                              deliveryOption === "express" ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryOption"
                              value="express"
                              checked={deliveryOption === "express"}
                              onChange={() => setDeliveryOption("express")}
                              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                            />
                            <div className="ml-3 flex-1">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center">
                                    <p className="font-medium text-gray-800">Express Delivery</p>
                                    <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-800 text-xs font-medium rounded flex items-center">
                                      <Zap className="h-3 w-3 mr-1" /> Fast
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    Delivery in {shippingOptions.express.etd || 2}-
                                    {(shippingOptions.express.etd || 2) + 1} business days
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-800">
                                  ₹{shippingOptions.express.rate.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Billing Address Section */}
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <input
                        id="sameBillingAddress"
                        type="checkbox"
                        checked={sameBillingAddress}
                        onChange={(e) =>{ 
                          setSameBillingAddress(e.target.checked);
                           setValue("sameBillingAddress",e.target.checked)
                          } }
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sameBillingAddress" className="ml-2 text-gray-700">
                        Billing address same as shipping address
                      </label>
                    </div>

                    {!sameBillingAddress && (
                      <div className="p-6 border border-gray-200 rounded-md mt-4 bg-gray-50">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                          <Building className="mr-2 h-5 w-5 text-pink-600" /> Billing Address
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="billingFirstName" className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              id="billingFirstName"
                              {...register("billingFirstName")}
                              placeholder="First Name"
                              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                errors.billingFirstName ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors.billingFirstName && (
                              <p className="text-red-500 text-sm mt-1">{errors.billingFirstName.message}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="billingLastName" className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              id="billingLastName"
                              {...register("billingLastName")}
                              placeholder="Last Name"
                              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                errors.billingLastName ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors.billingLastName && (
                              <p className="text-red-500 text-sm mt-1">{errors.billingLastName.message}</p>
                            )}
                          </div>
                        </div>

                        <div className=" hidden ">
                          <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <Controller
                          
                            name="billingCountry"
                            control={control}
                            
                            render={({ field }) => (
                              <select
                                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                  errors.billingCountry ? "border-red-500" : "border-gray-300"
                                }`}
                                onChange={(e) => field.onChange({ value: e.target.value, label: e.target.value })}
                                defaultValue="India"
                              >
                                <option value="India">India</option>
                              </select>
                            )}
                          />
                          {errors.billingCountry && (
                            <p className="text-red-500 text-sm mt-1">{errors.billingCountry.message}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="billingContact" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <Controller
                            name="billingContact"
                            control={control}
                            render={({ field }) => (
                              <PhoneInput
                                country={"in"}
                                onlyCountries={["in"]}
                  disableDropdown
                  disableCountryCode
                  // disableInitialCountryGuess
                  disableSearchIcon
                  // countryCodeEditable={false}
                  placeholder="59684-45943"
                  buttonStyle={{
                    border: errors.contact ? "1px solid #f56565" : "1px solid focus:ring-pink-500",
                    borderRight: "none",
                    borderTopLeftRadius: "0.375rem",
                    borderBottomLeftRadius: "0.375rem",
                  }}
                  containerStyle={{
                    color: "#374151",
                  }}
                                inputProps={{
                                  name: "billingPhone",
                                  id: "billingContact",
                                  className: `w-full pl-12 py-3 border rounded-md focus:ring-pink-500 ${
                                    errors.billingContact ? "border-red-500" : "border-gray-300"
                                  }`,
                                }}
                                onChange={(value, data) => {
                                  const numberWithoutCode = value.replace(`+${data.dialCode}`, "")
                                  setValue("billingContact", numberWithoutCode, { shouldValidate: true })
                                }}
                              />
                            )}
                          />
                          {errors.billingContact && (
                            <p className="text-red-500 text-sm mt-1">{errors.billingContact.message}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="billingAddressline1" className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1
                          </label>
                          <input
                            id="billingAddressline1"
                            {...register("billingAddressline1")}
                            placeholder="Street address, apartment, suite, etc."
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                              errors.billingAddressline1 ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.billingAddressline1 && (
                            <p className="text-red-500 text-sm mt-1">{errors.billingAddressline1.message}</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <label htmlFor="billingAddressline2" className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2 (Optional)
                          </label>
                          <input
                            id="billingAddressline2"
                            {...register("billingAddressline2")}
                            placeholder="Apartment, suite, unit, building, floor, etc."
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="billingPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                              Postal Code
                            </label>
                            <input
                              id="billingPostalCode"
                              {...register("billingPostalCode")}
                              placeholder="Postal Code"
                              maxLength={6}
                              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                errors.billingPostalCode ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors.billingPostalCode && (
                              <p className="text-red-500 text-sm mt-1">{errors.billingPostalCode.message}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <div className="relative">
                              <input
                                id="billingCity"
                                {...register("billingCity")}
                                placeholder="City"
                                className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                  errors.city ? "border-red-500" : "border-gray-300"
                                }`}
                              />
                              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                            {errors.billingCity && (
                              <p className="text-red-500 text-sm mt-1">{errors.billingCity.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="billingState" className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <div className="relative">
                              <input
                                id="billingState"
                                {...register("billingState")}
                                placeholder="State"
                                className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                                  errors.city ? "border-red-500" : "border-gray-300"
                                }`}
                              />
                              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                            {errors.billingState && (
                              <p className="text-red-500 text-sm mt-1">{errors.billingState.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      disabled={!pincodeServiceable || (!user && !userId)}
                      className={`px-6 py-3 rounded-md font-medium flex items-center ${
                        !pincodeServiceable || (!user && !userId)
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-pink-600 text-white hover:bg-pink-700"
                      }`}
                    >
                      Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>

                  {/* Payment Methods */}
                  <div className="mb-8">
                    <div className="space-y-4">
                      <label
                        className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                          paymentMethod === "Prepaid" ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Prepaid"
                          checked={paymentMethod === "Prepaid"}
                          onChange={() => {
                            setPaymentMethod("Prepaid")
                            // Re-check pincode serviceability for prepaid
                            if (watchPostalCode) {
                              checkPincodeServiceability(watchPostalCode)
                            }
                          }}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">Pay Online</p>
                              <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking</p>
                            </div>
                            <div className="flex space-x-2 bg-pink-400 py-2 px-4 rounded-md">
                              <Image src="/razorpay.png" width={32} height={20} alt="Razorpay" className="h-6 w-auto" />
                            </div>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${
                          paymentMethod === "COD" ? "border-pink-500 bg-pink-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === "COD"}
                          onChange={() => {
                            setPaymentMethod("COD")
                            // Re-check pincode serviceability for COD
                            if (watchPostalCode) {
                              checkPincodeServiceability(watchPostalCode)
                            }
                          }}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">Cash on Delivery</p>
                              <p className="text-sm text-gray-500">Pay when you receive your order</p>
                            </div>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded flex items-center">
                              <BanknoteIcon className="h-3 w-3 mr-1" /> + Extra Charges
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="mb-8 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-start">
                      <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-800">Secure Payment</h4>
                        <p className="text-sm text-gray-600">
                          Your payment information is processed securely. We do not store credit card details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <button
                      onClick={handleBackToShipping}
                      className="px-4 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipping
                    </button>

                    {paymentMethod === "COD" ? (
                      <button
                        onClick={handleSubmit(handleCODPayment)}
                        disabled={isLoading || !Items.length || !pincodeServiceable || (!user && !userId)}
                        className={`px-6 py-3 rounded-md font-medium flex items-center justify-center ${
                          isLoading || !Items.length || !pincodeServiceable || (!user && !userId)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-pink-600 text-white hover:bg-pink-700"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Place Order <BadgeCheck className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit(onSubmitPrepaid)}
                        disabled={isLoading || !Items.length || !pincodeServiceable || (!user && !userId)}
                        className={`px-6 py-3 rounded-md font-medium flex items-center justify-center ${
                          isLoading || !Items.length || !pincodeServiceable || (!user && !userId)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-pink-600 text-white hover:bg-pink-700"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Proceed to Payment <CreditCardIcon className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky top-24 self-start">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
                onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
              >
                <h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
                <span className="lg:hidden">
                  {orderSummaryExpanded ? (
                    <ChevronRight className="h-5 w-5 transform rotate-90" />
                  ) : (
                    <ChevronRight className="h-5 w-5 transform -rotate-90" />
                  )}
                </span>
              </div>

              <div
                className={`p-0 transition-all duration-300 ease-in-out ${
                  orderSummaryExpanded ? "max-h-[1000px]" : "max-h-0 lg:max-h-[1000px] overflow-hidden"
                }`}
              >
                {Items && Items.length > 0 ? (
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

                    {coupon && (
                      <div className="flex justify-between text-sm border border-green-400 bg-green-100 text-green-600 p-3 rounded-md ">
                        <span className="flex items-center ">
                          <Tag className="h-3 w-3 mr-1" /> You saved -₹{(couponDiscount + discounte).toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Amount </span>
                        <span className="font-medium">₹{totalDiscountedPrice.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>
                      </div>

                    

                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-800">Total</span>
                          <span className="text-pink-600">₹{calculateTotal()}</span>
                        </div>
                      </div>
                    </div>

                    {pincodeServiceable && deliveryEstimate && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-start">
                        <Truck className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <p className="text-sm text-gray-600">Estimated delivery: {deliveryEstimate} days</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                )}
              </div>

              {/* Secure Checkout Badge */}
              <div className="p-4 bg-gray-50 border-t flex items-center justify-center">
                <LockKeyhole className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">Secure Checkout</span>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-4 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-pink-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-800">Need Help?</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Contact our customer support at{" "}
                    <a href="mailto:support@jenii.in" className="text-pink-600 hover:underline">
                      support@jenii.in
                    </a>{" "}
                    or call us at{" "}
                    <a href="tel:+919876543210" className="text-pink-600 hover:underline">
                      +91 98765 43210
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeliveryForm
