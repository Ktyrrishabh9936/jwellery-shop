import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Category from '@/models/category';



export async function GET() {
  await connect();
  try {
    const products = await Category.find({},{name:1,image:1,_id:0});
    return NextResponse.json(products, { status: 200 });
  } catch (error)
   {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
