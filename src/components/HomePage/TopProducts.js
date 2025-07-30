"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchmoretopcollectionProducts, fetchtopcollectionProducts } from "@/lib/reducers/collectionReducer";
import Skel from "@skel-ui/react";
import { TiStarFullOutline,TiStarHalfOutline,TiStarOutline } from "react-icons/ti";
import ProductGridLoader from "../Loaders/ProductGridLoader";
import { ChevronDownCircle } from "lucide-react";
import ProductCard from "./ProductsCard";

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
const TopProducts = () => {
  const dispatch = useDispatch();
  const {
   
     topPicks,
    topPicksCurrentPage,
    topPicksTotalPages,
    topPicksLoading,
    topPicksNextload
  } = useSelector((state) => state.collection);

  useEffect(() => {
    if (topPicksCurrentPage <= 1) {
      dispatch(fetchtopcollectionProducts({ page: 1, limit: 8 }));
    }
  }, []);

  const fetchMoreData = () => {
    if (topPicksCurrentPage < topPicksTotalPages && !topPicksLoading) {
      dispatch(fetchmoretopcollectionProducts({ page: topPicksCurrentPage + 1, limit: 8 }));
    }
  };


  return (
    <section className="max-w-7xl mx-auto p-2 sm:p-4 mb-8 pb-4">
     {topPicks.length ? <h2 className="text-2xl font-bold mt-6 ml-3">Top Products</h2>:""}
      {topPicks.length ? (
        <>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 md:gap-3 mt-4"
        >
          {topPicks.map((product,ind) => (
             <ProductCard product={product} key={ind}/>
          ))}
        </div>
        {topPicksNextload && <ProductGridLoader />}
        {topPicksCurrentPage < topPicksTotalPages && <p className="mt-4 text-pink-500  hover:bg-pink-600 hover:text-white mx-auto text-center w-max group py-1.5 px-8 rounded-full  cursor-pointer hover:scale-105" onClick={fetchMoreData}> <span>View More </span> <span ><ChevronDownCircle className=" mx-auto  hover:text-2xl "/></span></p>}
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

export default TopProducts;
