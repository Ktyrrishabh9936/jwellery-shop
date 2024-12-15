
"use client"
import { lazy } from "react";

import Footer from "@/components/HomePage/Footer";
const Banner = lazy(() => import("@/components/HomePage/Banner"));
const ProductCategories = lazy(() => import( "@/components/HomePage/Category"));
const HeroSlider = lazy(() => import( "@/components/HomePage/HeroSlider"));
import NavBar from "@/components/HomePage/Navbar";
const ProductsCard = lazy(() => import( "@/components/HomePage/ProductsCard"));
import Testimonials from "@/components/HomePage/Testimonials";
import Image from "next/image";

export default function HomePage() {  
 
  return (
    <div>
      <NavBar />
      <main>
       <HeroSlider />
        <ProductCategories />
        <Banner />
      <ProductsCard/>
      </main>
        <div className="w-full overflow-auto">
          <Image width={900} height={400}  src="/images/Flower.png" className="object-cover w-full" alt="flower" />
        </div>
        <Testimonials/>
      <Footer/>
    </div>
  );
}
