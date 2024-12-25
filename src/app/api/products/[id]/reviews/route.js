import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import { connect } from '@/dbConfig/dbConfig';
import { UserAuth } from '@/utils/userAuth';
import "@/models/userModel";
import Review from '@/models/reviewModel';


// Create a review for a specific product
export async function POST(request, { params }) {
  await connect();
  const {id} =  await params;
  const { rating, comment } = await request.json();

  if (!rating || !comment || rating < 1 || rating > 5) {
    return NextResponse.json({ message: 'Invalid rating or comment' }, { status: 400 });
  }

  try {
   
    const userId = await UserAuth();

    if (!userId) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    let Reviews = await Review.findOne({ productId:id });
    if (!Reviews) {
      Reviews = new Review({ productId:id, reviews: []});
      product.reviews = Reviews._id;
    }

    // Create the review object
    const review = {
      user: userId,
      rating: Number(rating),
      comment,
    };


    // Add review to the product's reviews array
    Reviews.reviews.push(review)

    // Calculate the new average rating
    product.numReviews =Reviews.reviews.length;
    console.log(Reviews.reviews.length)
    product.averageRating = Reviews.reviews.reduce((acc, item) => acc + item.rating, 0) / Reviews.reviews.length;


    await product.save();
    await Reviews.save();

    return NextResponse.json({ message: 'Review added successfully', review }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error.message);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  await connect();
  const { id } = await params;
  const url = new URL(request.url);
  
  try {
    // Find the product and apply pagination to reviews
    const findreviews = await Review.findOne({productId:id}).populate({path:"reviews.user",select:"name"});
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    if (!findreviews) {
      return NextResponse.json({ message: 'No reviews found' }, { status: 404 });
    }

    // Total reviews count for pagination
    const totalReviews = findreviews.reviews.length;

    return NextResponse.json(
      { 
        reviews: findreviews.reviews, 
        totalReviews, 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error.message);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

