// import { checkServisability } from "@/utils/shipRocket";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   const { searchParams } = new URL(req.url);
// //   const { id } = await params;
//   const pickupPincode = searchParams.get("pickup_pincode");
//   const deliveryPincode = searchParams.get("delivery_pincode");
//   const cod = searchParams.get("cod") || 0;

//   if (!pickupPincode || !deliveryPincode) {
//     return NextResponse.json({ message: "Missing required parameters" },
//       { status: 400 }
//     );
//   }

//   try {
//     const services = await checkServisability({
//         pickup_postcode: pickupPincode,
//         delivery_postcode: deliveryPincode,
//         cod,
//         weight:3
//       })
//       if(services.status && services.message){
//         return NextResponse.json({message:services.message}, { status: 404 })
//       }
//     return NextResponse.json({companyLength:services.data.available_courier_companies.length}, { status: 200 });
//   } catch (error) {
//     console.error("Error checking pincode serviceability:", error.message);
//     return NextResponse.json({ message: error.message },
//       { status: error.response?.status || 500 }
//     );
//   }
// }
