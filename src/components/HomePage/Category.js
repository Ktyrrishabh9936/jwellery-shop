"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import Skel from '@skel-ui/react';
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchCategories } from "@/lib/reducers/categoryReducer";
export default function ProductCategories() {
  const dispatch = useAppDispatch();
  const {categories,loading,isfetched}= useAppSelector((state)=>state.categories)
 
  useEffect(()=>{
    function handlegetData(){
      if(!isfetched){
        dispatch(fetchCategories());
      }
    }
    handlegetData();
  },[])
  // const categories = [
  //   { name: "Pendants", image: "/images/pendants.png" },
  //   { name: "Earing", image: "/images/earings.png" },
  //   { name: "Necklace", image: "/images/necklaces.png" },
  //   { name: "Bracelets", image: "/images/bracelets.png" },
  //   { name: "Sets", image: "/images/sets.png" },
  //   { name: "Anklets", image: "/images/anklets.png" },
  // ];

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 6},
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 6,  },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 5,arrows:false, partialVisibilityGutter: 10 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 4,arrows:false, partialVisibilityGutter: 5 },
  };

  const CustomLeftArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-3  bg-white rounded-full p-2 shadow-md -ml-4 hover:bg-gray-100"
      aria-label="Previous"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>

    </button>
  );

  const CustomRightArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-3 z-30 bg-white rounded-full p-2 shadow-md -mr-4 hover:bg-gray-100"
      aria-label="Next"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
</svg>

    </button>
  );

  return (<div className="relative w-full">
    <div className="w-full md:w-[90%] lg:w-[80%] mx-auto py-4 sm:py-8 ">
      <Carousel
        responsive={responsive}
        infinite={true}
        showDots={false}
        partialVisible={true}
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        removeArrowOnDeviceType={["tablet", "mobile"]}
        className=""
      >
        { !loading ? categories?.map((category,ind) => (
          <div key={ind} className="text-center p-2 sm:p-4">
            <Image
              width={100}
              height={100}
              loading="lazy"
              src={category?.image}
              alt={category.name}
              className="w-[clamp(4rem,6vw,7rem)] h-[clamp(4rem,6vw,7rem)]   mx-auto mb-2 rounded-full"
            />
            <h3 className="text-gray-600">{category?.name}</h3>
          </div>)
        ):
        Array(6).fill(0).map((_, index) => (
        <div key={index} className="flex flex-col items-center m-2">
        <Skel.Item className="w-[clamp(4rem,6vw,7rem)] h-[clamp(4rem,6vw,7rem)] bg-gray-200 rounded-full shimmer" /> 
        <Skel.Item className="h-4 w-24 bg-gray-200 shimmer mt-2" /> 
      </div>))}
      </Carousel>
    </div>
    </div>
  );
}
