"use client"

import { useState, useEffect } from "react"
import { Edit, X, Loader2, MapPin } from "lucide-react"
import { stateCityData } from "@/components/Delivery/statescitydata"

const EditShippingModal = ({ isOpen, onClose, onUpdate, currentAddress }) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    updateBilling: false,
    billingName: "",
    billingContact: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingPincode: "",
    billingCountry: "India",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cities, setCities] = useState([])

  useEffect(() => {
    if (currentAddress) {
      setFormData({
        name: currentAddress.name || "",
        contact: currentAddress.contact || "",
        address: currentAddress.address || "",
        city: currentAddress.city || "",
        state: currentAddress.state || "",
        pincode: currentAddress.pincode || "",
        country: currentAddress.country || "India",
        updateBilling: false,
        billingName: "",
        billingContact: "",
        billingAddress: "",
        billingCity: "",
        billingState: "",
        billingPincode: "",
        billingCountry: "India",
      })
    }
  }, [currentAddress])

  useEffect(() => {
    // Update cities when state changes
    if (formData.state) {
      const stateData = stateCityData.find((s) => s.state === formData.state)
      setCities(stateData ? stateData.cities : [])
    } else {
      setCities([])
    }
  }, [formData.state])

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.contact.trim()) newErrors.contact = "Contact number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city) newErrors.city = "City is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required"
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Pincode must be 6 digits"

    if (formData.updateBilling) {
      if (!formData.billingName.trim()) newErrors.billingName = "Billing name is required"
      if (!formData.billingContact.trim()) newErrors.billingContact = "Billing contact is required"
      if (!formData.billingAddress.trim()) newErrors.billingAddress = "Billing address is required"
      if (!formData.billingCity) newErrors.billingCity = "Billing city is required"
      if (!formData.billingState) newErrors.billingState = "Billing state is required"
      if (!formData.billingPincode.trim()) newErrors.billingPincode = "Billing pincode is required"
      else if (!/^\d{6}$/.test(formData.billingPincode)) newErrors.billingPincode = "Billing pincode must be 6 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onUpdate(formData)
    } catch (error) {
      console.error("Error updating shipping details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <Edit className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Edit Shipping Details</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-2" />
              <div>
                <h4 className="text-md font-medium text-gray-900">Shipping Address</h4>
                <p className="text-sm text-gray-500">Update where you want your order to be delivered</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number*</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.contact ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isSubmitting}
                />
                {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className={`w-full px-3 py-2 border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isSubmitting}
                ></textarea>
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isSubmitting}
                >
                  <option value="">Select State</option>
                  {stateCityData.map((state) => (
                    <option key={state.state} value={state.state}>
                      {state.state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isSubmitting || !formData.state}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode*</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.pincode ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  disabled={isSubmitting}
                  maxLength={6}
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  disabled={true}
                />
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="updateBilling"
                name="updateBilling"
                checked={formData.updateBilling}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="updateBilling" className="ml-2 block text-sm text-gray-900">
                Update billing address as well
              </label>
            </div>

            {formData.updateBilling && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Name*</label>
                  <input
                    type="text"
                    name="billingName"
                    value={formData.billingName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.billingName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isSubmitting}
                  />
                  {errors.billingName && <p className="mt-1 text-sm text-red-600">{errors.billingName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Contact*</label>
                  <input
                    type="text"
                    name="billingContact"
                    value={formData.billingContact}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.billingContact ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isSubmitting}
                  />
                  {errors.billingContact && <p className="mt-1 text-sm text-red-600">{errors.billingContact}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address*</label>
                  <textarea
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleChange}
                    rows="2"
                    className={`w-full px-3 py-2 border ${
                      errors.billingAddress ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.billingAddress && <p className="mt-1 text-sm text-red-600">{errors.billingAddress}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing State*</label>
                  <select
                    name="billingState"
                    value={formData.billingState}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.billingState ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select State</option>
                    {stateCityData.map((state) => (
                      <option key={state.state} value={state.state}>
                        {state.state}
                      </option>
                    ))}
                  </select>
                  {errors.billingState && <p className="mt-1 text-sm text-red-600">{errors.billingState}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing City*</label>
                  <input
                    type="text"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.billingCity ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isSubmitting}
                  />
                  {errors.billingCity && <p className="mt-1 text-sm text-red-600">{errors.billingCity}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Pincode*</label>
                  <input
                    type="text"
                    name="billingPincode"
                    value={formData.billingPincode}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.billingPincode ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    disabled={isSubmitting}
                    maxLength={6}
                  />
                  {errors.billingPincode && <p className="mt-1 text-sm text-red-600">{errors.billingPincode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Country</label>
                  <input
                    type="text"
                    name="billingCountry"
                    value={formData.billingCountry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                    disabled={true}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Updating...
                </>
              ) : (
                "Update Address"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditShippingModal
