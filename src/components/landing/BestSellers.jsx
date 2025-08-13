"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { addToCart } from "@/lib/reducers/cartReducer";
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDispatch } from "react-redux"
const bestSellers = [
  {
    id: "680b79a4342ab5391a34f156",
    name: "The Sunflower Diamond Earring",
    category: "earrings",
    price: 2365.00,
    discountPrice: 1773.74,
    discount: 26,
    rating: 0,
    reviews: 0,
    image: "products/images/10579-7565d000-28fd-4a44-917c-0e5053b11ab8",
    isNew: false,
    url: "/product/680b79a4342ab5391a34f156",
    sku: "10579"
  },
  {
    id: "680b7ac1342ab5391a34f15c",
    name: "Sunflower Serenade",
    category: "earrings",
    price: 2343.00,
    discountPrice: 1757.25,
    discount: 25,
    rating: 0,
    reviews: 0,
    image: "products/images/10597-3be6e7c2-48c7-4678-86fe-c63efdc53386",
    isNew: false,
    url: "/product/680b7ac1342ab5391a34f15c",
    sku: "10597"
  },
  {
    id: "680b7936342ab5391a34f153",
    name: "Diamond dust Trail",
    category: "earrings",
    price: 1815.00,
    discountPrice: 1361.25,
    discount: 25,
    rating: 0,
    reviews: 0,
    image: "products/images/10578-352df061-8ada-4288-be54-4e8b3f028d71",
    isNew: false,
    url: "/product/680b7936342ab5391a34f153",
    sku: "10578"
  },
  {
    id: "680b73d2342ab5391a34f13c",
    name: "Radiant Sunburst earrings",
    category: "earrings",
    price: 1488.00,
    discountPrice: 1116.00,
    discount: 25,
    rating: 0,
    reviews: 0,
    image: "products/images/10464-5bf5e267-10f5-4ef5-8546-ae0f0b6c3b1f",
    isNew: false,
    url: "/product/680b73d2342ab5391a34f13c",
    sku: "10464"
  },
  {
    id: "680b7a2f342ab5391a34f159",
    name: "Diamond DewDrop Tulip",
    category: "earrings",
    price: 3228.00,
    discountPrice: 2421.00,
    discount: 25,
    rating: 0,
    reviews: 0,
    image: "products/images/10581-ce1fe026-a410-4e88-b419-8e909887cffe",
    isNew: false,
    url: "/product/680b7a2f342ab5391a34f159",
    sku: "10581"
  },
  {
    id: "680b7b82342ab5391a34f162",
    name: "Classic Pearl Drop",
    category: "earrings",
    price: 2970.00,
    discountPrice: 2227.49,
    discount: 26,
    rating: 0,
    reviews: 0,
    image: "products/images/10701-789cbd22-a843-4c00-85a4-ad0da5ba3a2c",
    isNew: false,
    url: "/product/680b7b82342ab5391a34f162",
    sku: "10701"
  },
  {
    id: "680b8166342ab5391a34f183",
    name: "Diamond Halo Pearl",
    category: "earrings",
    price: 3097.00,
    discountPrice: 2322.74,
    discount: 26,
    rating: 0,
    reviews: 0,
    image: "products/images/10952-590c019e-f99b-44b6-8533-3515e8d84895",
    isNew: false,
    url: "/product/680b8166342ab5391a34f183",
    sku: "10952"
  },
  {
    id: "680b7dfb342ab5391a34f171",
    name: "Eternal Loop",
    category: "earrings",
    price: 4150.00,
    discountPrice: 3112.49,
    discount: 26,
    rating: 0,
    reviews: 0,
    image: "products/images/10945-4621c770-5851-4511-a0c5-a76f71e008e6",
    isNew: false,
    url: "/product/680b7dfb342ab5391a34f171",
    sku: "10945"
  }
];


export default function BestSellers() {

  const [hoveredProduct, setHoveredProduct] = useState(null)
    const dispatch = useDispatch();

  
  const handleAddToCart = async (product) => {
      const data = { productId:product.id,name:product.name,quantity:1,img_src:product.image,price:product.price,discountedPrice:product.discountPrice,category:product.category,SKU:product.sku }
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
  <section className="py-16 bg-[#ffe4e4]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-h1"
          >
            Explore Our Best Sellers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 font-h2"
          >
            Top Picks You'll Love Instantly
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-parah">
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image */}
              
              <div className="relative overflow-hidden">
                <Link href={`/product/${product.id}`}>
                <Image
                  src={process.env.NEXT_PUBLIC_IMAGE_URL+product.image || "/placeholder.svg"}
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

                </Link>
                {/* Quick Add to Cart - Shows on Hover */}
                <div
                  className={`hidden md:block absolute bottom-4 left-4 right-4 transform transition-all duration-300 ${
                    hoveredProduct === product.id ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {false ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <Link href={`/product/${product.id}`}>
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
                  className="w-full bg-primary-100 hover:bg-primary-200 text-primary-700 py-3 px-4 rounded-lg font-medium transition-all duration-300 md:hidden"
                >
                  {false ? "Adding..." : "ADD TO CART"}
                </button>
              </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
