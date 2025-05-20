"use client"
import { fetchOrders } from "@/lib/reducers/orderReducer"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  ShoppingBag,
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  X,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"
const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return { bg: "bg-amber-100", text: "text-amber-800", icon: <Clock className="h-3 w-3 mr-1" /> }
      case "CONFIRMED":
        return { bg: "bg-blue-100", text: "text-blue-800", icon: <Package className="h-3 w-3 mr-1" /> }
      case "PROCESSING":
        return { bg: "bg-indigo-100", text: "text-indigo-800", icon: <RefreshCw className="h-3 w-3 mr-1" /> }
      case "SHIPPED":
        return { bg: "bg-violet-100", text: "text-violet-800", icon: <Truck className="h-3 w-3 mr-1" /> }
      case "DELIVERED":
        return { bg: "bg-green-100", text: "text-green-800", icon: <CheckCircle className="h-3 w-3 mr-1" /> }
      case "CANCELED":
        return { bg: "bg-red-100", text: "text-red-800", icon: <AlertCircle className="h-3 w-3 mr-1" /> }
      case "CANCELLATION_REQUESTED":
        return { bg: "bg-orange-100", text: "text-orange-800", icon: <AlertCircle className="h-3 w-3 mr-1" /> }
      case "RETURNED":
        return { bg: "bg-gray-100", text: "text-gray-800", icon: <RefreshCw className="h-3 w-3 mr-1" /> }
      default:
        return { bg: "bg-gray-100", text: "text-gray-500", icon: <Package className="h-3 w-3 mr-1" /> }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.icon}
      {status === "CANCELLATION_REQUESTED" ? "CANCELLATION REQUESTED" : status}
    </span>
  )
}

const PaymentMethodBadge = ({ method }) => {
  const isPrepaid = method === "Prepaid"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
        isPrepaid ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
      }`}
    >
      {isPrepaid ? "Prepaid" : "Cash on Delivery"}
    </span>
  )
}

const MyOrders = () => {
  const dispatch = useDispatch()
  const { orders, currentPage, totalPages, loading } = useSelector((state) => state.orders)
  const navigate = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [filteredOrders, setFilteredOrders] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    dispatch(fetchOrders({ page: 1, limit: 10 }))
  }, [dispatch])

  useEffect(() => {
    if (orders.length > 0) {
      applyFilters()
    } else {
      setFilteredOrders([])
    }
  }, [orders, searchTerm, filterStatus, dateRange])

  const applyFilters = () => {
    let result = [...orders]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((order) => order.orderStatus === filterStatus)
    }

    // Apply date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from)
      result = result.filter((order) => new Date(order.createdAt) >= fromDate)
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to)
      toDate.setHours(23, 59, 59, 999) // End of day
      result = result.filter((order) => new Date(order.createdAt) <= toDate)
    }

    setFilteredOrders(result)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setFilterStatus("")
    setDateRange({ from: "", to: "" })
    setShowFilters(false)
  }

  const handlePageChange = (page) => {
    dispatch(fetchOrders({ page, limit: 10 }))
  }

 

 

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const formatPrice = (price) => {
    return `₹${Number(price).toFixed(2)}`
  }

  const getItemsText = (items) => {
    return items.length === 1 ? "1 item" : `${items.length} items`
  }

  const canRequestCancellation = (order) => {
    // Check if order is eligible for cancellation request
    return (
      order.orderStatus !== "CANCELED" &&
      order.orderStatus !== "DELIVERED" &&
      order.orderStatus !== "CANCELLATION_REQUESTED" &&
      order.orderStatus !== "RETURNED"
    )
  }

  const displayedOrders = searchTerm || filterStatus || dateRange.from || dateRange.to ? filteredOrders : orders

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">My Orders</h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 p-2.5"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {(filterStatus || dateRange.from || dateRange.to) && (
                    <span className="ml-2 w-2 h-2 bg-pink-500 rounded-full"></span>
                  )}
                </button>

                <button
                  onClick={() => navigate.push("/")}
                  className="inline-flex items-center px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Filter Orders</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Reset
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Status</label>
                    <select
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELED">Canceled</option>
                      <option value="CANCELLATION_REQUESTED">Cancellation Requested</option>
                      <option value="RETURNED">Returned</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <input
                        type="date"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 p-2.5"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <input
                        type="date"
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 p-2.5"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 flow-root sm:mt-8">
              {loading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="animate-pulse bg-white rounded-lg shadow-sm p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mt-4"></div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedOrders.length > 0 ? (
                    displayedOrders.map((order, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
                      >
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">Order #{order.orderID}</h3>
                                <span className="text-xs text-gray-500">({formatDate(order.createdAt)})</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <OrderStatusBadge status={order.orderStatus} />
                                <PaymentMethodBadge method={order.paymentMode} />
                              </div>
                            </div>

                           
                          <div className="flex items-center gap-3">
                              <button
                                onClick={() => navigate.push(`/myorderitems/${order.orderID}`)}
                                className="px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-md hover:bg-pink-100 flex items-center"
                              >
                                View Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Order Summary */}
                            <div className="md:col-span-2">
                              <div className="flex flex-col space-y-3">
                                {order?.items?.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="flex items-center space-x-3">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <Image
                                        src={
                                          process.env.NEXT_PUBLIC_IMAGE_URL + item?.productId?.images[0] ||
                                          "/placeholder.svg"
                                        }
                                        alt={item?.productId?.name || "Product"}
                                        width={64}
                                        height={64}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {item?.productId?.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Qty: {item.quantity} 
                                      </p>
                                    </div>
                                  </div>
                                ))}

                                {order.items.length > 2 && (
                                  <p className="text-sm text-gray-500">+{order.items.length - 2} more items</p>
                                )}
                              </div>
                            </div> 

                            {/* Order Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">Total Amount:</span>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {formatPrice(order.amount)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500">Items:</span>
                                  <span className="text-sm text-gray-900">{getItemsText(order.items)}</span>
                                </div>
                                {order.shipping?.courier?.name && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Shipping:</span>
                                    <span className="text-sm text-gray-900">{order.shipping.courier.name}</span>
                                  </div>
                                )}
                                {order.shipping?.estimatedDelivery && (
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Estimated Delivery:</span>
                                    <span className="text-sm text-gray-900">
                                      {formatDate(order.shipping.estimatedDelivery)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
                      <img src="/empty-orders.webp" alt="No orders" className="w-64 h-64 mb-6" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        {searchTerm || filterStatus || dateRange.from || dateRange.to
                          ? "No orders match your filters"
                          : "You haven't placed any orders yet"}
                      </p>
                      <p className="text-gray-500 mb-6">
                        {searchTerm || filterStatus || dateRange.from || dateRange.to
                          ? "Try adjusting your search criteria"
                          : "When you place an order, it will appear here"}
                      </p>
                      {searchTerm || filterStatus || dateRange.from || dateRange.to ? (
                        <button
                          className="px-6 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-md"
                          onClick={resetFilters}
                        >
                          Clear Filters
                        </button>
                      ) : (
                        <button
                          className="px-6 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-md"
                          onClick={() => navigate.push("/")}
                        >
                          Start Shopping
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center" aria-label="Pagination">
                <ul className="flex h-8 items-center -space-x-px text-sm">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`flex h-8 items-center justify-center border border-gray-300 px-3 leading-tight ${
                          currentPage === index + 1
                            ? "z-10 border-pink-500 bg-pink-50 text-pink-600"
                            : "bg-white text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </section>

    
    </>
  )
}

export default MyOrders
