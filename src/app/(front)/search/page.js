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
import ProductCard from "@/components/HomePage/ProductsCard";

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
            <div className=" max-w-7xl mx-auto p-6">
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
            <div key={product._id} >
             <ProductCard product={product}/>
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
