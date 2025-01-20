"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import NavBar from "@/components/HomePage/Navbar";
import Footer from "@/components/HomePage/Footer";
import { Button } from "@/MaterialTailwindNext";
import Image from "next/image";
import { getServerCookie } from "@/utils/serverCookie";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/reducers/cartReducer";

export default function SearchPage() {
    const [products, setProducts] = useState([]);
  const {loadingProductId} = useSelector((state)=>state.cart)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const {user} = useSelector((store)=>store.user);
  const dispatch = useDispatch();
    const formatPrice = (price) => {
        return price ? `Rs.${parseFloat(price).toFixed(2)}` : "N/A";
      };
      const handleAddToCart = async (product) => {
          const data = { productId:product._id,name:product.name,quantity:1,img_src:product.images[0],price:product.price,discountedPrice:product.discountPrice,category:product.category.name,SKU:product.sku}
      
          dispatch(addToCart(data))
        };

    
    useEffect(() => {
        if (query) {
            const fetchProducts = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`/api/searches?search=${query}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    console.log(data)
                    setProducts(data.
                      products);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className=" max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Search Results for "{query}"</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
                        <span className="ml-4 text-xl text-gray-600">Loading...</span>
                    </div>
                ) : error ? (
                    <div className="flex items-center p-4 mt-4 border border-red-500 bg-red-100 text-red-600 rounded shadow-md">
                        <ExclamationCircleIcon className="h-8 w-8 mr-3" />
                        <span className="text-lg font-medium">Error: {error}</span>
                    </div>
                ) : products.length > 0 ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-2 md:gap-y-4 gap-x-1">
                        {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg p-2 md:p-4 hover:shadow-xl transition-[--tw-shadow] "
            >
              <Image
                width={300}
                height={300}
                src={product.images[0]}
                alt={product.name}
                className="w-full h-52 object-cover rounded-lg mb-4 "
              />
              <div className="px-1">
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
              </div>
              <Button
                className="mt-4 bg-[#F8C0BF] hover:bg-[#fe6161] transition-colors py-2 duration-300 px-4 rounded-md w-full capitalize text-sm"
                onClick={() => handleAddToCart(product)}
                disabled={loadingProductId === product._id}
              >
                {loadingProductId === product._id ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          ))}
                    </ul>
                ) : (
                    <div className="flex items-center p-4 mt-4 border border-red-500 bg-red-100 text-red-600 rounded shadow-md">
                        <ExclamationCircleIcon className="h-8 w-8 mr-3" />
                        <span className="text-lg font-medium">No products found</span>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
