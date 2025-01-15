"use client"
import { addToCart } from '@/lib/reducers/cartReducer';
import { getwishList, RemovewishList } from '@/lib/reducers/wishlistReducer';
import Image from 'next/image';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function FavoriteItems() {
  const dispatch = useDispatch();
  const {wishlist,loading,loadWishlist}  = useSelector((state)=>state.wishlist)
  const {loadingProductId} = useSelector((state)=>state.cart);


  useEffect(()=>{
    dispatch(getwishList())
  },[])

  if(loading){
   return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold text-center animate-pulse bg-gray-200 h-6 w-1/4 mx-auto"></h1>
        <p className="text-center text-gray-500 mt-2 animate-pulse bg-gray-200 h-4 w-1/3 mx-auto"></p>
  
        <div className="overflow-x-auto mt-8">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 text-left">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                </th>
                <th className="px-4 py-2 text-left">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                </th>
                <th className="px-4 py-2 text-left">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-28"></div>
                </th>
                <th className="px-4 py-2 text-left">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-16"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                  </td>
                  <td className="px-4 py-4 flex items-center gap-4">
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if(wishlist.length === 0){
    return  <div className="flex flex-col items-center justify-center min-h-[80%] text-center">
    <Image
      src="/wishlist-empty.webp" // Replace with your image path or URL
      alt="Empty Wishlist"
      width={300}
      height={300}
      className="mt-14"
    />
    <h1 className="text-2xl font-semibold text-gray-700">Your Wishlist is Empty!</h1>
    <p className="text-gray-500 mt-2">
      Start adding your favorite items to your wishlist.
    </p>
    <button
      onClick={() => router.push('/')} // Redirect to products page
      className="mt-6 bg-pink-500 text-white px-5 py-2 rounded-lg hover:bg-pink-600 transition duration-300"
    >
      Start Adding Favorites
    </button>
  </div>
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center">Your Favorite Items</h1>
      <p className="text-center text-gray-500 mt-2">
        There are {wishlist.length.toString().padStart(2, '0')} products in this list
      </p>

      <div className="overflow-x-auto mt-8">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Unit Price</th>
              <th className="px-4 py-2 text-left">Stock Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlist?.map((item,ind) => (
              <tr key={ind} className="border-t border-gray-200">
                <td className="px-4 py-4 flex items-center">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <span className="ml-4 font-medium text-gray-700">{item.name}</span>
                </td>
                <td className="px-4 py-4">
                  {item.price && (
                    <span className="line-through text-gray-400 mr-2">
                      ${item.price}
                    </span>
                  )}
                  <span className="font-semibold text-gray-700">
                    ${item.discountPrice}
                  </span>
                </td>
                {item.stock <=0 ? <td className="px-4 py-4 text-gray-500">Out of Stock</td>: <td className="px-4 py-4 text-green-500">In Stock</td>}
               
                <td className="px-4 py-4 flex items-center gap-4">
                {loadingProductId === item._id? <button className="bg-gray-500 text-white px-4 py-2 rounded " >
                    Adding
                  </button>:<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={()=>dispatch(addToCart({productId:item._id,quantity:1}))}>
                    Add to Cart
                  </button>
}
                  {loadWishlist===item._id?<button className="text-gray-500 hover:text-red-500">
                  Removing
                </button>:<button className="text-gray-500 hover:text-red-500" onClick={()=>dispatch(RemovewishList(item._id))}>
                    Remove
                  </button>}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
