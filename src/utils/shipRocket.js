import axios from "axios"

// ShipRocket API credentials
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD
const SHIPROCKET_API_URL = "https://apiv2.shiprocket.in/v1"

// Cache token to avoid frequent authentication
let authToken = null
let tokenExpiry = null

/**
 * Authenticate with ShipRocket API and get token
 */
export const getAuthToken = async () => {
  // Check if we have a valid token
  if (authToken && tokenExpiry && new Date() < tokenExpiry) {
    return authToken
  }

  try {
    const response = await axios.post(`${SHIPROCKET_API_URL}/external/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    })

    authToken = response.data.token
    // Set token expiry to 9 hours from now (tokens are valid for 10 hours)
    tokenExpiry = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
    return authToken
  } catch (error) {
    console.error("ShipRocket authentication error:", error.response?.data || error.message)
    throw new Error("Failed to authenticate with ShipRocket")
  }
}

/**
 * Get shipping rates for a delivery
 * @param {Object} params - Shipping parameters
 * @returns {Promise<Object>} - Shipping rates and estimated delivery dates
 */
export const getShippingRates = async ({
  pickup_pincode,
  delivery_pincode,
  weight = 0.5,
  cod = 0,
  order_value = 0,
}) => {
  try {
    const token = await getAuthToken()

    const response = await axios.get(`${SHIPROCKET_API_URL}/external/courier/serviceability`, {
      params: {
        pickup_postcode: pickup_pincode,
        delivery_postcode: delivery_pincode,
        weight,
        cod,
        order_value,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })


    // Process and format the response
    const availableCouriers = response.data.data.available_courier_companies || []

    if (availableCouriers.length === 0) {
      return getDefaultShippingRates(cod)
    }

    // Sort by rate and delivery days
    const standardOptions = availableCouriers
      .filter((courier) => courier.estimated_delivery_days > 3)
      .sort((a, b) => a.rate - b.rate)

    const expressOptions = availableCouriers
      .filter((courier) => courier.estimated_delivery_days <= 3)
      .sort((a, b) => a.rate - b.rate)

      

    return {
      serviceability: true,
      standard:
        standardOptions.length > 0
          ? {
              courier_id: standardOptions[0].courier_company_id,
              courier: standardOptions[0].courier_name,
              rate: standardOptions[0].rate,
              estimatedDays: standardOptions[0].estimated_delivery_days,
              cod: standardOptions[0].cod,
              city:standardOptions[0].city,
              state:standardOptions[0].state,
              etd:standardOptions[0].etd
            }
          : null,
      express:
        expressOptions.length > 0
          ? {
              courier_id: expressOptions[0].courier_company_id,
              courier: expressOptions[0].courier_name,
              rate: expressOptions[0].rate,
              estimatedDays: expressOptions[0].estimated_delivery_days,
              cod: expressOptions[0].cod,

            }
          : null,
     
    }
  } catch (error) {
    console.error("ShipRocket rates error:", error.response?.data || error.message)
    // Return default rates if API fails
    return getDefaultShippingRates(cod)
  }
}

/**
 * Get default shipping rates if API fails
 * @param {number} cod - 1 for COD, 0 for prepaid
 * @returns {Object} - Default shipping rates
 */
const getDefaultShippingRates = (cod) => {
  const standardDays = 5
  const expressDays = 2

  // COD has higher rates
  const standardRate = cod === 1 ? 100 : 80
  const expressRate = cod === 1 ? 180 : 150

  

  return {
    serviceability: true,
    standard: {
      courier_id: 0,
      courier: "Standard Delivery",
      rate: standardRate,
      estimatedDays: standardDays,
      cod: cod === 1,
    },
    express: {
      courier_id: 0,
      courier: "Express Delivery",
      rate: expressRate,
      estimatedDays: expressDays,
      cod: cod === 1,
    },
    allOptions: [
      {
        courier_id: 0,
        courier: "Standard Delivery",
        rate: standardRate,
        estimatedDays: standardDays,
        cod: cod === 1,
      },
      {
        courier_id: 0,
        courier: "Express Delivery",
        rate: expressRate,
        estimatedDays: expressDays,
        cod: cod === 1,
      },
    ],
  }
}

/**
 * Create a shipment order in ShipRocket
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} - Shipment details
 */
export const createShipment = async (orderData) => {
  try {
    const token = await getAuthToken()

    const response = await axios.post(`${SHIPROCKET_API_URL}/external/orders/create/adhoc`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("ShipRocket create shipment error:", error.response?.data || error.message)
    throw new Error("Failed to create shipment")
  }
}
export const cancelShipment = async (orderId) => {
  try {
    const token = await getAuthToken()

    const response = await axios.post(
      `${SHIPROCKET_API_URL}/external/orders/cancel`,
      { ids: [orderId] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data
  } catch (error) {
    console.error("ShipRocket cancel shipment error:", error.response?.data || error.message)
    throw new Error("Failed to cancel shipment")
  }
}

/**
 * Request RTO (Return to Origin) for a shipment
 * @param {string} awb - AWB number
 * @returns {Promise<Object>} - RTO response
 */
export const requestRTO = async (awb) => {
  try {
    const token = await getAuthToken()

    const response = await axios.post(
      `${SHIPROCKET_API_URL}/external/courier/generate/return`,
      { awbs: [awb] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data
  } catch (error) {
    console.error("ShipRocket RTO request error:", error.response?.data || error.message)
    throw new Error("Failed to request RTO")
  }
}

/**
 * Track a shipment by AWB
 * @param {string} awb - AWB number
 * @returns {Promise<Object>} - Tracking details
 */
export const trackShipment = async (awb) => {
  try {
    const token = await getAuthToken()

    const response = await axios.get(`${SHIPROCKET_API_URL}/external/courier/track/awb/${awb}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error("ShipRocket tracking error:", error.response?.data || error.message)
    throw new Error("Failed to track shipment")
  }
}

export default {
  getAuthToken,
  getShippingRates,
  createShipment,
  cancelShipment,
  requestRTO,
  trackShipment,
}
