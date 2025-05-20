"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import Image from "next/image"
import {
  CheckCircle,
  Truck,
  Package,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  ShoppingBag,
  Printer,
  FileText,
} from "lucide-react"
import Footer from "@/components/HomePage/Footer"
import NavBar from "@/components/HomePage/Navbar"
import Link from "next/link"

export default function OrderConfirmation() {
  const router = useRouter()
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [generatingReceipt, setGeneratingReceipt] = useState(false)

  useEffect(() => {
    if (!orderId) return

    const fetchOrderDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/orders/${orderId}`)
        setOrder(response.data.order)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to load order details. Please try again later.")
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price) => {
    return price ? `₹${Number(price).toFixed(2)}` : "N/A"
  }

  const getEstimatedDeliveryDate = () => {
    if (!order?.shipping?.estimatedDelivery) {
      const date = new Date()
      date.setDate(date.getDate() + 5) // Default to 5 days if no estimate
      return formatDate(date)
    }
    return formatDate(order.shipping.estimatedDelivery)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadReceipt = async () => {
    try {
      setGeneratingReceipt(true)
      const response = await axios.get(`/api/payment/download-receipt/${orderId}`, {
        responseType: "blob",
      })

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link and trigger download
      const link = document.createElement("a")
      link.href = url
      link.download = `receipt-${order.orderNumber}.pdf`
      document.body.appendChild(link)
      link.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
      setGeneratingReceipt(false)
    } catch (error) {
      console.log("Error downloading receipt:", error)
      setGeneratingReceipt(false)
      alert("Failed to download receipt. Please try again later.")
    }
  }

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
          <Link href="/">
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
              Return to Home
            </button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
        <div className="max-w-4xl mx-auto">
          {/* Order Confirmation Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 print:shadow-none">
            <div className="bg-pink-500 p-6 print:bg-white print:border-b print:border-gray-200 print:p-4">
              <div className="flex items-center justify-center print:justify-start">
                <CheckCircle className="h-12 w-12 text-white mr-4 print:text-pink-500" />
                <h1 className="text-2xl font-bold text-white print:text-pink-500">Order Confirmed!</h1>
                <div className="ml-auto flex space-x-2 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="bg-white text-pink-500 px-4 py-2 rounded-md flex items-center hover:bg-gray-100"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </button>
                  <button
                    onClick={handleDownloadReceipt}
                    disabled={generatingReceipt}
                    className="bg-white text-pink-500 px-4 py-2 rounded-md flex items-center hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
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
                </div>
              </div>
            </div>
            <div className="p-6 text-center print:text-left">
              <p className="text-gray-600 mb-4">
                Thank you for your order. We've received your order and will begin processing it right away.
              </p>
              <div className="bg-gray-100 rounded-lg p-4 inline-block print:bg-white print:border print:border-gray-200">
                <p className="text-gray-700 font-medium">Order Number</p>
                <p className="text-xl font-bold text-pink-600">{order?.orderID}</p>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
            <div className="border-b border-gray-200 p-6 print:p-4">
              <h2 className="text-xl font-semibold text-gray-800">Order Status</h2>
            </div>
            <div className="p-6 print:p-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">Order Placed</p>
                    <p className="text-xs text-gray-500">{formatDate(order?.createdAt)}</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${order?.orderStatus !== "PENDING" ? "bg-green-500" : "bg-gray-300"} flex items-center justify-center`}
                    >
                      {order?.orderStatus !== "PENDING" ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <Package className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">Processing</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${order?.orderStatus === "SHIPPED" || order?.orderStatus === "DELIVERED" ? "bg-green-500" : "bg-gray-300"} flex items-center justify-center`}
                    >
                      {order?.orderStatus === "SHIPPED" || order?.orderStatus === "DELIVERED" ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <Truck className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">Shipped</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${order?.orderStatus === "DELIVERED" ? "bg-green-500" : "bg-gray-300"} flex items-center justify-center`}
                    >
                      {order?.orderStatus === "DELIVERED" ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <Package className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-700">Delivered</p>
                  </div>
                </div>

                {/* Connecting lines */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width:
                        order?.orderStatus === "PENDING"
                          ? "0%"
                          : order?.orderStatus === "CONFIRMED"
                            ? "33%"
                            : order?.orderStatus === "SHIPPED"
                              ? "66%"
                              : order?.orderStatus === "DELIVERED"
                                ? "100%"
                                : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Tracking Information */}
              {order?.shipping?.trackingUrl && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                  <Truck className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800">Track Your Order</h4>
                    <p className="text-blue-700 text-sm mb-3">
                      Your order is on its way! Expected delivery by {getEstimatedDeliveryDate()}.
                    </p>
                    
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
            <div className="border-b border-gray-200 p-6 print:p-4">
              <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
            </div>
            <div className="p-6 print:p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start mb-4">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Date</p>
                      <p className="text-gray-800">{formatDate(order?.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <Package className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Order Status</p>
                      <p className="text-gray-800">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {order?.orderStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Payment Method</p>
                      <p className="text-gray-800">{order?.payment?.mode}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start mb-4">
                    <Truck className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Delivery Option</p>
                      <p className="text-gray-800 capitalize">{order?.shipping?.deliveryOption || "Standard"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                      <p className="text-gray-800">{order?.customer?.name}</p>
                      <p className="text-gray-800">{order?.customer?.address}</p>
                      <p className="text-gray-800">
                        {order?.customer?.city}, {order?.customer?.state} {order?.customer?.pincode}
                      </p>
                      <p className="text-gray-800">{order?.customer?.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
            <div className="border-b border-gray-200 p-6 print:p-4">
              <h2 className="text-xl font-semibold text-gray-800">Order Items</h2>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 print:bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:py-2 print:px-3"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:py-2 print:px-3"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:py-2 print:px-3"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:py-2 print:px-3"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order?.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap print:py-2 print:px-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image
                              src={process.env.NEXT_PUBLIC_IMAGE_URL + item.productId?.images[0] || "/placeholder.svg"}
                              alt={item.productId?.name}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.productId?.name}</div>
                            <div className="text-sm text-gray-500">{item.productId?.category?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap print:py-2 print:px-3">
                        <div className="text-sm text-gray-900">{formatPrice(item.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap print:py-2 print:px-3">
                        <div className="text-sm text-gray-900">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap print:py-2 print:px-3">
                        <div className="text-sm text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 print:shadow-none print:border print:border-gray-200">
            <div className="border-b border-gray-200 p-6 print:p-4">
              <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            </div>
            <div className="p-6 print:p-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">{formatPrice(order?.amount)}</span>
              </div>
              {order?.shipping?.deliveryCharge > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800 font-medium">{formatPrice(order?.shipping?.deliveryCharge)}</span>
                </div>
              )}
              {order?.coupon && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount ({order.coupon.code})</span>
                  <span className="text-green-600 font-medium">-{formatPrice(order.coupon.discountAmount)}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-pink-600">{formatPrice(order?.amount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
            <Link href="/">
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-lg shadow-md w-full flex items-center justify-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </button>
            </Link>
            <Link href="/myitem">
              <button className="bg-white hover:bg-gray-100 text-pink-500 font-bold py-3 px-6 rounded-lg shadow-md border border-pink-500 w-full flex items-center justify-center">
                <ArrowLeft className="mr-2 h-5 w-5" />
                View All Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
