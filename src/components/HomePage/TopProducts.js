"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { fetchHotPicks, fetchMoreHotPicks } from "@/lib/reducers/collectionReducer";
import { formatPrice } from "@/utils/productDiscount";
import { addToCart } from "@/lib/reducers/cartReducer";
import { Button } from "@/MaterialTailwindNext";
import Skel from "@skel-ui/react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { TiStarFullOutline,TiStarHalfOutline,TiStarOutline } from "react-icons/ti";
import ProductGridLoader from "../Loaders/ProductGridLoader";
import { ChevronDownCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductsCard";
// import { useRouter } from "next/router";

export  function Star({rating,size='clamp(1rem,1.3vw,3rem)' ,color='#fe6161'}) {
  const ratingfunc = Array.from({length:5},(elem,index)=>{
          const number = rating+0.5;
           return(rating >= index+1 ? <TiStarFullOutline   style={{fontSize:size,color}} key={index}/> : number >= index+1 ? <TiStarHalfOutline style={{fontSize:size,color}} key={index}/> : <TiStarOutline   style={{fontSize:size,color}} key={index}/>)
})
return (
<div className="flex flex-row ">
  {ratingfunc}
</div>
)
}
const HotPicks = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    hotPicks,
    hotPicksCurrentPage,
    hotPicksTotalPages,
    hotPicksLoading,
    hotPicksNextload
  } = useSelector((state) => state.collection);

  useEffect(() => {
    if (hotPicksCurrentPage <= 1) {
      dispatch(fetchHotPicks({ page: 1, limit: 8 }));
    }
  }, []);

  const fetchMoreData = () => {
    if (hotPicksCurrentPage < hotPicksTotalPages && !hotPicksLoading) {
      dispatch(fetchMoreHotPicks({ page: hotPicksCurrentPage + 1, limit: 8 }));
    }
  };
  const { loadingProductId } = useSelector((state) => state.cart);
const handleAddToCart = async (product) => {
    const data = { productId:product._id,name:product.name,quantity:1,img_src:product.images[0],price:product.price,discountedPrice:product.discountPrice,category:product.category.name,SKU:product.sku}

    dispatch(addToCart(data))
  };
 
  const handleBuyNow = async (product) => {
    const data = { productId: product._id, name: product.name, quantity: 1, img_src: product.images[0], price: product.price, discountedPrice: product.discountPrice, category: product.category.name, SKU: product.sku };
    dispatch(addToCart(data));
    router.push('/checkout');
  };

  return (
    <section className="max-w-7xl mx-auto p-2 sm:p-4 mb-8 pb-4">
     {hotPicks.length ? <h2 className="text-2xl font-bold mt-6 ml-3">Hot Picks</h2>:""}
      {hotPicks.length ? (
        <>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 md:gap-3 mt-4"
        >
          {hotPicks.map((product) => (
             <ProductCard product={product}/>
          ))}
        </div>
        {hotPicksNextload && <ProductGridLoader />}
        {hotPicksCurrentPage < hotPicksTotalPages && <p className="mt-4 text-pink-500  hover:bg-pink-600 hover:text-white mx-auto text-center w-max group py-1.5 px-8 rounded-full  cursor-pointer hover:scale-105" onClick={fetchMoreData}> <span>View More </span> <span ><ChevronDownCircle className=" mx-auto  hover:text-2xl "/></span></p>}
        </>
      ) : (
        <div>
          <Skel.Item className="h-8 w-32 bg-gray-200 shimmer mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-3 md:gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skel.Item className="w-full h-56 bg-gray-200 shimmer rounded-lg" />
                  <div className="flex justify-between">
                    <Skel.Item className="h-3 w-24 bg-gray-200 shimmer" />
                    <Skel.Item className="h-3 w-10 bg-gray-200 shimmer" />
                  </div>
                  <Skel.Item className="h-4 w-32 bg-gray-200 shimmer" />
                  <Skel.Item className="h-8 w-full rounded-md bg-gray-200 shimmer" />
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HotPicks;
