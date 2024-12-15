// src/app/api/users/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '@/models/userModel';
import { connect } from '@/dbConfig/dbConfig';
import { BadRequestError } from '@/lib/errors';


export async function POST(req) {
  await connect();
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const payload={
      userId:user._id,
      name:user.name,
      email:user.email
    }
    const token =  await jwt.sign(payload, process.env.NEXT_PUBLIC_JWT_SECRET);

    const response= NextResponse.json(
      {
        
        message: 'Sign-in successful',
        token: token,
      },
      { status: 200 }
    );
    response.cookies.set("token",token,{httpOnly:true,expires:Date.now()+(24*60*60*1000)});
    return response;
  } catch (err) {
        return NextResponse.json({
                errors:err.isOperational?err:err.message,
                message: err.isOperational ? err.message : "Internal Server Error",
            }, { status: err.statusCode || 500 });
  }
}
