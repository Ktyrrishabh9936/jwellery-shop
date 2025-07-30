import axios from "axios";
import { baseUrl } from "../config";

// lib/api/products.ts
export async function getProductById(id) {
  try {
    const res = await axios.get(`${baseUrl}/api/products/${id}/share`);

    if (!res.data.product) return null;

    const product = res.data.product;

    return {
      name: product.title,
      description: product.description,
      image: product.images[0], // must be full URL for meta tags
    };
  } catch (err) {
    console.error("Error fetching product for metadata", err);
    return null;
  }
}
