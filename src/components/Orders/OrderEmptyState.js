import { ShoppingBag, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function OrderEmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6">
        <Package className="h-12 w-12 text-pink-600" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        You haven't placed any orders yet. Start shopping to see your orders here.
      </p>
      <Image src="/empty-orders.webp" alt="Empty orders" width={200} height={200} className="mx-auto mb-6" />
      <Link href="/">
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Start Shopping
        </button>
      </Link>
    </div>
  )
}
