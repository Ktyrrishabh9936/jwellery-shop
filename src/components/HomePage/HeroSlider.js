"use client"
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getHeroSlides } from "@/lib/reducers/slidesReducer";
import { useEffect } from "react";
import toast from "react-hot-toast";


import "swiper/css";

import "swiper/css/navigation";

import "swiper/css/pagination";

import * as React from "react";

import { Autoplay, Navigation, Pagination } from "swiper/modules";

import { IconButton } from "@material-tailwind/react";

import { NavArrowRight, NavArrowLeft } from "iconoir-react";

import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import Link from "next/link";
import { useMediaQuery } from 'react-responsive';
 export function CustomNavigation() {
  const swiper = useSwiper();

  return (
    <>
      <IconButton
        size="lg"
        onClick={() => swiper.slidePrev()}
        className=" !absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-transparent shadow-none"
      >
        <NavArrowLeft className="h-7 w-7 -translate-x-0.5 stroke-2" />
      </IconButton>

      <IconButton
        size="lg"
        onClick={() => swiper.slideNext()}
        className=" !absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-transparent shadow-none"
      >
        <NavArrowRight className="h-7 w-7 translate-x-px stroke-2" />
      </IconButton>
    </>
  );
}
function customPagination(_, className) {
  return <span className="${className} w-4 h-4 [&.swiper-pagination-bullet-active]:!opacity-100 [&.swiper-pagination-bullet-active]:[background:rgb(var(--color-background))] !opacity-50 ![background:rgb(var(--color-background))]"></span>;
}
 
export default function HeroSlider() {
  const dispatch = useAppDispatch();
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });
  const {heroSlides,heroloading,isherofetched,heroFetcherror}= useAppSelector((state)=>state.slides)
  useEffect(()=>{
    const handleGetSlides = async () => {
      try {
        if(!isherofetched){
          dispatch(getHeroSlides())
        }
      } catch (err) {
        console.error("Error getting Slides", heroFetcherror);
        toast.error("Error getting Slides")
      }
  
    };
    handleGetSlides();
  },[])
   if(heroloading){
    return <div className="w-full h-[clamp(12rem,30vw,40rem)] bg-gray-200 shimmer rounded-lg" />
   }
  return (
    <>
    {/* <Carousel className=" cursor-pointer bg-blue-gray-50 h-[clamp(12rem,30vw,40rem)]"
     autoplay autoplayDelay={10000} loop
    >
      {heroSlides?.map((item,index)=>  
       {return <div className="relative h-full w-full" key={index}>
        <Image width={900} height={300} 
          src={item?.desktopBannerImage}
          alt={`Hero ${index}`}
          className="h-full w-full object-cover"
        />
      </div>})}
    </Carousel> */}

<div className="">
      <Swiper
      grabCursor
      loop
      pagination={{
        el: "#containerForBullets",
        type: "bullets",
        bulletClass: "swiper-custom-bullet",
        bulletActiveClass: "swiper-custom-bullet-active",
        clickable: true,
      }}
        
        modules={[Navigation, Pagination,Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        className="relative rounded-lg [&_div.swiper-button-next]:text-background [&_div.swiper-button-prev]:text-background cursor-pointer bg-blue-gray-50 h-[clamp(18remrem,36vw,40rem)] md:h-[clamp(12rem,30vw,40rem)]"
      >
        {heroSlides?.map((item, index) => (
          <SwiperSlide key={index} className="select-none">
        
           <Link href={item?.links}>  <Image width={2000} height={800} 
          src={isSmallScreen ? process.env.NEXT_PUBLIC_IMAGE_URL + item?.mobileBannerImage :process.env.NEXT_PUBLIC_IMAGE_URL +item?.desktopBannerImage}
          alt={`Hero ${index}`}
          className="h-full w-full object-cover"
        /></Link>
          </SwiperSlide>
        ))}

        <CustomNavigation />
      </Swiper>
    </div>

    </>
  );
}