"use client"
import { motion } from "framer-motion"

const marqueeItems = [
  "✨ Free Shipping on Orders Above ₹4999",
  "🎁 Easy 15 Day Returns",
  "💎 Certified 925 Sterling Silver",
  "🛡️ Lifetime Plating Warranty",
  "🚚 Cash on Delivery Available",
  "💝 Premium Gift Packaging",
]

export default function MarqueeSection() {
  return (
    <section className="bg-[#c41e55] text-white py-4 overflow-hidden">
      <motion.div
        animate={{ x: ["100%", "-100%"] }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
        className="flex whitespace-nowrap"
      >
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span
            key={index}
            className="mx-8  font-parah"
            style={{ fontFamily: "Glacial Indifference, sans-serif" }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
