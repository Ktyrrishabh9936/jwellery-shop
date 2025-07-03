import { NextResponse } from "next/server"
import crypto from "crypto"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import Product from "@/models/productModel"
import Cart from "@/models/cartModel"
import Payment from "@/models/paymentModel"
import { UserAuth } from "@/utils/userAuth"
import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { createShipment } from "@/utils/shipRocket"
import moment from "moment"
import { sendEmail, generateOrderConfirmationEmail } from "@/utils/sendMail"
import Razorpay from "razorpay"
// import { trackPurchase } from "@/utils/metaEventHelpers"
import couponModel from "@/models/couponModel"

// Helper function to extract payment method details
const getPaymentVia = (method, payload) => {
  if (method === "netbanking") return payload["bank"]
  else if (method === "wallet") return payload["wallet"]
  else if (method === "upi") return payload["vpa"]
  else if (method === "card") {
    return payload["card"].last4 + "," + payload["card"].network
  } else return null
}

// Helper function to generate tracking URL
const generateTrackingUrl = (shipmentId, awb) => {
  if (awb) {
    return `https://shiprocket.co/tracking/${awb}`
  } else if (shipmentId) {
    return `https://shiprocket.co/tracking/shipment/${shipmentId}`
  }
  return null
}

export async function POST(req) {
  await connect()
  try {
    const {
      userId,
      paymentId,
      orderId,
      signature,
      amount,
      useSameForBilling,
      orderNumber,
      selectedCourier,
      couponCode
    } = await req.json()

    // Verify Razorpay signature
    const secret = process.env.RAZORPAY_SECRET
    const shasum = crypto.createHmac("sha256", secret)
    shasum.update(`${orderId}|${paymentId}`)
    const digest = shasum.digest("hex")
    // console.log("okay1")
    if (digest !== signature) {
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 })
    }
    // console.log("okay2")

    // Get user ID either from request or auth token
    let Id
    if (!userId) {
      Id = await UserAuth()
    } else {
      Id = userId
    }
    // console.log("okay3",Id)

    // Verify user exists
    const user = await User.findById(Id)
    if (!user) {
      return NextResponse.json({ message: "Invalid user" }, { status: 404 })
    }
    // console.log("okay4",orderNumber)

    // Find the order
    const order = await Order.findOne({ orderNumber }).populate("items")
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // console.log("okay5")

    // Get payment details from Razorpay
    let paymentMethod = "Razorpay"
    let paymentVia = "Online"

    try {
      const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      })

      const payloadEntity = await razorpay.payments.fetch(paymentId)

      paymentMethod =
        payloadEntity.method === "card" ? (payloadEntity["card"]?.type ?? "unknown") + " card" : payloadEntity.method

      paymentVia = getPaymentVia(payloadEntity.method, payloadEntity)
      console.log("okay6")
    } catch (error) {
      console.error("Error fetching payment details:", error)
      // Continue with default values if fetch fails
    }

    // Create payment record
    const payment = new Payment({
      orderId: order._id,
      orderNumber: order.orderNumber,
      rzr_order_id: orderId,
      rzr_payment_id: paymentId,
      signature: signature,
      amount: amount,
      method: paymentMethod,
      via: paymentVia,
      status: "SUCCESS",
    })

    await payment.save()

    // console.log("okay7",Object.keys(order.billingAddress ||{}).length)

    // Create Shiprocket order
    
    const shiprocketData = {
      order_id: order.orderNumber,
      order_date: moment().format("YYYY-MM-DD HH:mm"),
      pickup_location: "Primary",
      billing_address: order.shippingAddress.address,
      billing_address_2: order.shippingAddress.addressline2,

      billing_pincode: order.shippingAddress.pincode,
      billing_city: order.shippingAddress.city,
      billing_state: order.shippingAddress.state,
      billing_country: order.shippingAddress.country,
      billing_email: order.shippingAddress.email,
      billing_phone: order.shippingAddress.contact,
      billing_customer_name: order.shippingAddress.name,
      billing_last_name:order.shippingAddress.lastname,
      shipping_is_billing: useSameForBilling ? true : false      ,
      shipping_address: order.billingAddress ? order.billingAddress.address : order.shippingAddress.address,
      shipping_address_2: order.billingAddress ? order.billingAddress.addressline2 : order.shippingAddress.addressline2,
      shipping_pincode: order.billingAddress ? order.billingAddress.pincode : order.shippingAddress.pincode,
      shipping_city: order.billingAddress ? order.billingAddress.city : order.shippingAddress.city,
      shipping_state: order.billingAddress ? order.billingAddress.state : order.shippingAddress.state,
      shipping_country: order.billingAddress ? order.billingAddress.country : order.shippingAddress.country,
      shipping_email: order.billingAddress ? order.billingAddress.email : order.shippingAddress.email,
      shipping_phone: order.billingAddress ? order.billingAddress.contact : order.shippingAddress.contact,
      shipping_customer_name: order.billingAddress ? order.billingAddress.name : order.shippingAddress.name,
      shipping_last_name:order.billingAddress ? order.billingAddress.lastname : order.shippingAddress.lastname,
      order_items: order.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.discountedPrice,
      })),
      payment_method: "Prepaid",
      sub_total: order.totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    }
    // console.log(shiprocketData)

    // Add courier_id if a specific courier is selected
    if (selectedCourier && selectedCourier.courier_id) {
      shiprocketData.courier_id = selectedCourier.courier_id
    }

    // console.log("okay8")


    const shiprocket = await createShipment(shiprocketData)


    if (!shiprocket || !shiprocket.shipment_id) {
      return NextResponse.json(
        {
          message: "Something went wrong with shiprocket",
          error: shiprocket,
        },
        { status: 403 },
      )
    }
    // console.log("okay9")

    // Generate tracking URL
    const trackingUrl = generateTrackingUrl(shiprocket.shipment_id, shiprocket.awb)

    // Update the order with payment and shipping details
    order.payment.paymentId = payment._id
    order.orderStatus = "CONFIRMED"
    order.shipping.shipmentID = shiprocket.shipment_id
    order.shipping.shippingOrderId = shiprocket.order_id
    order.shipping.awb = shiprocket.awb
    order.shipping.trackingUrl = trackingUrl

    await order.save()

    // Update all order items status
    await OrderItem.updateMany({ orderId: order._id }, { $set: { status: "CONFIRMED" } })

    // console.log("okay10")

    // Update product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
    }

    // Delete cart after successful order
    await Cart.findOneAndDelete({ userId: Id })

    // Generate enhanced email template
    const emailHtml = generateOrderConfirmationEmail(order, order.items, trackingUrl)
    // console.log("okay11")

    // Send confirmation email with tracking information
    const mail = await sendEmail(
      order.shippingAddress.email,
      `JENII - Your Order #${order.orderNumber} is Confirmed`,
      emailHtml,
    )
    // console.log("okay12")
    // try {
    //   await trackPurchase(req, user, order)
    // } catch (metaError) {
    //   console.error("Meta tracking error:", metaError)
    //   // Don't fail the order if Meta tracking fails
    // }


    
    if (couponCode) {
      const coupon = await couponModel.findOne({ code: couponCode })
      if (coupon) {
        // Update coupon usage
        coupon.usedCount++
        await coupon.save()
      }
    }


    return NextResponse.json(
      {
        success: true,
        message: "Payment verified and order confirmed",
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: "CONFIRMED",
          items: order.items.length,
          amount: order.totalAmount,
          paymentMethod,
          paymentVia,
          shipping: {
            courier: order.shipping.courier.name || "Standard",
            estimatedDelivery: order.shipping.estimatedDelivery,
            trackingUrl: trackingUrl,
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.log("Error verifying payment:", error)
    return NextResponse.json({ message: "Error verifying payment", error: error.message }, { status: 500 })
  }
}
