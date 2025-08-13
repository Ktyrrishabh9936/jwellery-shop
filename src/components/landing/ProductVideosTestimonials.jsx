"use client"
import { useRef, useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules"
import { motion } from "framer-motion"
import { Play, Pause, Star,ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/effect-coverflow"


const videoReels = [
  {
    id: 1,
    title: "Elegant Necklace Collection",
    thumbnail: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    videoUrl: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/clip-1.mp4?updatedAt=1755085594290",
    description: "Discover our stunning necklace designs",
  },
  {
    id: 2,
    title: "Diamond Styling Guide",
    thumbnail:
      "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    videoUrl: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/clip-2.mp4?updatedAt=1755085601151",
    description: "Learn how to style diamond jewelry",
  },
  {
    id: 3,
    title: "Handcrafted Rings",
    thumbnail: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    videoUrl: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/clip-3.mp4?updatedAt=1755085604084",
    description: "See our artisans at work",
  },
  {
    id: 4,
    title: "Festive Collection",
    thumbnail: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    videoUrl: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/clip-4.mp4?updatedAt=1755085595096",
    description: "Perfect for celebrations",
  },
  {
    id: 5,
    title: "Daily Wear Essentials",
    thumbnail: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    videoUrl: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/clip-5.mp4?updatedAt=1755085602365",
    description: "Comfortable everyday jewelry",
  },
  {
    id: 6,
    title: "Daily Wear Essentials",
    thumbnail: "https://i.pinimg.com/736x/ac/de/1a/acde1a41c0ea2a95556ef5d9152a1a12.jpg",
    videoUrl: "https://ik.imagekit.io/4yi3vfblpy/Landing%20Page/clip-6.mp4?updatedAt=1755085597293",
    description: "Comfortable everyday jewelry",
  },
  
]

const testimonials = [
  {
    id: 1,
    name: "Riya",
    location: "Pune",
    review:
      "I gifted a pair of earrings to my sister, and she hasn't taken them off since. The quality is amazing, and they look even better in person.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80&text=Riya",
  },
  {
    id: 2,
    name: "Nisha",
    location: "Bengaluru",
    review:
      "I was unsure about ordering silver jewellery online, but Jenii really impressed me. The packaging felt premium, and the design was exactly what I hoped for.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80&text=Nisha",
  },
  {
    id: 3,
    name: "Ayesha",
    location: "Delhi",
    review:
      "These earrings are perfect for daily wear. They're lightweight, don't irritate my skin, and go with everything I wear.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80&text=Ayesha",
  },
  {
    id: 4,
    name: "Sneha",
    location: "Mumbai",
    review:
      "Jenii's jewellery has that minimal yet elegant feel I love. I've already recommended it to two of my friends.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80&text=Sneha",
  },
  {
    id: 5,
    name: "Priyanka",
    location: "Ahmedabad",
    review:
      "I've ordered twice now, and both times the quality was on point. Definitely one of the better D2C brands out there.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80&text=Priyanka",
  },
  {
    id: 6,
    name: "Anjali",
    location: "Hyderabad",
    review: "Wore my Jenii hoops to work and got so many compliments. Stylish, subtle, and super wearable.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80&text=Anjali",
  },
]

export default function ProductVideosTestimonials() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRefs = useRef([])
  const swiperRef = useRef(null)

  useEffect(() => {
    // Pause all videos except the active one
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeVideoIndex && isPlaying) {
          video.play()
        } else {
          video.pause()
        }
      }
    })
  }, [activeVideoIndex, isPlaying])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-h1"
          >
            Elegant. Versatile. Stunning Jenii.
          </motion.h2>
        </div>

        {/* Video Reels Section */}
        <div className="mb-20">
          <div className="relative">
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
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              onSlideChange={(swiper) => {
                setActiveVideoIndex(swiper.realIndex)
                setIsPlaying(false)
              }}
              loop={true}
              className="video-swiper"
            >
              {videoReels.map((reel, index) => (
                <SwiperSlide key={reel.id} className="!w-[300px] md:!w-[400px]">
                  <div className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl bg-black">
                    {/* Video Element */}
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="w-full h-full object-contain"
                      // poster={reel.thumbnail}
                      muted
                      // loop
                      // playsInline
                    >
                      <source src={reel.videoUrl} type="video/mp4" />
                    </video>

                    {/* Play/Pause Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={togglePlay}
                        className={`w-16 h-16 rounded-full bg-pink-400 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                          activeVideoIndex === index ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {isPlaying && activeVideoIndex === index ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white ml-1" />
                        )}
                      </button>
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-xl font-bold mb-2 font-h2">
                        {reel.title}
                      </h3>
                      <p className="text-sm opacity-90 font-parah" >
                        {reel.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Testimonials Section */}
            <section className="py-16 ">
      <motion.h3
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 font-h1"
      >
        What Our Customers Say
      </motion.h3>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute -left-10 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </div>
        <div className="swiper-button-next-custom absolute -right-10 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition">
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
          loop
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col my-2"
              >
                {/* Rating */}
                <div className="flex items-center mb-4 font-parah">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-pink-400 fill-current italic" />
                  ))}
                </div>

                {/* Review */}
                <p
                  className="text-gray-700 mb-6 leading-relaxed flex-grow "
                >
                  "{testimonial.review}"
                </p>

                {/* Customer Info */}
                <div className="mt-auto">
                  <h4
                    className="font-semibold text-gray-900 font-h2"
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    className="text-sm text-gray-600 font-parah"
                  >
                    {testimonial.location}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>

      </div>

      <style jsx global>{`
        .video-swiper .swiper-pagination {
          bottom: -50px !important;
        }
        .video-swiper .swiper-pagination-bullet {
          background: #BC264B;
          opacity: 0.5;
          width: 12px;
          height: 12px;
        }
        .video-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }
        .video-swiper .swiper-button-next,
        .video-swiper .swiper-button-prev {
          color: #BC264B;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .video-swiper .swiper-button-next:after,
        .video-swiper .swiper-button-prev:after {
          font-size: 20px;
        }
      `}</style>
    </section>
  )
}
