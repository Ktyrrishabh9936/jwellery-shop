import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { UserAuth } from "@/utils/userAuth";
import { NextResponse } from "next/server";
export async function GET(req) {
  await connect();
        try {
                const userId = await  UserAuth();
                const user = await User.findById(userId).select("-password");
         if(!user){
          return NextResponse.json(
            {
              message: 'User not  found',
            },
            { status: 404 }
          );
         }
         return NextResponse.json(
          {
            message: 'User found',
            userData:user
          },
          { status: 200 }
        );
                
        } catch (err) {
              return NextResponse.json({message:err.message},{ status: 500 })
        }
      }