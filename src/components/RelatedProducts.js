"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/MaterialTailwindNext";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { addToCart } from "@/lib/reducers/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./HomePage/ProductsCard";

const RelatedProducts = ({ relatedProducts }) => {
  const dispatch = useDispatch();
    const formatPrice = (price) => {
        return price ? `Rs.${parseFloat(price).toFixed(2)}` : "N/A";
      };
      const { loadingProductId } = useSelector((state) => state.cart);
      const {user} = useSelector((store)=>store.user);
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please log in to add products to your cart!");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

    return (
        <div className="mt-10">
           <div className="my-3 font-semibold text-xl">
           You May Also Like it
           </div>
            <div className="grid grid-cols-2  md:grid-cols-3 gap-x-1 gap-y-2 md:gap-y-4">
          {relatedProducts.map((product) => (
             <ProductCard product={product}key={product._id} />
          ))}
        </div>
        </div>
    );
};

export default RelatedProducts;
