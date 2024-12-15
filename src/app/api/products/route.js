import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import { connect } from '@/dbConfig/dbConfig';


// Get all products
export async function GET() {
  await connect();
  try {
    const products = await Product.find();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

