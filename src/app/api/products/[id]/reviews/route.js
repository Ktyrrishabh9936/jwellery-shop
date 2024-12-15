import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import { connect } from '@/dbConfig/dbConfig';
import { UserAuth } from '@/utils/userAuth';
import "@/models/userModel";


// Create a review for a specific product
export async function POST(request, { params }) {
  await connect();
  const {id} =  await params;
  const { rating, comment } = await request.json();

  if (!rating || !comment || rating < 1 || rating > 5) {
    return NextResponse.json({ message: 'Invalid rating or comment' }, { status: 400 });
  }

  try {
   
    const userId =  UserAuth(request);

    if (!userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Create the review object
    const review = {
      user: userId,
      rating: Number(rating),
      comment,
    };

    // Add review to the product's reviews array
    product.reviews.push(review);

    // Calculate the new average rating
    product.numReviews = product.reviews.length;
    product.averageRating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    return NextResponse.json({ message: 'Review added successfully', product }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error.message);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  await connect();
  const { id } = await params;
  const url = new URL(request.url);
  
  // Get query parameters for pagination
  const page = parseInt(url.searchParams.get('page')) || 1; // Default to page 1
  const limit = parseInt(url.searchParams.get('limit')) || 3; // Default to 10 reviews per page

  try {
    // Find the product and apply pagination to reviews
    const product = await Product.findById(id, { reviews: 1 })
      .populate({ 
        path: "reviews.user", 
        options: { skip: (page - 1) * limit, limit }
      });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Total reviews count for pagination
    const totalReviews = product.reviews.length;

    return NextResponse.json(
      { 
        reviews: product.reviews, 
        totalReviews, 
        currentPage: page, 
        totalPages: Math.ceil(totalReviews / limit) 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error.message);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

