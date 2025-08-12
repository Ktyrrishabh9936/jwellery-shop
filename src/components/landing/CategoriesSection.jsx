"use client"
import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"

const categories = [
  {
    id: 1,
    name: "Earrings",
    startingPrice: 899,
    image: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    slug: "earrings",
  },
  {
    id: 2,
    name: "Rings",
    startingPrice: 899,
    image: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    slug: "rings",
  },
  {
    id: 3,
    name: "Necklace",
    startingPrice: 999,
    image: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    slug: "necklace",
  },
  {
    id: 4,
    name: "Bracelets",
    startingPrice: 1099,
    image: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    slug: "bracelets",
  },
  {
    id: 5,
    name: "Anklets",
    startingPrice: 799,
    image: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    slug: "anklets",
  },
]

export default function CategoriesSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef(null)

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 flex lg:flex-row flex-col justify-between items-center gap-x-4">
        {/* Header */}
        <div className="text-center lg:text-left mb-16 w-full lg:w-[30%]">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-2xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Discover Our Handpicked Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600"
            style={{ fontFamily: "Glacial Indifference, sans-serif" }}
          >
            Celebrate life's everyday moments with jewellery that reflects your personal story.
          </motion.p>
        </div>

        {/* Categories Swiper */}
        <div className="relative w-full lg:w-[70%]">
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 1.5,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            loop={true}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="categories-swiper"
          >
            {categories.map((category, index) => (
              <SwiperSlide key={category.id} className="!w-[300px] md:!w-[350px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: activeIndex === index ? 1.05 : 0.95,
                  }}
                  transition={{ duration: 0.5 }}
                  className="group cursor-pointer"
                >
                  <Link href={`/categories/${category.slug}`}>
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white">
                      <div className="aspect-[3/4] relative">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <motion.h3
                            className="text-2xl md:text-3xl font-bold mb-2"
                            style={{ fontFamily: "Cinzel, serif" }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {category.name}
                          </motion.h3>
                          <p className="text-lg opacity-90" style={{ fontFamily: "Glacial Indifference, sans-serif" }}>
                            Starting ₹{category.startingPrice}
                          </p>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Categories Grid Image */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-73Ygxf6dgN12EuoKaPpY8OJFRwgrnT.png"
            alt="Explore Categories"
            width={1200}
            height={300}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </motion.div> */}
      </div>

      <style jsx global>{`
        .categories-swiper .swiper-pagination {
          bottom: -50px !important;
        }
        .categories-swiper .swiper-pagination-bullet {
          background: #BC264B;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        .categories-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }
        .categories-swiper .swiper-button-next,
        .categories-swiper .swiper-button-prev {
          color: #BC264B;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .categories-swiper .swiper-button-next:after,
        .categories-swiper .swiper-button-prev:after {
          font-size: 20px;
        }
      `}</style>
    </section>
  )
}
