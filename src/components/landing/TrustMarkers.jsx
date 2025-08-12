"use client"
import { motion } from "framer-motion"
import { Truck, Shield, Package, HeadphonesIcon } from "lucide-react"
import Image from "next/image"

const trustFeatures = [
  {
    icon: Truck,
    title: "Cash on Delivery Available",
    description: "Shop stress-free and pay at your convenience with our easy Cash on Delivery option.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Each piece passes through strict quality checks to ensure it arrives flawless and ready to shine.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Package,
    title: "Premium & Secure Packaging",
    description:
      "Your jewellery is carefully packed in secure, damage-proof boxes for a delightful unboxing experience.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: HeadphonesIcon,
    title: "Support That Truly Cares",
    description:
      "Need help? Jenii's team is here to guide you with quick, friendly, and reliable support whenever you need it.",
    color: "from-orange-500 to-red-600",
  },
]

export default function TrustMarkers() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust Markers Image */}
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20%283%29-WPr0e60YQV0ABpOoNZvWdEH3IrZXD4.png"
            alt="Trust Markers"
            width={1200}
            height={150}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </motion.div> */}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100 hover:border-primary-200">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
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
