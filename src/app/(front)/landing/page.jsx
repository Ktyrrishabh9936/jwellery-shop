"use client"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

// Components
import Footer from "@/components/HomePage/Footer"
import HeroSection from "@/components/landing/HeroSection"
import MarqueeSection from "@/components/landing/MarqueeSection"
import BestSellers from "@/components/landing/BestSellers"
import WhyJenii from "@/components/landing/WhyJenii"
import CategoriesSection from "@/components/landing/CategoriesSection"
// import ExploreCategoriesSection from "@/components/HomePage/ExploreCategoriesSection"
// import ProductVideosTestimonials from "@/components/HomePage/ProductVideosTestimonials"
// import TrustMarkers from "@/components/HomePage/TrustMarkers"
// import WhatsAppCommunity from "@/components/HomePage/WhatsAppCommunity"
// import { useAppContext } from "@/contexts/AppContext"
// import ExploreCategoriesSection from "@/components/HomePage/ExploreCategoriesSection"
import ProductVideosTestimonials from "@/components/landing/ProductVideosTestimonials"
import TrustMarkers from "@/components/landing/TrustMarkers"
import WhatsAppCommunity from "@/components/landing/WhatsAppCommunity"
import NavBar from "@/components/HomePage/Navbar"
// Animation Variants
const animationVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

const AnimatedSection = ({ children, delay = 0 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      variants={animationVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
      <NavBar />
      <main>
        {/* Hero Section with Autoplay Carousel */}
        <AnimatedSection>
          <HeroSection />
        </AnimatedSection>

        {/* Marquee Section */}
        <AnimatedSection delay={0.1}>
          <MarqueeSection />
        </AnimatedSection>

        {/* Best Sellers Section */}
        <AnimatedSection delay={0.2}>
          <BestSellers />
        </AnimatedSection>

        {/* Why Jenii Section */}
        <AnimatedSection delay={0.3}>
          <WhyJenii />
        </AnimatedSection>

        {/* Categories Section with Smooth Zoom */}
        <AnimatedSection delay={0.4}>
          <CategoriesSection />
        </AnimatedSection>

        {/* Explore Categories */}
        {/* <AnimatedSection delay={0.5}>
          <ExploreCategoriesSection />
        </AnimatedSection> */}


         <AnimatedSection delay={0.6}>
          <ProductVideosTestimonials />
        </AnimatedSection>

        {/* Trust Markers */}
        <AnimatedSection delay={0.7}>
          <TrustMarkers />
        </AnimatedSection>

        {/* WhatsApp Community */}
        <AnimatedSection delay={0.8}>
          <WhatsAppCommunity />
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  )
}
