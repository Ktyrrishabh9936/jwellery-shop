import metaAPI from "./metaConversionAPI"

// Helper to extract user info from session/request
export const extractUserInfo = (user, address = null) => {
  if (!user) return {}

  const names = user.name ? user.name.split(" ") : []

  return {
    email: user.email,
    phone: user.phone,
    firstName: names[0] || "",
    lastName: names.slice(1).join(" ") || "",
    city: address?.city,
    state: address?.state,
    zipCode: address?.pincode,
    country: address?.country || "India",
  }
}

// Helper to format product data for Meta events
export const formatProductData = (product) => {
  return {
    productId: product._id || product.productId,
    productName: product.name,
    category: product.category?.name || product.category,
    price: product.discountPrice || product.price,
    sku: product.sku || product.SKU,
  }
}

// Helper to format cart contents for Meta events
export const formatCartContents = (cartItems) => {
  return cartItems.map((item) => ({
    id: item.productId || item._id,
    quantity: item.quantity,
    item_price: item.discountedPrice || item.price,
  }))
}

// Helper to get total cart value
export const getCartTotalValue = (cartItems) => {
  return cartItems.reduce((total, item) => {
    return total + (item.discountedPrice || item.price) * item.quantity
  }, 0)
}

// Helper to track page view with error handling
export const trackPageView = async (req, user, pageData) => {
  try {
    const userInfo = extractUserInfo(user)
    return await metaAPI.trackPageView(req, userInfo, pageData)
  } catch (error) {
    console.error("Error tracking page view:", error)
    return { success: false, error: error.message }
  }
}

// Helper to track product view
export const trackProductView = async (req, user, product) => {
  try {
    const userInfo = extractUserInfo(user)
    const productData = formatProductData(product)
    return await metaAPI.trackViewContent(req, userInfo, productData)
  } catch (error) {
    console.error("Error tracking product view:", error)
    return { success: false, error: error.message }
  }
}

// Helper to track add to cart
export const trackAddToCart = async (req, user, product, quantity = 1) => {
  try {
    const userInfo = extractUserInfo(user)
    const cartData = {
      ...formatProductData(product),
      quantity,
    }
    return await metaAPI.trackAddToCart(req, userInfo, cartData)
  } catch (error) {
    console.error("Error tracking add to cart:", error)
    return { success: false, error: error.message }
  }
}

// Helper to track purchase
export const trackPurchase = async (req, user, order) => {
  try {
    const userInfo = extractUserInfo(user, order.shippingAddress)
    const purchaseData = {
      orderId: order.orderNumber || order._id,
      totalValue: order.totalAmount || order.amount,
      productIds: order.items?.map((item) => item.productId) || [],
      numItems: order.items?.length || 0,
      contents:
        order.items?.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
          item_price: item.discountedPrice || item.price,
        })) || [],
    }
    return await metaAPI.trackPurchase(req, userInfo, purchaseData)
  } catch (error) {
    console.error("Error tracking purchase:", error)
    return { success: false, error: error.message }
  }
}
