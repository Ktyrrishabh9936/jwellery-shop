import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function isValidObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}
export async function getProductMetaById(id) {
  try {
    if (!id || !isValidObjectId(id)) {
      return null;
    }
    const res = await axios.get(`${baseUrl}/api/products/${id}/share`);
    if (!res.data) return null;
    return res.data;
  } catch (err) {
    console.error("Error fetching product for metadata", err);
    return null;
  }
}
export async function getProductById(id) {
  try {
    if (!id || !isValidObjectId(id)) {
      return null;
    }
    const res = await axios.get(`${baseUrl}/api/products/${id}`);

    if (!res.data.product) return null;
    return res.data;
  } catch (err) {
    console.error("Error fetching product ", err);
    return null;
  }
}
