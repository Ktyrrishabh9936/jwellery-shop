"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
// import { useAppContext } from "@/contexts/AppContext"
import { addToCart } from "@/lib/reducers/cartReducer";
import { useRouter } from "next/navigation"
const bestSellers = [
  {
    id: "680c51ee23a67ac3c1f7ebf8",
    name: "Kaleidoscope Wristlet",
    price: 7733.00,
    discountPrice: 5799.73,
    discount: 25,
    rating: 4.8,
    reviews: 124,
    image:
      "https://res.cloudinary.com/dk1thmps6/products/images/9870-4f23ab90-e002-4e87-b68b-94cb5745515c",
    isNew: false,
    url: "/product/680c51ee23a67ac3c1f7ebf8",
  },
  {
    id: "680cc3e623a67ac3c1f7ed45",
    name: "Silverwing Pendant",
    price: 2123.00,
    discountPrice: 1592.25,
    discount: 25,
    rating: 5,
    reviews: 10,
    image:
      "https://res.cloudinary.com/dk1thmps6/products/images/10726-d0bd409c-4c9a-4f19-bf2a-7a5f70aef81c",
    isNew: false,
    url: "/product/680cc3e623a67ac3c1f7ed45",
  },
  {
    id: "684b863de4422f0446e90df9",
    name: "ChandiChaal",
    price: 4453.00,
    discountPrice: 3339.74,
    discount: 25,
    rating: 4.7,
    reviews: 89,
    image:
      "https://res.cloudinary.com/dk1thmps6/products/images/10414-8dda13b6-6c0f-4241-b37e-92635c72a212",
    isNew: true,
    url: "/product/684b863de4422f0446e90df9",
  },
  {
    id: "680b7936342ab5391a34f153",
    name: "Diamond dust Trail",
    price: 1815.00,
    discountPrice: 1361.25,
    discount: 25,
    rating: 4.8,
    reviews: 156,
    image:
      "https://res.cloudinary.com/dk1thmps6/products/images/10578-352df061-8ada-4288-be54-4e8b3f028d71",
    isNew: false,
    url: "/product/680b7936342ab5391a34f153",
  },
]

export default function BestSellers() {
//   const { addToCart, toggleWishlist, state } = useAppContext()

  const [hoveredProduct, setHoveredProduct] = useState(null)
    const router = useRouter();

  
  const handleAddToCart = async (product) => {
      const data = { productId:product.id,name:product.name,quantity:1,img_src:product.images[0],price:product.price,discountedPrice:product.discountPrice,category:product.category,SKU:`SKU-${product.id}`}
      dispatch(addToCart(data))
    };

  const renderStars = (rating) => {
    if (rating === 0) {
      return (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-gray-300" />
          ))}
        </div>
      )
    }

    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Explore Our Best Sellers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600"
            style={{ fontFamily: "Glacial Indifference, sans-serif" }}
          >
            Top Picks You'll Love Instantly
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              onClick={() => router.push(`/product/${product.id}`)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {/* {product.isNew && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      NEW ARRIVAL
                    </span>
                  )} */}
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.discount}% OFF
                  </span>
                </div>

                {/* Wishlist Button */}
                {/* <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      false ? "text-red-500 fill-current" : "text-gray-600"
                    }`}
                  />
                </button> */}

                {/* Quick Add to Cart - Shows on Hover */}
                <div
                  className={`absolute bottom-4 left-4 right-4 transform transition-all duration-300 ${
                    hoveredProduct === product.id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <button
                    onClick={() => router.push(`/product/${product.id}`)}
                    // disabled={state.cart.loading.cart === product.id}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {false ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Shop Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">{product.name}</h3>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-primary-500">₹{product.discountPrice.toLocaleString()}</span>
                  <span className="text-lg text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                </div>

                {/* Add to Cart Button - Always Visible on Mobile */}
                <button
                  onClick={() => handleAddToCart(product)}
                //   disabled={state.cart.loading.cart === product.id}
                  className="w-full bg-primary-100 hover:bg-primary-200 text-primary-700 py-3 px-4 rounded-lg font-medium transition-all duration-300 md:hidden"
                >
                  {false ? "Adding..." : "ADD TO CART"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
