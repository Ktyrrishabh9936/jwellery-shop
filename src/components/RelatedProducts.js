"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/MaterialTailwindNext";
import { toast } from "react-hot-toast";
import Image from "next/image";

const RelatedProducts = ({ relatedProducts }) => {
    const [loadingProductId, setLoadingProductId] = useState(null);
    const formatPrice = (price) => {
        return price ? `Rs.${parseFloat(price).toFixed(2)}` : "N/A";
      };
    
      const handleAddToCart = async (product) => {
        if (!token) {
          toast.info("Please log in to add products to your cart!");
          return;
        }
    
        setLoadingProductId(product._id); // Use product.id here, not product._id
    
        // Clean the price values before sending to the server
        const cleanPrice = parseFloat(product.discountPrice);
        const productData = {
          productId: product._id,
          img_src: product.images[0],
          name: product.name,
          price: cleanPrice, 
          quantity: 1,
        };
        console.log(productData)
    
        try {
          console.log(token);
          const response = await axios.post("/api/cart/add", productData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });
    
          console.log("Product added to cart:", response.data);
          toast.success("Product added to cart!");
        } catch (err) {
          console.error("Error adding to cart:", err.response ? err.response.data : err.message);
          toast.error("Failed to add product to cart!");
        } finally {
          setLoadingProductId(null);
        }
      };
    return (
        <div className="mt-10">
           <div className="my-3 font-semibold text-xl">
           You May Also Like it
           </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-1 gap-y-2 md:gap-y-4">
          {relatedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg p-2  hover:shadow-xl transition-[--tw-shadow] "
            >
              <Image
                width={300}
                height={300}
                src={product.images[0]}
                alt={product.name}
                className="w-full h-52 object-cover rounded-lg mb-4 "
              />
              <Link href={`/product/${product._id}`} className="px-1">
                <div className="flex justify-between items-center gap-2 mt-2">
                  <div className="flex  items-center gap-x-2  line-clamp-1 w-[90%]">
                    <span className="text-[#1E1E1E] font-semibold text-base ">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="line-through text-[#F42222] text-xs  line-clamp-1">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500  flex justify-center items-center gap-2 w-[40px]">
                    <span className="text-[#F42222]">★</span>
                    <span>3.6</span>
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
        </div>
        </div>
    );
};

export default RelatedProducts;
