"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { IconButton } from "@material-tailwind/react";
import { NavArrowRight, NavArrowLeft } from "iconoir-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useMediaQuery } from "react-responsive";

export function CustomNavigation() {
  const swiper = useSwiper();

  return (
    <>
      <IconButton
        size="lg"
        onClick={() => swiper.slidePrev()}
        className="!absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-pink-400 shadow-none"
      >
        <NavArrowLeft className="h-7 w-7 -translate-x-0.5 stroke-2 text-white" />
      </IconButton>

      <IconButton
        size="lg"
        onClick={() => swiper.slideNext()}
        className="!absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-pink-400 shadow-none"
      >
        <NavArrowRight className="h-7 w-7 translate-x-px stroke-2 text-white" />
      </IconButton>
    </>
  );
}

export default function HeroSlider() {
  const heroSlides = [
    {
      id: 1,
      title: "Elegant Silver Collection",
      subtitle: "Discover timeless beauty",
      image: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/Banner-1.png?updatedAt=1755504727407",
      imageSm: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/banner-sm-1.png?updatedAt=1755504796967",
      cta: "Shop Now",
      link: "/earnings",
    },
    {
      id: 2,
      title: "Handcrafted Excellence",
      subtitle: "Made with love and precision",
      image: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/Banner-2.png?updatedAt=1755504726335",
      imageSm: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/banner-sm-2.png?updatedAt=1755504769187",
      cta: "Explore",
      link: "/earnings",
    },
    {
      id: 3,
      title: "Modern Designs",
      subtitle: "Contemporary style meets tradition",
      image: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/Banner-3.png?updatedAt=1755504726704",
      imageSm: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/banner-sm-3.png?updatedAt=1755509372290",
      cta: "Discover",
      link: "/earnings",
    },
    {
      id: 4,
      title: "Elegant Silver Collection",
      subtitle: "Discover timeless beauty",
      image: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/Banner-1.png?updatedAt=1755504727407",
      imageSm: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/banner-sm-1.png?updatedAt=1755504796967",
      cta: "Shop Now",
      link: "/earnings",
    },
    {
      id: 5,
      title: "Handcrafted Excellence",
      subtitle: "Made with love and precision",
      image: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/Banner-2.png?updatedAt=1755504726335",
      imageSm: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/banner-sm-2.png?updatedAt=1755504769187",
      cta: "Explore",
      link: "/earnings",
    },
    {
      id: 6,
      title: "Modern Designs",
      subtitle: "Contemporary style meets tradition",
      image: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/Banner-3.png?updatedAt=1755504726704",
      imageSm: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/banner-sm-3.png?updatedAt=1755509372290",
      cta: "Discover",
      link: "/earnings",
    },
  ];
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <div className="relative w-full my-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        slidesPerView={1.2} // fraction -> partial visibility
        centeredSlides={true} // center active slide
        grabCursor={true} // better UX
        className="w-full max-w-[1400px] mx-auto"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="select-none w-[80%]  relative rounded-xl overflow-hidden shadow-lg"
          >
            <Link href={slide.link}>
              <div className="relative h-auto">
                <Image
                  src={isMobile?slide.imageSm:slide.image}
                  alt={slide.title}
                  width={1200}
                  height={1000}
                  
                  className="object-contain"
                  priority={index === 0}
                />
                {/* <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white p-6">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
                  <button className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
                    {slide.cta}
                  </button>
                </div> */}
              </div>
            </Link>
          </SwiperSlide>
        ))}

       { isMobile ? "" :<CustomNavigation />}
      </Swiper>
    </div>
  );
}
