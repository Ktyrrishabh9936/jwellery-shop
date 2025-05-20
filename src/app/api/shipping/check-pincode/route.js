import { NextResponse } from "next/server"
import { getShippingRates } from "@/utils/shipRocket"

// Simple mapping of pincodes to locations (in a real app, this would be a database or API call)
const getPincodeLocation = async (pincode) => {
  // This is a simplified example - in production, you would use a proper API or database
  // For demo purposes, we'll return some hardcoded data for a few pincodes
  const pincodeMap = {
    110001: { city: "New Delhi", state: "Delhi" },
    400001: { city: "Mumbai", state: "Maharashtra" },
    560001: { city: "Bangalore", state: "Karnataka" },
    600001: { city: "Chennai", state: "Tamil Nadu" },
    700001: { city: "Kolkata", state: "West Bengal" },
    380001: { city: "Ahmedabad", state: "Gujarat" },
    500001: { city: "Hyderabad", state: "Telangana" },
    391410: { city: "Vadodara", state: "Gujarat" },
    // Add more mappings as needed
  }

  // If we have the pincode in our map, return the location
  if (pincodeMap[pincode]) {
    return pincodeMap[pincode]
  }

  // For other pincodes, we could make an API call to a pincode service
  // For now, we'll return a generic response
  return { city: "Unknown City", state: "Unknown State" }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const pincode = searchParams.get("pincode")
    const orderValue = searchParams.get("ordervalue") || "0"
    const cod = searchParams.get("cod") === "1" ? 1 : 0
    const weight = searchParams.get("weight") || 0.5

    if (!pincode) {
      return NextResponse.json(
        {
          success: false,
          message: "Pincode is required",
        },
        { status: 400 },
      )
    }

    // Validate pincode format
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pincode format. Must be 6 digits.",
        },
        { status: 400 },
      )
    }

    // Get location data for the pincode
    const location = await getPincodeLocation(pincode)

    const shippingData = await getShippingRates({
      pickup_pincode: process.env.SHIPROCKET_PICKUP_PINCODE || "391410",
      delivery_pincode: pincode,
      weight,
      cod,
      order_value: Number.parseFloat(orderValue),
    })

    // Format the response
    const response = {
      success: true,
      serviceability: shippingData.serviceability,
      location: location, // Add location data to the response
      shipping_options: {
        standard: shippingData.standard
          ? {
              courier_id: shippingData.standard.courier_id || 0,
              courier_name: shippingData.standard.courier,
              rate: shippingData.standard.rate,
              etd: shippingData.standard.estimatedDays,
              cod: shippingData.standard.cod === 1,
              city:shippingData.standard.city,
              state:shippingData.standard.state,
            }
          : null,
        express: shippingData.express
          ? {
              courier_id: shippingData.express.courier_id || 0,
              courier_name: shippingData.express.courier,
              rate: shippingData.express.rate,
              etd: shippingData.express.estimatedDays,
              cod: shippingData.express.cod === 1,
              city:shippingData.express.city,
              state:shippingData.express.state,
            }
          : null,
      },
      // all_couriers: shippingData.allOptions.map((courier) => ({
      //   courier_id: courier.courier_id || 0,
      //   courier_name: courier.courier,
      //   rate: courier.rate,
      //   etd: courier.estimatedDays,
      //   cod: courier.cod === 1,
      // })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error checking pincode serviceability:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check pincode serviceability",
        serviceability: false,
      },
      { status: 500 },
    )
  }
}
