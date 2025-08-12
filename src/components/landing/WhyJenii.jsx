"use client"
import { motion } from "framer-motion"
import { Sparkles, Heart, Shield, Award, CheckCircle } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Sparkles,
    title: "Modern Jewellery, Indian Soul",
    description: "Timeless silver pieces designed for today, rooted in tradition.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Heart,
    title: "Handcrafted by Local Artisans",
    description: "Every piece is shaped with care and attention by skilled hands.",
    color: "from-pink-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Safe for All Skin Types",
    description: "Nickel-free and hypoallergenic sterling silver that feels as good as it looks.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Award,
    title: "Quality You Can Trust",
    description: "Plating warranty, lab-tested purity, and no shortcuts ever.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: CheckCircle,
    title: "Certified 925 Hallmarked Silver",
    description: "Authentic, BIS-certified sterling silver that meets national standards.",
    color: "from-indigo-500 to-purple-500",
  },
]

export default function WhyJenii() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Why Jenii
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600"
            style={{ fontFamily: "Glacial Indifference, sans-serif" }}
          >
            Why You'll Love Jenii
          </motion.p>
        </div>

        {/* Trust Markers Image */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20%282%29-UbR7k3R9TI9NJeqH1JK3H3vVL1Njoy.png"
            alt="Jenii Trust Markers"
            width={1200}
            height={200}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-primary-200">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Cinzel, serif" }}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Glacial Indifference, sans-serif" }}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
