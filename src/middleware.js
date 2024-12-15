// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
        const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req,secret});
  const { pathname } = req.nextUrl;

  if(token && pathname === "/login"){
        return NextResponse.redirect(new URL("/", req.url));
  }
 
  return NextResponse.next();
}

export const config ={
        matcher:[
                '/login',
        ]
}