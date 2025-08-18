"use client"
import { motion } from "framer-motion"
import { MessageCircle, Bell, Gift, Sparkles } from "lucide-react"

export default function WhatsAppCommunity() {
  const handleJoinWhatsApp = () => {
    // Replace with actual WhatsApp group link
    window.open("https://whatsapp.com/channel/0029VaZBieb9cDDfkAock63K", "_blank")
  }

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-emerald-50 font-parah">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content Side */}
            <div className="p-12 lg:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center mr-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-pink-600 font-semibold text-lg font-h1">Join Our Community</span>
                </div>

                <h2
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-h2"
                >
                  Offers You'll Love, Updates You'll Want
                </h2>

                <p
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                  style={{ fontFamily: "Glacial Indifference, sans-serif" }}
                >
                  Never miss a drop or deal again. Join our WhatsApp list for instant updates on new arrivals, sales,
                  and special collections.
                </p>

                {/* Benefits */}
                <div className="space-y-4 mb-8">
                  {[
                    { icon: Bell, text: "Instant notifications for new arrivals" },
                    { icon: Gift, text: "Exclusive deals and early access" },
                    { icon: Sparkles, text: "Special collection previews" },
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                        <benefit.icon className="w-4 h-4 text-pink-600" />
                      </div>
                      <span className="text-gray-700" style={{ fontFamily: "Glacial Indifference, sans-serif" }}>
                        {benefit.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  onClick={handleJoinWhatsApp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Join WhatsApp Community</span>
                </motion.button>

                <p className="text-sm text-gray-500 mt-4" style={{ fontFamily: "Glacial Indifference, sans-serif" }}>
                  Free to join • No spam • Unsubscribe anytime
                </p>
              </motion.div>
            </div>

            {/* Visual Side */}
            <div className="relative bg-gradient-to-br from-pink-400 to-emerald-600 p-12 lg:p-16 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Phone Mockup */}
                <div className="relative w-64 h-96 bg-white rounded-3xl shadow-2xl p-4">
                  <div className="w-full h-full bg-gray-100 rounded-2xl overflow-hidden">
                    {/* WhatsApp Interface Mockup */}
                    <div className="bg-pink-500 p-4 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-pink-500 font-bold text-lg">J</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Jenii Jewellery</h4>
                          <p className="text-xs opacity-90">Online</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Sample Messages */}
                      <div className="bg-pink-100 rounded-2xl p-3 ml-8">
                        <p className="text-sm">🎉 New Collection Alert! Check out our latest silver earrings</p>
                      </div>
                      <div className="bg-pink-100 rounded-2xl p-3 ml-8">
                        <p className="text-sm">💎 Exclusive 30% off for community members!</p>
                      </div>
                      <div className="bg-gray-200 rounded-2xl p-3 mr-8">
                        <p className="text-sm">Love the new designs! 😍</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
                >
                  <Bell className="w-8 h-8 text-pink-500" />
                </motion.div>

                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
                >
                  <Gift className="w-8 h-8 text-pink-500" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
