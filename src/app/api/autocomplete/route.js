import Product from '@/models/productModel';
import { connect } from '@/dbConfig/dbConfig';
import { NextResponse } from 'next/server';

export async function GET(req) {
    await connect();

    const query = req.nextUrl.searchParams.get("query");
    console.log(query);
    
    try {
        const results = await Product.aggregate(
            [{
              $search: {
                index: "default",
                autocomplete: {
                  query: query,
                  path: "name"
                }
              }
            },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          name: 1
        }
      }
            ]
          );
        let names=results.map((e)=>e.name)
        return NextResponse.json(names);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
    }
}
