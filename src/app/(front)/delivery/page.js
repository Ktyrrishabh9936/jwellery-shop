"use client"
import DeliveryForm from "@/components/Delivery/DeliveryForm"
import OrderCart from "@/components/Delivery/OrderCart"
import NavBar from "@/components/HomePage/Navbar"
import Footer from "@/components/HomePage/Footer"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ShoppingBag } from "lucide-react"

export default function DeliveryPage() {
  const { Items } = useSelector((state) => state.cart)
  const router = useRouter()
  const [noItems,setNoItems]= useState(false);

  // Redirect to cart if no items
  useEffect(() => {
    if (!Items || Items.length === 0) {
      router.push("/checkout")
      setNoItems(true)
    }
  }, [])

  if (noItems) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-6">Add items to your cart to proceed with checkout</p>
            <button
              onClick={() => router.push("/shop")}
              className="px-6 py-3 bg-pink-600 text-white rounded-md font-medium hover:bg-pink-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">Checkout</h1>
            <div className="lg:col-span-2">
              <DeliveryForm />
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
