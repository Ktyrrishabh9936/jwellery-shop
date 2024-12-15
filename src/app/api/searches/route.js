import { connect } from '@/dbConfig/dbConfig';
import Product from '@/models/productModel';
import { NextResponse } from 'next/server';
 connect()
const buildSearchPipeline = (searchTerm, page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;
  
    return [
      {
        $search: {
          index: "search_Items", // Replace with your index name
          compound: {
            must: [
              {
                text: {
                  query: searchTerm,
                  path: ["name", "category.name"], // Replace with your searchable fields
                  fuzzy: {
                    maxEdits: 2, // Allow typos
                  },
                },
              },
            ],
          },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }], // Get the total count of results
          products: [
            { $skip: skip },
            { $limit: pageSize },
            {
              $project: {
                _id: 1,
                name: 1,
                discountPrice: 1,
                discountPercent: 1,
                images: 1, // Adjust fields as needed
                averageRating:1,
                collection:1,
                slug:1,
              },
            },
          ],
        },
      },
    ];
  };
  
export async function GET(req) {
    const { searchParams } = new URL(req.url); 
    const search = searchParams.get('search');
    const page = searchParams.get('page')||1;
    const pageSize = searchParams.get('pageSize')||10;

    if (!search) {
        return  NextResponse.json({ error: "Search term is required" }, { status: 400 });
      }
    try {
        const pipeline = buildSearchPipeline(search, parseInt(page), parseInt(pageSize));
        const results = await Product.aggregate(pipeline);
    
        // Format the response
        const metadata = results[0]?.metadata[0] || { total: 0 };
        const products = results[0]?.products || [];
    
        return  NextResponse.json(
         {
            total: metadata.total,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            products,
          },
          { status: 200 }
        );
    } catch (error) {
      console.log(error)
        return   NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}