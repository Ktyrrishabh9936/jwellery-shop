"use client"
import Footer from "@/components/HomePage/Footer"
import { formatPrice } from "@/utils/productDiscount"
import axios from "axios"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import {
  CheckCircle,
  Truck,
  Package,
  Clock,
  ArrowLeft,
  Printer,
  FileText,
  Edit,
  AlertCircle,
  ExternalLink,
  X,
  RefreshCw,
  MapPin,
  CreditCard,
  ShoppingBag,
  Info,
} from "lucide-react"

function formatDate(timestamp) {
  const date = new Date(timestamp)

  const day = date.getDate()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const amPm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12 // Convert to 12-hour format

  const daySuffix = (d) => {
    if (d >= 11 && d <= 13) return "th"
    switch (d % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  return `${day}${daySuffix(day)} ${month} ${year} at ${hours}:${minutes} ${amPm}`
}

const OrderStatusStepper = ({ currentStatus, cancellationStatus }) => {
  const steps = [
    { id: "PENDING", label: "Order Received", icon: <Clock className="h-5 w-5" /> },
    { id: "CONFIRMED", label: "Order Processed", icon: <Package className="h-5 w-5" /> },
    { id: "PROCESSING", label: "Preparing Order", icon: <RefreshCw className="h-5 w-5" /> },
    { id: "SHIPPED", label: "Order Shipped", icon: <Truck className="h-5 w-5" /> },
    { id: "DELIVERED", label: "Order Delivered", icon: <CheckCircle className="h-5 w-5" /> },
  ]

  const statusIndex = {
    PENDING: 0,
    CONFIRMED: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
    CANCELED: -1,
    CANCELLATION_REQUESTED: -2,
    RETURNED: -3,
  }

  const currentStep = statusIndex[currentStatus] !== undefined ? statusIndex[currentStatus] : 0
  const isCanceled = currentStatus === "CANCELED"
  const isCancellationRequested = currentStatus === "CANCELLATION_REQUESTED"
  const isReturned = currentStatus === "RETURNED"

  if (isCanceled) {
    return (
      <div className="py-6">
        <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
          <h3 className="text-lg font-semibold text-red-700">Order Cancelled</h3>
          <p className="text-sm text-red-600 text-center mt-1">
            This order has been cancelled. If you've already paid, a refund will be processed.
          </p>
        </div>
      </div>
    )
  }

  if (isCancellationRequested) {
    return (
      <div className="py-6">
        <div className="flex flex-col items-center justify-center p-6 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-3" />
          <h3 className="text-lg font-semibold text-amber-700">Cancellation Requested</h3>
          <p className="text-sm text-amber-600 text-center mt-1">
            Your cancellation request is being reviewed. We'll notify you once it's processed.
          </p>
          {cancellationStatus && (
            <div className="mt-4 w-full">
              <div className="bg-white p-4 rounded-md border border-amber-100">
                <p className="text-sm font-medium text-gray-700">Request Status: {cancellationStatus.status}</p>
                {cancellationStatus.reviewedAt && (
                  <p className="text-sm text-gray-600">Reviewed: {formatDate(cancellationStatus.reviewedAt)}</p>
                )}
                {cancellationStatus.adminNote && (
                  <p className="text-sm text-gray-600 mt-2">Note: {cancellationStatus.adminNote}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (isReturned) {
    return (
      <div className="py-6">
        <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg border border-blue-200">
          <RefreshCw className="h-12 w-12 text-blue-500 mb-3" />
          <h3 className="text-lg font-semibold text-blue-700">Order Returned</h3>
          <p className="text-sm text-blue-600 text-center mt-1">
            This order has been returned. Your refund will be processed shortly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="relative">
        {/* Vertical line connecting steps */}
        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>

        {steps.map((step, index) => {
          const isActive = index <= currentStep
          const isCurrentStep = index === currentStep

          return (
            <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
              {/* Step indicator */}
              <div
                className={`z-10 flex items-center justify-center w-11 h-11 rounded-full border-2 ${
                  isActive ? "bg-pink-500 border-pink-500 text-white" : "bg-white border-gray-300 text-gray-400"
                } ${isCurrentStep ? "ring-4 ring-pink-100" : ""}`}
              >
                {step.icon}
              </div>

              {/* Step content */}
              <div className="ml-4">
                <h3 className={`font-medium ${isActive ? "text-gray-900" : "text-gray-500"}`}>{step.label}</h3>
                <p className={`text-sm ${isActive ? "text-gray-600" : "text-gray-400"}`}>
                  {isCurrentStep ? "In progress" : isActive ? "Completed" : "Pending"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ShippingAddressEdit = ({ address, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: address.name || "",
    contact: address.contact || "",
    address: address.address || "",
    city: address.city || "",
    state: address.state || "",
    pincode: address.pincode || "",
    country: address.country || "India",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Shipping Address</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number*</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCancelRequest, setShowCancelRequest] = useState(false)
  const [reason, setReason] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  const [generatingReceipt, setGeneratingReceipt] = useState(false)
  const [showCourierDetails, setShowCourierDetails] = useState(false)
  const [cancellationStatus, setCancellationStatus] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const navigate = useRouter()
  const orderRef = useRef(null)

  useEffect(() => {
    if (id) {
      fetchOrderDetails()
    }
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/orders/${id}`)
      setOrder(response.data.order)

      // Check if there's a cancellation request for this order
      try {
        const cancelResponse = await axios.get(`/api/orders/cancellation-request/${id}`)
        if (cancelResponse.data.request) {
          setCancellationStatus(cancelResponse.data.request)
        }
      } catch (error) {
        console.log("No cancellation request found")
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching order details:", error)
      setLoading(false)
    }
  }

  const handleCancelRequest = () => {
    setShowCancelRequest(true)
  }

  const handleCancelRequestSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const response = await axios.post(`/api/orders/cancellation-request/${id}`, {
        reason,
        additionalInfo,
      })

      // Refresh order details
      fetchOrderDetails()

      setShowCancelRequest(false)
      setIsSubmitting(false)
      setReason("")
      setAdditionalInfo("")

      alert("Cancellation request submitted successfully. Our team will review your request.")
    } catch (error) {
      console.error("Error submitting cancellation request:", error.response?.data || error.message)
      setIsSubmitting(false)
      alert("Failed to submit cancellation request. Please try again.")
    }
  }

  const handleAddressUpdate = async (updatedAddress) => {
    try {
      setIsSubmitting(true)
      const response = await axios.patch(`/api/orders/${id}/address`, updatedAddress)

      // Refresh order details
      fetchOrderDetails()

      setEditingAddress(false)
      setIsSubmitting(false)
      alert("Shipping address updated successfully")
    } catch (error) {
      console.error("Error updating address:", error.response?.data || error.message)
      setIsSubmitting(false)
      alert("Failed to update shipping address. Please try again.")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadReceipt = async () => {
    try {
      setGeneratingReceipt(true)
      const response = await axios.get(`/api/payment/download-receipt/${id}`, {
        responseType: "blob",
      })

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `receipt-${order.orderID}.pdf`
      document.body.appendChild(link)
      link.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      setGeneratingReceipt(false)
    } catch (error) {
      console.error("Error downloading receipt:", error.response?.data || error.message)
      setGeneratingReceipt(false)
      alert("Failed to download receipt. Please try again later.")
    }
  }

  // Check if order can be cancelled (only PENDING, CONFIRMED or PROCESSING status)
  const canRequestCancellation =
    order &&
    (order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED" || order.orderStatus === "PROCESSING") &&
    order.orderStatus !== "CANCELLATION_REQUESTED"

  // Check if shipping address can be edited (only before shipping)
  const canEditAddress =
    order &&
    (order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED") &&
    order.orderStatus !== "CANCELLATION_REQUESTED"

  if (loading) {
    return (
      <>
        <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto" ref={orderRef}>
        <div className="flex justify-start item-start space-y-2 flex-col">
          <div className="flex justify-between items-center w-full">
            <div>
              <h1 className="text-2xl dark:text-white lg:text-3xl font-semibold leading-7 lg:leading-9 text-gray-800">
                Order #{order?.orderID}
              </h1>
              <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600 mt-1">
                Placed on {formatDate(order?.createdAt)}
              </p>
            </div>
            <div className="flex space-x-2 print:hidden">
              <button
                onClick={handlePrint}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md flex items-center hover:bg-gray-200"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              {order?.payment?.mode === "Prepaid" && (
                <button
                  onClick={handleDownloadReceipt}
                  disabled={generatingReceipt}
                  className="bg-pink-100 text-pink-700 px-4 py-2 rounded-md flex items-center hover:bg-pink-200 disabled:opacity-70"
                >
                  {generatingReceipt ? (
                    <>
                      <div className="h-4 w-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Receipt
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Banner */}
        <div
          className={`mt-6 p-4 rounded-lg ${
            order.orderStatus === "DELIVERED"
              ? "bg-green-50 border border-green-200"
              : order.orderStatus === "SHIPPED"
                ? "bg-blue-50 border border-blue-200"
                : order.orderStatus === "CANCELED"
                  ? "bg-red-50 border border-red-200"
                  : order.orderStatus === "CANCELLATION_REQUESTED"
                    ? "bg-amber-50 border border-amber-200"
                    : "bg-gray-50 border border-gray-200"
          }`}
        >
          <div className="flex items-center">
            {order.orderStatus === "DELIVERED" ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            ) : order.orderStatus === "SHIPPED" ? (
              <Truck className="h-5 w-5 text-blue-500 mr-3" />
            ) : order.orderStatus === "CANCELED" ? (
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            ) : order.orderStatus === "CANCELLATION_REQUESTED" ? (
              <AlertCircle className="h-5 w-5 text-amber-500 mr-3" />
            ) : (
              <Package className="h-5 w-5 text-gray-500 mr-3" />
            )}

            <div>
              <h3 className="font-medium text-gray-900">
                {order.orderStatus === "DELIVERED"
                  ? "Your order has been delivered"
                  : order.orderStatus === "SHIPPED"
                    ? "Your order is on the way"
                    : order.orderStatus === "CANCELED"
                      ? "Your order has been cancelled"
                      : order.orderStatus === "CANCELLATION_REQUESTED"
                        ? "Cancellation requested"
                        : `Your order is ${order.orderStatus.toLowerCase()}`}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {order.orderStatus === "DELIVERED"
                  ? "Thank you for shopping with us!"
                  : order.orderStatus === "SHIPPED"
                    ? `Expected delivery by ${order.shipping?.estimatedDelivery ? formatDate(order.shipping.estimatedDelivery) : "soon"}`
                    : order.orderStatus === "CANCELED"
                      ? "If you've paid, a refund will be processed shortly."
                      : order.orderStatus === "CANCELLATION_REQUESTED"
                        ? "Your cancellation request is being reviewed."
                        : "We're preparing your order for shipment."}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mt-6 border-b border-gray-200 print:hidden">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Order Details
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tracking"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Tracking
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "shipping"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Shipping Info
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Items */}
              <div className="lg:col-span-2">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {order?.items?.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => navigate.push(`/product/${item?.productId._id}`)}
                        className="p-6 flex items-center hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                          <Image
                            src={process.env.NEXT_PUBLIC_IMAGE_URL + item?.productId?.images[0] || "/placeholder.svg"}
                            width={80}
                            height={80}
                            alt={item?.productId?.name || "Product image"}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-medium text-gray-900">{item.productId?.name}</h3>
                            <p className="ml-4 text-base font-medium text-gray-900">{formatPrice(item?.price)}</p>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <p>
                              {item?.productId?.category?.name} • {item?.productId?.metal}
                            </p>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-sm">
                            <p className="text-gray-500">Qty {item?.quantity}</p>
                            <p className="text-gray-500">
                              {formatPrice(item?.productId?.discountPrice)}
                              <span className="line-through ml-2 text-gray-400">
                                {formatPrice(item?.productId?.price)}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Payment Summary</h2>
                  </div>
                  <div className="p-6">
                    <div className="flow-root">
                      <dl className="-my-4 text-sm divide-y divide-gray-200">
                        <div className="py-4 flex items-center justify-between">
                          <dt className="text-gray-600">Subtotal</dt>
                          <dd className="font-medium text-gray-900">{formatPrice(order?.subtotal || 0)}</dd>
                        </div>
                        <div className="py-4 flex items-center justify-between">
                          <dt className="text-gray-600">Shipping</dt>
                          <dd className="font-medium text-gray-900">{formatPrice(order?.shippingCost || 0)}</dd>
                        </div>
                        {order?.discount > 0 && (
                          <div className="py-4 flex items-center justify-between">
                            <dt className="text-gray-600">Discount</dt>
                            <dd className="font-medium text-green-600">-{formatPrice(order?.discount || 0)}</dd>
                          </div>
                        )}
                        <div className="py-4 flex items-center justify-between">
                          <dt className="text-base font-medium text-gray-900">Order Total</dt>
                          <dd className="text-base font-medium text-gray-900">{formatPrice(order?.amount || 0)}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm font-medium text-gray-500">
                        Payment Method: <span className="text-gray-900">{order?.payment?.mode}</span>
                      </p>
                    </div>
                    {order?.payment?.paymentId && (
                      <div className="mt-2 flex items-center">
                        <Info className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-gray-500">
                          Payment ID: <span className="text-gray-900">{order?.payment?.paymentId}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Info Sidebar */}
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Customer Information</h2>
                  </div>
                  <div className="p-6">
                    <h3 className="text-base font-medium text-gray-900">{order?.customer?.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{order?.customer?.email}</p>
                    <p className="mt-1 text-sm text-gray-500">{order?.customer?.contact}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
                    {canEditAddress && !editingAddress && (
                      <button
                        onClick={() => setEditingAddress(true)}
                        className="text-sm text-pink-600 hover:text-pink-800 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="p-6">
                    {editingAddress ? (
                      <ShippingAddressEdit
                        address={order.customer}
                        onSave={handleAddressUpdate}
                        onCancel={() => setEditingAddress(false)}
                      />
                    ) : (
                      <div className="text-sm text-gray-500">
                        <p className="font-medium text-gray-900">{order?.customer?.name}</p>
                        <p className="mt-1">{order?.customer?.address}</p>
                        <p className="mt-1">
                          {order?.customer?.city}, {order?.customer?.state} {order?.customer?.pincode}
                        </p>
                        <p className="mt-1">{order?.customer?.country}</p>
                        <p className="mt-1">{order?.customer?.contact}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden print:hidden">
                  <div className="p-6 space-y-3">
                    {canRequestCancellation && (
                      <button
                        onClick={handleCancelRequest}
                        className="w-full flex items-center justify-center px-4 py-2 border border-red-600 text-sm font-medium text-red-600 bg-white hover:bg-red-50 rounded-md"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Request Cancellation
                      </button>
                    )}
                    <button
                      onClick={() => navigate.push("/myitem")}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Orders
                    </button>
                    {order.shipping?.trackingUrl && order.orderStatus === "SHIPPED" && (
                      <a
                        href={order.shipping.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center px-4 py-2 border border-blue-600 text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 rounded-md"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tracking" && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Tracking</h2>
              </div>
              <div className="p-6">
                {/* Order Status Stepper */}
                <OrderStatusStepper currentStatus={order.orderStatus} cancellationStatus={cancellationStatus} />

                {/* Tracking Information */}
                {order.shipping?.trackingUrl && order.orderStatus === "SHIPPED" && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <Truck className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800">Track Your Package</h4>
                        <p className="text-blue-700 text-sm mb-3">
                          Your order is on its way! Expected delivery by{" "}
                          {formatDate(
                            order.shipping.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                          )}
                          .
                        </p>
                        <a
                          href={order.shipping.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Track Package
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Timeline */}
                <div className="mt-8">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Order Timeline</h3>
                  <div className="flow-root">
                    <ul className="-mb-8">
                      <li>
                        <div className="relative pb-8">
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          ></span>
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center ring-8 ring-white">
                                <ShoppingBag className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">Order placed</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {formatDate(order.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      {order.orderStatus !== "PENDING" && (
                        <li>
                          <div className="relative pb-8">
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            ></span>
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                  <Package className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">Order confirmed</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {formatDate(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                      {(order.orderStatus === "PROCESSING" ||
                        order.orderStatus === "SHIPPED" ||
                        order.orderStatus === "DELIVERED") && (
                        <li>
                          <div className="relative pb-8">
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            ></span>
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                                  <RefreshCw className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">Order processing</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {formatDate(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 24)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                      {(order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED") && (
                        <li>
                          <div className="relative pb-8">
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            ></span>
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center ring-8 ring-white">
                                  <Truck className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">Order shipped</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {formatDate(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 48)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                      {order.orderStatus === "DELIVERED" && (
                        <li>
                          <div className="relative">
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                  <CheckCircle className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">Order delivered</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {formatDate(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 120)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                      {order.orderStatus === "CANCELED" && (
                        <li>
                          <div className="relative">
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                                  <X className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">Order cancelled</p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {cancellationStatus?.updatedAt
                                    ? formatDate(cancellationStatus.updatedAt)
                                    : formatDate(new Date())}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900">{order?.customer?.name}</p>
                      <p className="mt-1 text-gray-500">{order?.customer?.address}</p>
                      <p className="mt-1 text-gray-500">
                        {order?.customer?.city}, {order?.customer?.state} {order?.customer?.pincode}
                      </p>
                      <p className="mt-1 text-gray-500">{order?.customer?.country}</p>
                      <p className="mt-1 text-gray-500">{order?.customer?.contact}</p>
                    </div>

                    {canEditAddress && !editingAddress && (
                      <button
                        onClick={() => setEditingAddress(true)}
                        className="mt-3 text-sm text-pink-600 hover:text-pink-800 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Address
                      </button>
                    )}

                    {editingAddress && (
                      <div className="mt-4">
                        <ShippingAddressEdit
                          address={order.customer}
                          onSave={handleAddressUpdate}
                          onCancel={() => setEditingAddress(false)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Courier Details */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                      <Truck className="h-5 w-5 text-gray-400 mr-2" />
                      Courier Details
                    </h3>

                    {order.shipping?.courier ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Courier</span>
                            <span className="text-sm font-medium text-gray-900">
                              {order.shipping.courier.name || "Standard Delivery"}
                            </span>
                          </div>

                          {order.shipping.awb && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">AWB Number</span>
                              <span className="text-sm font-medium text-gray-900">{order.shipping.awb}</span>
                            </div>
                          )}

                          {order.shipping.shipmentID && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Shipment ID</span>
                              <span className="text-sm font-medium text-gray-900">{order.shipping.shipmentID}</span>
                            </div>
                          )}

                          {order.shipping.estimatedDelivery && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Estimated Delivery</span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatDate(order.shipping.estimatedDelivery)}
                              </span>
                            </div>
                          )}

                          {order.shipping.courier.etd && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Delivery Time</span>
                              <span className="text-sm font-medium text-gray-900">
                                {order.shipping.courier.etd} days
                              </span>
                            </div>
                          )}
                        </div>

                        {order.shipping.trackingUrl && (
                          <div className="mt-4">
                            <a
                              href={order.shipping.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Track Package
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-500">
                          {order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED"
                            ? "Shipping information will be available once your order is processed."
                            : "No shipping information available."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery Instructions */}
                <div className="mt-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 text-gray-400 mr-2" />
                    Delivery Information
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Delivery Method</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.shipping?.courier?.name || "Standard Delivery"}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Delivery Status</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.orderStatus === "DELIVERED"
                            ? "Your order has been delivered."
                            : order.orderStatus === "SHIPPED"
                              ? "Your order is on the way."
                              : order.orderStatus === "PROCESSING"
                                ? "Your order is being prepared for shipping."
                                : order.orderStatus === "CONFIRMED"
                                  ? "Your order has been confirmed and will be shipped soon."
                                  : "Your order is being processed."}
                        </p>
                      </div>

                      {order.shipping?.estimatedDelivery && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Estimated Delivery Date</h4>
                          <p className="text-sm text-gray-500 mt-1">{formatDate(order.shipping.estimatedDelivery)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Request Modal */}
      {showCancelRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Order Cancellation</h3>
              <button onClick={() => setShowCancelRequest(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Cancellation requests are subject to review by our team. You'll be notified once
                your request is processed.
              </p>
            </div>

            <form onSubmit={handleCancelRequestSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason for cancellation*
                </label>
                <select
                  name="reason"
                  className="w-full p-3 rounded-md border border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Found a better price elsewhere">Found a better price elsewhere</option>
                  <option value="Ordered by mistake">Ordered by mistake</option>
                  <option value="Shipping time is too long">Shipping time is too long</option>
                  <option value="Payment issues">Payment issues</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  className="w-full p-3 rounded-md border border-gray-300 focus:border-pink-500 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                  placeholder="Please provide any additional details about your cancellation request"
                  rows={3}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCancelRequest(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}
