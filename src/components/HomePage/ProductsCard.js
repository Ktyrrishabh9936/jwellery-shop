"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/MaterialTailwindNext";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import { getServerCookie } from "@/utils/serverCookie";
import Skel from '@skel-ui/react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/reducers/cartReducer";

const products = [
  {
    id: 1,
    itemName: "Gold Necklace for Anniversary",
    cost: "Rs. 850",
    oldCost: "Rs. 950",
    rating: "4.5",
    imageUrl: "/images/Prod1.png",
  },
  {
    id: 2,
    itemName: "Diamond Ring for Engagement",
    cost: "Rs. 1,200",
    oldCost: "Rs. 1,500",
    rating: "4.7",
    imageUrl: "/images/Prod2.png",
  },
  {
    id: 3,
    itemName: "Platinum Bracelet for Graduation",
    cost: "Rs. 2,000",
    oldCost: "Rs. 2,300",
    rating: "4.8",
    imageUrl: "/images/Prod3.png",
  },
  {
    id: 4,
    itemName: "Emerald Earrings for Birthdays",
    cost: "Rs. 650",
    oldCost: "Rs. 800",
    rating: "4.2",
    imageUrl: "/images/Prod4.png",
  },
  {
    id: 5,
    itemName: "Ruby Pendant for Festivals",
    cost: "Rs. 750",
    oldCost: "Rs. 850",
    rating: "4.6",
    imageUrl: "/images/Prod5.png",
  },
  {
    id: 6,
    itemName: "Sapphire Studs for Special Occasions",
    cost: "Rs. 900",
    oldCost: "Rs. 1,000",
    rating: "4.4",
    imageUrl: "/images/Prod6.png",
  },
  {
    id: 7,
    itemName: "Pearl Bracelet for Everyday Wear",
    cost: "Rs. 400",
    oldCost: "Rs. 500",
    rating: "4.1",
    imageUrl: "/images/Prod7.png",
  },
  {
    id: 8,
    itemName: "Titanium Watch for Professionals",
    cost: "Rs. 3,500",
    oldCost: "Rs. 4,000",
    rating: "4.9",
    imageUrl: "/images/Prod8.png",
  },
];



export default function ProductsCard() {
  const [getProducts,setProducts] = useState(null)
  const {user} = useSelector((store)=>store.user);
  const dispatch = useDispatch();

  const handleGetProducts = async () => {
    try {
      const response = await axios.get("/api/products",{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Product Get", response.data.products);
      setProducts(response.data.products)
    } catch (err) {
      console.error("Error getting product", err.response ? err.response.data : err.message);
      toast.error("Failed to get product ");
    }

  };
  useEffect(()=>{
    // handleGetProducts();
  },[])

  const formatPrice = (price) => {
    return price ? `Rs.${parseFloat(price).toFixed(2)}` : "N/A";
  };

  const handleAddToCart = async (product) => {

    // Check if the user is logged in
    if (!user) {
      toast.error("Please log in to add products to your cart!");
      return;
    }

    dispatch(addToCart({productId:product._id,quantity:1}))
  };
  const {loadingProductId} = useSelector((state)=>state.cart)

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4">
      {/* Top Products Section */}
      {/* <section className="mb-12">
      {getProducts ? <><h2 className="text-2xl font-bold mt-6">Top Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-2 md:gap-y-4">
         { getProducts?.map((product) => (
            <div 
              key={product._id}
              className="bg-white rounded-lg p-2 md:p-4 shadow-none md:hover:shadow-xl transition-[--tw-shadow] "
            >
              <Link href={`/product/${product._id}`} >
              <Image
                width={300}
                height={300}
                loading="lazy"
                src={product.images[0]}
                alt={product.name}
                className="w-full h-[clamp(11rem,18vw,20rem)] object-cover rounded-lg "
              />
                <div className="flex justify-between items-center gap-2 mt-2">
                  <div className="flex  items-center gap-x-2  line-clamp-1 w-[90%]">
                    <span className="text-[#1E1E1E] font-semibold text-sm md:text-base ">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <strike className=" text-[#F42222] text-xs  line-clamp-1">
                      {formatPrice(product.price)}
                    </strike>
                  </div>
                  <div className="text-sm text-gray-500  flex justify-center items-center gap-2 w-[40px]">
                    <span className="text-[#F42222]">★</span>
                    <span>{product.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="text-gray-600 line-clamp-1">{product.name}</div>
              </Link>
              <Button
                className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] transition-colors py-2 duration-300 px-4 rounded-md w-full capitalize text-sm"
                onClick={() => handleAddToCart(product)}
                disabled={loadingProductId === product._id}
              >
                {loadingProductId === product._id ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          ))}
        </div></> :<div>
        <Skel.Item className="h-8 w-32 bg-gray-200 shimmer mb-4" /> 

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skel.Item className="w-full h-56 bg-gray-200 shimmer rounded-lg" /> 
              <div className="flex justify-between" >
              <Skel.Item className="h-3 w-24 bg-gray-200 shimmer" /> 
              <Skel.Item className="h-3 w-10 bg-gray-200 shimmer" /> 
              </div>
              <Skel.Item className="h-4 w-32 bg-gray-200 shimmer" />
              <Skel.Item className="h-8 w-full rounded-md bg-gray-200 shimmer" />
            </div>
          ))}
        </div>
      </div>}
      </section> */}

      {/* Shop by Category Section */}
      {/* <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
        <div className="flex justify-center gap-4 max-w-5xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative bg-white rounded-lg overflow-hidden  min-w-40 w-1/2 "
            >
              <Image
                width={133}
                height={150}
                src={category.imageUrl}
                alt={category.name}
                className="object-cover w-full h-full"
              />
              
            </div>
          ))}
        </div>
      </section> */}

      {/* Hot Picks Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Hot Picks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className=" shadow-md rounded-lg p-2 text-center hover:shadow-md"
            >
              <Image
                width={133}
                height={150}
                src={product.imageUrl}
                alt={product.itemName}
                className="w-full h-52 object-cover rounded-lg mb-4 "
              />
              <div className="text-gray-600">{product.itemName}</div>
              <div className="flex justify-center items-center gap-2 mt-2">
                <span className="text-red-500 text-lg">{product.cost}</span>
                <span className="line-through text-gray-400">
                  {product.oldCost}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {product.rating} ★
              </div>
              <Button
                className="mt-4 bg-[#fe6161] hover:bg-red-500 transition-colors text-white py-2 px-4 rounded-md w-full capitalize text-sm"
                onClick={() => handleAddToCart(product)}
                disabled={loadingProductId === product.id}
              >
                {loadingProductId === product.id ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
