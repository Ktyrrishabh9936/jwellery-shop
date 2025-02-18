"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

import Footer from "@/components/HomePage/Footer";
import NavBar from "@/components/HomePage/Navbar";
import Testimonials from "@/components/HomePage/Testimonials";
import Image from "next/image";
import dynamic from "next/dynamic";
import MenWomenSection from "@/components/HomePage/men-women";
import GiftingGuide from "@/components/HomePage/Relations";
const HotPicks = dynamic(() => import( "@/components/HomePage/HotPicks"));

// Lazy-loaded components
const Banner = dynamic(() => import("@/components/HomePage/Banner"));
const ProductCategories = dynamic(() => import("@/components/HomePage/Category"));
const HeroSlider = dynamic(() => import("@/components/HomePage/HeroSlider"));
const ProductsCard = dynamic(() => import("@/components/HomePage/ProductsCard"));
const TopProducts = dynamic(() => import("@/components/HomePage/TopProducts"));

// Animation Variants
const animationVariants = {
  hidden: { opacity: 0, y: 50 }, // Start offscreen
  visible: { opacity: 1, y: 0 }, // Slide in and fade in
};

const AnimatedSection = ({ children }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      variants={animationVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      { children}
    </motion.div>
  );
};

export default function HomePage() {
  return (
    <div>
      <NavBar />
      <main>
        <AnimatedSection>
          <HeroSlider />
        </AnimatedSection>
        <AnimatedSection>
          <ProductCategories />
        </AnimatedSection>
        <AnimatedSection>
          <TopProducts />
        </AnimatedSection>
        <AnimatedSection>
          <MenWomenSection />
        </AnimatedSection>

        <AnimatedSection>
          <GiftingGuide />
        </AnimatedSection>
        <AnimatedSection>
          <Banner />
        </AnimatedSection>
        <AnimatedSection>
          <HotPicks />
        </AnimatedSection>
      </main>

      <div className="w-full overflow-auto">
        <Image
          width={900}
          height={400}
          src="/images/Flower.png"
          className="object-cover w-full"
          alt="flower"
        />
      </div>

      <AnimatedSection>
        <Testimonials />
      </AnimatedSection>

      <Footer />
    </div>
  );
}
