"use client"
import { MapPin, Check, Home, Building, Phone } from "lucide-react"

const AddressList = ({ addresses, selectedAddress, setSelectedAddress }) => {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No saved addresses found</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address._id}
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedAddress && selectedAddress._id === address._id
              ? "border-pink-500 bg-pink-50"
              : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
          }`}
          onClick={() => setSelectedAddress(address)}
        >
          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <h3 className="font-medium text-gray-800">
                  {address.firstName} {address.lastName}
                </h3>
                {address.type && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {address.type}
                  </span>
                )}
                {selectedAddress && selectedAddress._id === address._id && (
                  <span className="ml-auto flex items-center text-pink-600 text-sm font-medium">
                    <Check className="h-4 w-4 mr-1" /> Selected
                  </span>
                )}
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-start">
                  <Home className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <p>{address.addressline1}</p>
                </div>

                {address.addressline2 && (
                  <div className="flex items-start">
                    <Building className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    <p>{address.addressline2}</p>
                  </div>
                )}

                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <p>
                    {address.city?.label || address.city}, {address.state?.label || address.state}, {address.postalCode}
                  </p>
                </div>

                <div className="flex items-start">
                  <Phone className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <p>
                    {address.countryCode} {address.contact}
                  </p>
                </div>
              </div>
            </div>

            <div className="ml-4 flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedAddress && selectedAddress._id === address._id
                    ? "border-pink-500 bg-pink-500"
                    : "border-gray-300"
                }`}
              >
                {selectedAddress && selectedAddress._id === address._id && <Check className="h-3 w-3 text-white" />}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AddressList
