import { connect } from "@/dbConfig/dbConfig";
import Address from "@/models/addressModel";
import { UserAuth } from "@/utils/userAuth";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connect();
    try {
        const {firstName, lastName, contact,street, city, state, postalCode, landmark } = await req.json(); 
        const userId = await UserAuth();
        const address = await Address.create({
            userId, 
            firstName, lastName, contact,
            street,
            city,
            state,
            postalCode,
            landmark,
        });

        if (!address) {
            return NextResponse.json({
                message: "Error while adding address"
            },{status:404});
        }

        return NextResponse.json({
            message: "User Address added successfully",
            address: address
        });
    } catch (err) {
        return NextResponse.json({
            message: "Server error",
            error: err.message
        },{status:500});
    }
}

export async function GET() {
    await connect();
    try {
        const userId =await  UserAuth();
        const address = await Address.find({userId});
        if (!address) {
            return NextResponse.json({
                address:[],
                message: "No Address  Found"
            },{status:404});
        }

        return NextResponse.json({address},{status:200});
    } catch (err) {
        return NextResponse.json({
            message: "Server error",
            error: err.message
        },{status:500});
    }
}

export async function PUT(request) {
  await connect();
  try {
    const userId = await UserAuth(); // Assume userId is set in middleware
    const data = await request.json();
    const { id, ...updateData } = data;

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!updatedAddress) {
      return NextResponse.json(
        {
          message: 'Address not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ address: updatedAddress }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      {
        message: 'Server error',
        error: err.message,
      },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import User from "@/models/userModel";
// import { connect } from "@/dbConfig/dbConfig";
// import { UserAuth } from "@/utils/userAuth";
// connect();
// // POST: Add Address to User
// export async function POST(req) {
//   try {
//     const userId =  UserAuth(req);
//     const { address } = await req.json();
//     if (!address) {
//       return NextResponse.json({ message: "Address are required" }, { status: 400 });
//     }

//     // Find the user by ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     // Add new address to the user's address array
//     user.addresses.push(address);
//     await user.save();

//     return NextResponse.json({
//       message: "Address added successfully",
//       addresses: user.addresses,
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
//   }
// }

// // GET: Fetch User Addresses
// export async function GET(req) {
//   try {

//     const userId =  UserAuth(req);
//     const user = await User.findById(userId,{addresses:1,_id:1});
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }
//     return NextResponse.json({ addresses: user.addresses });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
//   }
// }
