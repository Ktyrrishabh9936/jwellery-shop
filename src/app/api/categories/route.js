import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Category from '@/models/category';



export async function GET() {
  await connect();
  try {
    const products = await Category.find();
    return NextResponse.json(products, { status: 200 });
  } catch (error)
   {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
