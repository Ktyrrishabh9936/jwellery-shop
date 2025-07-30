import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import { connect } from '@/dbConfig/dbConfig';

export async function GET( req,{ params }) {
  await connect();
  const { id } =  await params;

  try {
    const product = await Product.findById(id).select('name description images');
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
   

    return NextResponse.json(
      {
        product,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
