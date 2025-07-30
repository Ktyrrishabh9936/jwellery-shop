// Get all products
import { NextResponse } from 'next/server';
import Product from '@/models/productModel';
import { connect } from '@/dbConfig/dbConfig';
import Category from '@/models/category';
// if(stock){
//         if(stock == 'In_stock'){
//                 query = query.where('quantity').gt(0)
//         }
//         else if(stock == 'out_of_stock'){
//                 query = query.where('quantity').gt(1)
//         }
// }
export async function GET(req,{ params }) {
  await connect();
  const { searchParams } = new URL(req.url); 
  const { name } =  await params;
  const pageNumber = searchParams.get('pageNumber')||1;
  const pageSize = searchParams.get('pageSize')||10;
  const sort = searchParams.get('sort');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const collection = searchParams.get('collection');
  const category = searchParams.get("category");
  const gender = searchParams.get("shopFor");
  try {
      let query = Product.find({ collectionName: { $in: [name] } }).select("_id name stock discountPrice discountPercent images  averageRating collectionName category price  createdAt");
      if(category){
        const categorySet =category.split(',');
        console.log(categorySet)
        query.where('category.name').in(categorySet);
      }

    
      if(gender==="men" ||gender==="women" ){
        query = query.where('category.type').equals(gender)
      }
      if(collection){
        const collectionSet =collection.split(',');
        console.log(collectionSet)
        query = query.where('collectionName').in([...collectionSet,name])
}
      if( maxPrice){
              query = query.where('discountPrice').gt(minPrice||0).lt(maxPrice);
      }
      
      if(sort){
              if( sort==="price_high")  query = query.sort({discountPrice:-1})
              else if( sort==="price_low")  query = query.sort({discountPrice:1})
              else if( sort==="newest")  query = query.sort({createdAt:-1})
              else if( sort==="best_rating")  query = query.sort({averageRating:-1})
      }

      const totalProduct = await Product.countDocuments(query);
      const skip = (pageNumber-1)*pageSize;
      query = query.skip(skip).limit(pageSize);

      const products = await query.exec();
      const totalPages = Math.ceil(totalProduct/pageSize);

    return NextResponse.json({content:products,currentPage:pageNumber,totalPages}, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

