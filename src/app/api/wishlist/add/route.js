import { connect } from "@/dbConfig/dbConfig";
import Product from "@/models/productModel";
import User from "@/models/userModel";
import { UserAuth } from "@/utils/userAuth";
import { NextResponse } from "next/server";
export async function POST(request) {
  await connect();
        try {
                const userId = await  UserAuth();
                const { productId } = await request.json();

                const product = await Product.findById(productId);
                if(!product){
                        return NextResponse.json(
                                {
                                  message: 'Invalid Product ',
                                },
                                { status: 404 }   ) 
                }
                const user = await User.findById(userId);
                if(!user){
                return NextResponse.json(
                {
                message: 'User not  found',
                },
                { status: 404 }
                );
        }
        if (!user.wishList.includes(product._id)) {
                user.wishList.push(product._id);
                await user.save();
              }

         return NextResponse.json(
          {
            message: ' Added To wishList',
            wishList:user.wishList
          },
          { status: 200 }
        );
                
        } catch (err) {
                console.log(err)
              return NextResponse.json({message:err.message},{ status: 500 })
        }
      }