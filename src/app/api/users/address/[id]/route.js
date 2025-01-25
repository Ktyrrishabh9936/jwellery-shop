import { connect } from "@/dbConfig/dbConfig";
import Address from "@/models/addressModel";
import { UserAuth } from "@/utils/userAuth";
import { NextResponse } from "next/server";
export async function DELETE(request,{params}) {
        await connect();
      const {id} = await params;
        try {
          const userId = await UserAuth(); // Assume userId is set in 
          console.log(id)
          const deletedAddress = await Address.findOneAndDelete({ _id: id, userId });
      
          if (!deletedAddress) {
            return NextResponse.json(
              {
                message: 'Address not found',
              },
              { status: 404 }
            );
          }
      
          return NextResponse.json({ message: 'Address deleted successfully' }, { status: 200 });
        } catch (err) {
          console.log(err)
          return NextResponse.json(
            {
              message: 'Server error',
              error: err.message,
            },
            { status: 500 }
          );
        }
      }