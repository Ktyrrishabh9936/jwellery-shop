import { NextResponse } from "next/server"
import { getShippingRates } from "@/utils/shipRocket"

export async function POST(request) {
  try {
    const data = await request.json()
    const {
      delivery_pincode,
      pickup_pincode = "391410", // Default warehouse pincode
      weight = 0.5, // Default weight in kg
      cod = 0, // 0 for prepaid, 1 for COD
      order_value = 1000, // Default order value
    } = data

    if (!delivery_pincode) {
      return NextResponse.json({ error: "Delivery pincode is required" }, { status: 400 })
    }

    const shippingRates = await getShippingRates({
      pickup_pincode,
      delivery_pincode,
      weight,
      cod,
      order_value,
    })

    return NextResponse.json(shippingRates)
  } catch (error) {
    console.error("Error calculating shipping rates:", error)
    return NextResponse.json({ error: "Failed to calculate shipping rates" }, { status: 500 })
  }
}
