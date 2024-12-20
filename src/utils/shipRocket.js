// utils/shiprocket.js
import axios from "axios";

let shiprocketToken = null; // Cache the token
const SHIPROCKET_BASE_URL = "https://apiv2.shiprocket.in/v1/external";

// Function to fetch or return the cached token
export const getShiprocketToken = async () => {
  if (!shiprocketToken) {
    console.log("Fetching new token...");
    const response = await axios.post(`${SHIPROCKET_BASE_URL}/auth/login`, {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    });
    shiprocketToken = response.data.token;

    // Set token to expire after 24 hours or based on Shiprocket's TTL
    setTimeout(() => {
      shiprocketToken = null; // Invalidate token after expiry
    }, 24 * 60 * 60 * 1000); // 24 hours
  }
  return shiprocketToken;
};


// utils/shiprocket.js
export const createShiprocketOrder = async (orderData) => {
        const token = await getShiprocketToken();
      console.log(token)
        try {
          const response = await axios.post(
            `${SHIPROCKET_BASE_URL}/orders/create/adhoc`,
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            } 
          );
          console.log(response.data)
          return {order_id: response.data.order_id,shipment_id: response.data.shipment_id};
        } catch (error) {
          console.error("Create Order Error:", error.response?.data);
          throw new Error("Failed to create order in Shiprocket");
        }
      };
export const checkServisability = async (data) => {
        const token = await getShiprocketToken();
      
        try {
          const response = await axios.get(
            `https://apiv2.shiprocket.in/v1/external/courier/serviceability`,
            {
              params: data,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response.data;
        } catch (error) {
          console.error("Create Order Error:", error.response?.data);
          throw new Error("Failed to check order servisability in Shiprocket");
        }
      };
      