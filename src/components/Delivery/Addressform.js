"use client"
import { useState, useEffect } from "react"
import { Controller } from "react-hook-form"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { MapPin, User, Phone, Mail, Loader2, Home, Building, MapPinned } from "lucide-react"

// List of countries with their codes
const COUNTRIES = [
  { value: "IN", label: "India", phoneCode: "91" },
  { value: "US", label: "United States", phoneCode: "1" },
  { value: "GB", label: "United Kingdom", phoneCode: "44" },
  { value: "CA", label: "Canada", phoneCode: "1" },
  { value: "AU", label: "Australia", phoneCode: "61" },
  { value: "SG", label: "Singapore", phoneCode: "65" },
  { value: "AE", label: "United Arab Emirates", phoneCode: "971" },
  { value: "SA", label: "Saudi Arabia", phoneCode: "966" },
]

export default function Addressform({ register, errors, setValue, watch, control }) {
  const [selectedCountry, setSelectedCountry] = useState("IN") // Default to India
  const [checkingPincode, setCheckingPincode] = useState(false)

  const watchCountry = watch("country")
  const watchPostalCode = watch("postalCode")

  // Set default country to India on component mount
  useEffect(() => {
    setValue("country", "India")
    setValue("countryCode", "+91")
  }, [setValue])

  // Handle country change
  const handleCountryChange = (e) => {
    const countryCode = e.target.value
    const country = COUNTRIES.find((c) => c.value === countryCode)

    if (country) {
      setSelectedCountry(countryCode)
      setValue("country", "")
      setValue("countryCode", "")

      // Reset postal code, city and state when country changes
      setValue("postalCode", "")
      setValue("city", "", { shouldValidate: true })
      setValue("state","", { shouldValidate: true })
    }
  }

  // Validate if postal code format matches the selected country
  const validatePostalCode = (postalCode) => {
    if (!postalCode) return true

    // Postal code validation patterns by country
    const patterns = {
      IN: /^[0-9]{6}$/, // India: 6 digits
      US: /^[0-9]{5}(-[0-9]{4})?$/, // US: 5 digits or 5+4 digits
      GB: /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, // UK: Complex pattern
      CA: /^[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]$/i, // Canada: Letter-Number-Letter Number-Letter-Number
      AU: /^[0-9]{4}$/, // Australia: 4 digits
      SG: /^[0-9]{6}$/, // Singapore: 6 digits
      AE: /^[0-9]{5}$/, // UAE: 5 digits
      SA: /^[0-9]{5}(-[0-9]{4})?$/, // Saudi Arabia: 5 digits or 5+4 digits
    }

    const countryPattern = patterns[selectedCountry] || /^.+$/
    return countryPattern.test(postalCode)
  }

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-base font-medium mb-4 flex items-center text-gray-800">
          <User className="mr-2 h-4 w-4 text-pink-600" /> Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <div className="relative">
              <input
                id="firstName"
                {...register("firstName")}
                placeholder="First Name"
                className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <div className="relative">
              <input
                id="lastName"
                {...register("lastName")}
                placeholder="Last Name"
                className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
              />
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-base font-medium mb-4 flex items-center text-gray-800">
          <Phone className="mr-2 h-4 w-4 text-pink-600" /> Contact Information
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Email Address"
                className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="hidden">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <div className="relative">
                <select
                  id="country"
                  className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none ${errors.country ? "border-red-500" : "border-gray-300"}`}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  disabled
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
            </div>

            
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 ">
              Phone Number
            </label>
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <PhoneInput
                {...field}
                  country={selectedCountry.toLowerCase()}
                  onlyCountries={["in"]}
                  disableDropdown
                  disableCountryCode
                  // disableInitialCountryGuess
                  disableSearchIcon
                  // countryCodeEditable={false}
                  placeholder="59684-45943"
                  inputProps={{
                    name: "phone",
                    id: "phone",
                    className: `w-full py-3 border rounded-md  pl-12 ${errors.contact ? "border-red-500" : "border-gray-300"}`,
                  }}
                  buttonStyle={{
                    border: errors.contact ? "1px solid #f56565" : "1px solid #d1d5db",
                    borderRight: "none",
                    borderTopLeftRadius: "0.375rem",
                    borderBottomLeftRadius: "0.375rem",
                  }}
                  containerStyle={{
                    color: "#374151",
                  }}
                  onChange={(value, data) => {
                    const isdCode = data.dialCode
                    const numberWithoutCode = value.replace(`${isdCode}`, "")
                    setValue("countryCode", `+${isdCode}`, { shouldValidate: true })
                    setValue("contact", numberWithoutCode, { shouldValidate: true })
                  }}
                />
              )}
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-base font-medium mb-4 flex items-center text-gray-800">
          <MapPin className="mr-2 h-4 w-4 text-pink-600" /> Address Details
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="addressline1" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1
            </label>
            <div className="relative">
              <input
                id="addressline1"
                {...register("addressline1")}
                placeholder="House/Flat No., Building Name, Street"
                className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.addressline1 ? "border-red-500" : "border-gray-300"}`}
              />
              <Home className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.addressline1 && <p className="text-red-500 text-sm mt-1">{errors.addressline1.message}</p>}
          </div>

          <div>
            <label htmlFor="addressline2" className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2 (Optional)
            </label>
            <div className="relative">
              <input
                id="addressline2"
                {...register("addressline2")}
                placeholder="Area, Colony, Landmark"
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            {errors.addressline2 && <p className="text-red-500 text-sm mt-1">{errors.addressline2.message}</p>}
          </div>

          <div className=" ">
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <div className="relative ">
                <input
                  id="postalCode"
                  {...register("postalCode")}
                  placeholder={selectedCountry === "IN" ? "6-digit PIN code" : "Postal Code"}
                  maxLength={selectedCountry === "IN" ? 6 : 10}
                  className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.postalCode ? "border-red-500" : "border-gray-300"}`}
                />
                {checkingPincode ? (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
                ) : (
                  <MapPinned className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                )}
              </div>
              {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
              {watchPostalCode && !validatePostalCode(watchPostalCode) && (
                <p className="text-red-500 text-sm mt-1">
                  Invalid postal code format for {COUNTRIES.find((c) => c.value === selectedCountry)?.label}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                This helps us determine delivery availability
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <div className="relative">
                <input
                  id="city"
                  {...register("city")}
                  placeholder="City"
                  className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.city ? "border-red-500" : "border-gray-300"}`}
                  
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              {selectedCountry === "IN" && (
                <p className="text-xs text-gray-500 mt-1">City will be auto-filled based on PIN code</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <div className="relative">
                <input
                  id="state"
                  {...register("state")}
                  placeholder="State/Province"
                  className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${errors.state ? "border-red-500" : "border-gray-300"}`}
                  
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
              {selectedCountry === "IN" && (
                <p className="text-xs text-gray-500 mt-1">State will be auto-filled based on PIN code</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
