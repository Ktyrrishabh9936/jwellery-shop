import crypto from "crypto"

class MetaConversionAPI {
  constructor() {
    this.accessToken = process.env.META_ACCESS_TOKEN
    this.pixelId = process.env.META_PIXEL_ID
    this.apiVersion = "v23.0"
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}/${this.pixelId}/events`
  }

  // Generate event ID to prevent duplicate events
  generateEventId() {
    return crypto.randomBytes(16).toString("hex")
  }

  // Hash user data for privacy
  hashUserData(data) {
    if (!data) return null
    return crypto.createHash("sha256").update(data).digest("hex")
  }

  // Get user data from request
  getUserData(req, userInfo = {}) {
    let ip = ''
    let userAgent = ''
  
    // ✅ App Router: NextRequest from `next/server`
    if (typeof req.headers.get === 'function') {
      ip = req.headers.get("x-forwarded-for") || req.ip || ""
      userAgent = req.headers.get("user-agent") || ""
    } else {
      // ✅ Pages Router: NextApiRequest
      ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || ""
      userAgent = req.headers["user-agent"] || ""
    }
    console.log(ip , userAgent)

    return {
      client_ip_address: ip.split(",")[0].trim(),
      client_user_agent: userAgent,
      em: userInfo.email ? [this.hashUserData(userInfo.email)] : undefined,
      ph: userInfo.phone ? [this.hashUserData(userInfo.phone)] : undefined,
      fn: userInfo.firstName ? [this.hashUserData(userInfo.firstName)] : undefined,
      ln: userInfo.lastName ? [this.hashUserData(userInfo.lastName)] : undefined,
      ct: userInfo.city ? [this.hashUserData(userInfo.city)] : undefined,
      st: userInfo.state ? [this.hashUserData(userInfo.state)] : undefined,
      zp: userInfo.zipCode ? [this.hashUserData(userInfo.zipCode)] : undefined,
      country: userInfo.country ? [this.hashUserData(userInfo.country)] : undefined,
    }
  }

  // Send event to Meta
  async sendEvent(eventName, eventData, req, userInfo = {}) {
    try {
      const eventId = this.generateEventId()
      const userData = this.getUserData(req, userInfo)

      const payload = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            user_data: userData,
            custom_data: eventData,
            event_source_url: req.headers.referer || req.url,
            action_source: "website",
          },
        ],
        test_event_code: process.env.NODE_ENV === "development" ? process.env.META_TEST_EVENT_CODE : undefined,
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Meta Conversion API Error:", result)
        return { success: false, error: result }
      }

      console.log(`Meta Event Sent: ${eventName}`, { eventId, success: true })
      return { success: true, eventId, result }
    } catch (error) {
      console.error("Meta Conversion API Error:", error)
      return { success: false, error: error.message }
    }
  }

  // Track Page View
  async trackPageView(req, userInfo = {}, pageData = {}) {
    return await this.sendEvent(
      "PageView",
      {
        content_name: pageData.pageName || "Page View",
        content_category: pageData.category || "general",
        content_ids: pageData.contentIds || [],
        value: pageData.value || 0,
        currency: "INR",
      },
      req,
      userInfo,
    )
  }

  // Track Product View
  async trackViewContent(req, userInfo = {}, productData = {}) {
    return await this.sendEvent(
      "ViewContent",
      {
        content_ids: [productData.productId],
        content_name: productData.productName,
        content_type: "product",
        content_category: productData.category,
        value: productData.price,
        currency: "INR",
        contents: [
          {
            id: productData.productId,
            quantity: 1,
            item_price: productData.price,
          },
        ],
      },
      req,
      userInfo,
    )
  }

  // Track Search
  async trackSearch(req, userInfo = {}, searchData = {}) {
    return await this.sendEvent(
      "Search",
      {
        search_string: searchData.searchTerm,
        content_category: searchData.category || "jewelry",
        content_ids: searchData.resultIds || [],
        value: searchData.totalValue || 0,
        currency: "INR",
      },
      req,
      userInfo,
    )
  }

  // Track Add to Cart
  async trackAddToCart(req, userInfo = {}, cartData = {}) {
    return await this.sendEvent(
      "AddToCart",
      {
        content_ids: [cartData.productId],
        content_name: cartData.productName,
        content_type: "product",
        content_category: cartData.category,
        value: cartData.price * cartData.quantity,
        currency: "INR",
        contents: [
          {
            id: cartData.productId,
            quantity: cartData.quantity,
            item_price: cartData.price,
          },
        ],
      },
      req,
      userInfo,
    )
  }

  // Track Add to Wishlist
  async trackAddToWishlist(req, userInfo = {}, wishlistData = {}) {
    return await this.sendEvent(
      "AddToWishlist",
      {
        content_ids: [wishlistData.productId],
        content_name: wishlistData.productName,
        content_type: "product",
        content_category: wishlistData.category,
        value: wishlistData.price,
        currency: "INR",
        contents: [
          {
            id: wishlistData.productId,
            quantity: 1,
            item_price: wishlistData.price,
          },
        ],
      },
      req,
      userInfo,
    )
  }

  // Track Initiate Checkout
  async trackInitiateCheckout(req, userInfo = {}, checkoutData = {}) {
    return await this.sendEvent(
      "InitiateCheckout",
      {
        content_ids: checkoutData.productIds || [],
        content_category: "jewelry",
        value: checkoutData.totalValue,
        currency: "INR",
        num_items: checkoutData.numItems,
        contents: checkoutData.contents || [],
      },
      req,
      userInfo,
    )
  }

  // Track Add Payment Info
  async trackAddPaymentInfo(req, userInfo = {}, paymentData = {}) {
    return await this.sendEvent(
      "AddPaymentInfo",
      {
        content_ids: paymentData.productIds || [],
        content_category: "jewelry",
        value: paymentData.totalValue,
        currency: "INR",
        payment_method: paymentData.paymentMethod,
      },
      req,
      userInfo,
    )
  }

  // Track Purchase
  async trackPurchase(req, userInfo = {}, purchaseData = {}) {
    return await this.sendEvent(
      "Purchase",
      {
        content_ids: purchaseData.productIds || [],
        content_type: "product",
        content_category: "jewelry",
        value: purchaseData.totalValue,
        currency: "INR",
        order_id: purchaseData.orderId,
        contents: purchaseData.contents || [],
        num_items: purchaseData.numItems,
      },
      req,
      userInfo,
    )
  }

  // Track Registration
  async trackCompleteRegistration(req, userInfo = {}, registrationData = {}) {
    return await this.sendEvent(
      "CompleteRegistration",
      {
        content_name: "Account Registration",
        status: registrationData.status || "completed",
        registration_method: registrationData.method || "email",
      },
      req,
      userInfo,
    )
  }

  // Track Lead (Newsletter, Contact Form)
  async trackLead(req, userInfo = {}, leadData = {}) {
    return await this.sendEvent(
      "Lead",
      {
        content_name: leadData.leadType || "Newsletter Signup",
        content_category: leadData.category || "engagement",
        value: leadData.value || 0,
        currency: "INR",
      },
      req,
      userInfo,
    )
  }

  // Track Contact
  async trackContact(req, userInfo = {}, contactData = {}) {
    return await this.sendEvent(
      "Contact",
      {
        content_name: "Contact Form Submission",
        content_category: "customer_service",
        contact_method: contactData.method || "form",
      },
      req,
      userInfo,
    )
  }

  // Track Subscribe (Newsletter)
  async trackSubscribe(req, userInfo = {}, subscribeData = {}) {
    return await this.sendEvent(
      "Subscribe",
      {
        content_name: "Newsletter Subscription",
        subscription_type: subscribeData.type || "newsletter",
        value: subscribeData.value || 0,
        currency: "INR",
      },
      req,
      userInfo,
    )
  }
}

export default new MetaConversionAPI()
