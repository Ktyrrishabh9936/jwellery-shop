import { NextResponse } from 'next/server'; 
import Product from '@/models/productModel';
import { connect } from '@/dbConfig/dbConfig';
import axios from 'axios';
import { getAuthToken } from '@/utils/shipRocket';

const dimensionData = [
  { name: "rings", length:6, breadth:6, height:4, weight:25 },
  { name: "earrings", length: 6, breadth: 8, height: 4, weight:28 },
  { name: "bracelets", length:10, breadth:10, height:4, weight:70 },
  { name: "chain", length: 28, breadth: 6.5, height: 3, weight:80 },
  { name: "payal", length: 28, breadth: 6.5, height: 3, weight:80 },
  { name: "mangal-sutra", length: 28, breadth:6.5, height: 3, weight:80 },
  { name: "set", length: 15.5, breadth: 18, height:3.5, weight:132 },
  { name: "pendant-sets", length: 10, breadth: 10, height: 4, weight: 54 },
];


export async function GET() {
  try {
    await connect();
    const products = await Product.find().sort({ date: -1 }).skip(0).limit(10);
    const token = await getAuthToken()

    const enriched = products.map((product) => {
      const spec = product.specifications || [];
      const weightSpec = spec.find((s) => s.key === "Weight");
      let weight = 0;
      if (weightSpec?.value) {
        const match = weightSpec.value.match(/([\d.]+)/);
        weight = match ? parseFloat(match[1]) : 0;
      }

      const nameMatch = dimensionData.find(
        (d) => product.category.name.toLowerCase() === d.name.toLowerCase()
      );

      if (!nameMatch) return null;

      const totalWeightKg = ((weight + nameMatch.weight) / 1000).toFixed(2);

      return {
        name: product.name,
        sku: "JN"+product.sku,
        hsn: "7113", // adjust if needed
        weight: parseFloat(totalWeightKg),
        length: nameMatch.length,
        breadth: nameMatch.breadth,
        height: nameMatch.height,
        category_code: "default",
	type: "Single",
	qty: 10,
      };
    }).filter(Boolean);
    // console.log(enriched)

    // Upload to Shiprocket
    const uploadResults = [];

    for (const item of enriched) {
      try {
        const res = await axios.post(
          "https://apiv2.shiprocket.in/v1/external/products",
          item,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        uploadResults.push({ sku: item.sku, status: "success" });
      } catch (err) {
        console.error(`Failed to upload SKU ${item.sku}`, err);
        uploadResults.push({ sku: item.sku, status: "error" });
       break;
      }
    }

    return NextResponse.json({ uploaded: uploadResults });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to process" }, { status: 500 });
  }
}
