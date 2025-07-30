import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import { connect } from '@/dbConfig/dbConfig';

export async function GET( req,{ params }) {
  await connect();
  const { id } =  await params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: id }, 
    }).select("_id name discountPrice discountPercent images  averageRating collectionName category price  createdAt").limit(4); 

    return NextResponse.json(
      {
        product,
        relatedProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Update a product by ID
export async function PUT(request, { params }) {
  await connect();
  const { id } = await params;
  const updates = await request.json();

  // Validate category if present
  if (updates.category) {
    const validCategories = ['men', 'women', 'kids'];
    if (!validCategories.includes(updates.category.toLowerCase())) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }
    updates.category = updates.category.toLowerCase();
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Delete a product by ID
export async function DELETE(request, { params }) {
  await connect();
  const { id } = await params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
