"use client"

import { useState } from "react"
import { XCircle, AlertTriangle, X, Loader2 } from "lucide-react"

const CancelOrderModal = ({ isOpen, onClose, onCancel, isLoading, paymentMethod }) => {
  const [reason, setReason] = useState("")
  const [upiId, setUpiId] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const cancelReasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Shipping time is too long",
    "Other (please specify)",
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!reason) {
      newErrors.reason = "Please select a reason for cancellation"
    }

    if (reason === "Other (please specify)" && !customReason.trim()) {
      newErrors.customReason = "Please provide a reason for cancellation"
    }

    if (paymentMethod === "Prepaid" && !upiId.trim()) {
      newErrors.upiId = "Please provide a UPI ID for refund"
    } else if (paymentMethod === "Prepaid" && !upiId.match(/^[\w.-]+@[\w.-]+$/)) {
      newErrors.upiId = "Please provide a valid UPI ID (e.g., name@upi)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const finalReason = reason === "Other (please specify)" ? customReason : reason
    onCancel(finalReason, upiId)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Cancel Order</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-700">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                {paymentMethod === "Prepaid" && (
                  <p className="text-sm text-yellow-700 mt-2">
                    Your payment will be refunded to the provided UPI ID within 5-7 business days.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation*</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`w-full px-3 py-2 border ${
                errors.reason ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
              disabled={isLoading}
            >
              <option value="">Select a reason</option>
              {cancelReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
          </div>

          {reason === "Other (please specify)" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Please specify your reason*</label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  errors.customReason ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
                rows="3"
                disabled={isLoading}
              ></textarea>
              {errors.customReason && <p className="mt-1 text-sm text-red-600">{errors.customReason}</p>}
            </div>
          )}

          {paymentMethod === "Prepaid" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID for Refund*</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="name@upi"
                className={`w-full px-3 py-2 border ${
                  errors.upiId ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
                disabled={isLoading}
              />
              {errors.upiId && <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Please provide a valid UPI ID where you would like to receive your refund.
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                "Confirm Cancellation"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CancelOrderModal
