"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Skel from "@skel-ui/react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchCategories } from "@/lib/reducers/categoryReducer";
import Link from "next/link";

export default function ProductCategories() {
  const dispatch = useAppDispatch();
  const { categories, loading, isfetched } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (!isfetched) {
      dispatch(fetchCategories());
    }
  }, [dispatch, isfetched]);

  const breakpoints = {
    0: { slidesPerView: 4, spaceBetween: 5 },
    464: { slidesPerView: 5, spaceBetween: 10 },
    768: { slidesPerView: 6, spaceBetween: 15 },
    1024: { slidesPerView: 7, spaceBetween: 15 },
  };

  return (
    <div className="relative  w-[90%] mx-auto">
      <div className="w-full md:w-[90%] lg:w-[85%] mx-auto py-3 sm:py-5">
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".custom-prev-btn",
            nextEl: ".custom-next-btn",
          }}
          breakpoints={breakpoints}
          spaceBetween={20}
          slidesPerView={6}
          loop={true}
          className="relative"
          freeMode={true} // Enables free scrolling like native horizontal scroll
          grabCursor={true} // Shows a grabbing cursor when interacting
        >
          {/* Swiper Slides */}
          {!loading
            ? categories?.map((category, ind) => (
                <SwiperSlide key={ind} className="text-center group sm:hover:bg-pink-400 sm:hover:text-white rounded-md">
                  <Link className="p-2 sm:p-4 hover:cursor-pointer" href={`/categories/${category?.slug}`}>
                  <Image
                    width={100}
                    height={100}
                    loading="lazy"
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + category?.image}
                    alt={category.name}
                    className="w-[clamp(4rem,6vw,7rem)] h-[clamp(4rem,6vw,7rem)] mx-auto mb-2 rounded-full border-2 border-pink-300"
                  />
                  <h3 className="text-gray-600 capitalize leading-6 transition-colors duration-300 sm:group-hover:text-white">{category?.name}</h3>
                  </Link>
                </SwiperSlide>
              ))
            : Array(6)
                .fill(0)
                .map((_, index) => (
                  <SwiperSlide key={index} className="flex flex-col items-center m-2">
                    <Skel.Item className="w-[clamp(4rem,6vw,7rem)] h-[clamp(4rem,6vw,7rem)] bg-gray-200 rounded-full shimmer" />
                    <Skel.Item className="h-4 w-24 bg-gray-200 shimmer mt-2" />
                  </SwiperSlide>
                ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button
          className=" hidden md:block custom-prev-btn absolute top-[40%] left-3 bg-white rounded-full p-2 shadow-md -ml-4 hover:bg-gray-100"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <button
          className="hidden md:block custom-next-btn absolute top-[40%] right-3 bg-white rounded-full p-2 shadow-md -mr-4 hover:bg-gray-100"
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
