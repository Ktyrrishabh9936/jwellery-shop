import { connect } from "@/dbConfig/dbConfig"
import couponModel from "@/models/couponModel"
import User from "@/models/userModel"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import Product from "@/models/productModel"
import { UserAuth } from "@/utils/userAuth"
import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { v4 as uuidv4 } from "uuid"
import { getShippingRates } from "@/utils/shipRocket"

// Initialize Razorpay with environment variables
const razorpayInstance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
})

// Helper function to calculate estimated delivery date
export const calculateEstimatedDelivery = (days = 5) => {
  const date = new Date()
  date.setDate(date.getDate() + parseInt(days))
  return date
}

// Generate a unique order number
export const generateOrderNumber = () => {
  return `JENII-${Date.now().toString().substring(7)}${Math.floor(Math.random() * 1000)}`
}

export async function POST(req) {
  await connect()
  try {
    const {
      userId,
      Items,
      couponCode,
      deliveryOption,
      shippingAddress: address,
      billingAddress,
      useSameForBilling,
      selectedCourier,
    } = await req.json()

    // Validate request data
    if (!Items || !Array.isArray(Items) || Items.length === 0) {
      return NextResponse.json({ message: "Invalid or empty items list" }, { status: 400 })
    }

    if (!address) {
      return NextResponse.json({ message: "Shipping address is required" }, { status: 400 })
    }

    // Get user ID either from request or auth token
    let Id
    if (!userId) {
      Id = await UserAuth()
    } else {
      Id = userId
    }

    // Verify user exists
    const user = await User.findById(Id)
    if (!user) {
      return NextResponse.json({ message: "Invalid user" }, { status: 404 })
    }

    // Verify product availability and calculate total price
    let subtotal = 0
    let totalWeight = 0
    const orderItemsData = []

    for (const item of Items) {
      // Verify product exists and has sufficient stock
      const product = await Product.findById(item.productId)
      if (!product) {
        return NextResponse.json({ message: `Product not found: ${item.productId}` }, { status: 404 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          },
          { status: 400 },
        )
      }

      const itemPrice = item.discountedPrice
      const quantity = item.quantity || 1
      const weight = product.weight || 0.1 // Default weight per item in kg

      if (typeof itemPrice !== "number" || isNaN(itemPrice)) {
        return NextResponse.json({ message: "Price is not a valid type" }, { status: 400 })
      }

      const itemTotal = itemPrice * quantity
      subtotal += itemTotal
      totalWeight += weight * quantity

      // Create order item data
      orderItemsData.push({
        productId: item.productId,
        quantity: quantity,
        basePrice: product.price || itemPrice,
        discountedPrice: itemPrice,
        totalPrice: itemTotal,
        name: product.name,
        sku: product.SKU || `SKU-${product._id.toString().substring(0, 8)}`,
        image: item.img_src || product.images[0],
      })
    }

    // Get shipping rates from Shiprocket if not provided
    let shippingDetails = null
    let deliveryCharge = 0

    if (selectedCourier) {
      // Use the selected courier details
      shippingDetails = {
        courier: {
          id: selectedCourier.courier_id,
          name: selectedCourier.courier_name,
          etd: selectedCourier.etd,
          rate: selectedCourier.rate,
          cod: selectedCourier.cod,
        },
        deliveryOption: deliveryOption || "standard",
      }
      deliveryCharge = selectedCourier.rate
    } else {
      // Get shipping rates dynamically
      try {
        const shippingRates = await getShippingRates({
          pickup_pincode: process.env.SHIPROCKET_PICKUP_PINCODE || "391410",
          delivery_pincode: address.postalCode,
          weight: totalWeight || 0.5,
          cod: 0, // For prepaid orders
        })

        if (!shippingRates.serviceability) {
          return NextResponse.json({ message: "Delivery not available to this pincode" }, { status: 400 })
        }

        // Select courier based on delivery option
        const courier = deliveryOption === "express" ? shippingRates.express : shippingRates.standard

        if (!courier) {
          return NextResponse.json(
            {
              message: `${deliveryOption} delivery not available to this pincode`,
            },
            { status: 400 },
          )
        }

        shippingDetails = {
          courier: {
            id: courier.courier_id,
            name: courier.courier_name,
            etd: courier.etd,
            rate: courier.rate,
            cod: courier.cod,
          },
          deliveryOption: deliveryOption || "standard",
        }

        deliveryCharge = courier.rate
      } catch (error) {
        console.error("Error getting shipping rates:", error)
        return NextResponse.json(
          {
            message: "Failed to calculate shipping rates",
            error: error.message,
          },
          { status: 500 },
        )
      }
    }

    // Apply coupon if provided
    let appliedCoupon = null
    let discountAmount = 0

    if (couponCode) {
      const coupon = await couponModel.findOne({ code: couponCode })
      if (coupon) {
        // Validate minimum order value
        if (coupon.minimumOrderValue > subtotal) {
          return NextResponse.json({ message: `Minimum order amount is ${coupon.minimumOrderValue}` }, { status: 403 })
        }

        // Apply discount
        if (coupon.discountType === "percentage") {
          discountAmount = (subtotal * coupon.discountValue) / 100
          appliedCoupon = {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: discountAmount,
          }
        } else if (coupon.discountType === "fixed") {
          discountAmount = coupon.discountValue
          appliedCoupon = {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount: discountAmount,
          }
        }
      }
    }

    // Calculate total with shipping and discount
    const total = subtotal + deliveryCharge - discountAmount

    // Generate unique order number
    const orderNumber = generateOrderNumber()

    // Create Razorpay order
    const amountInPaise = Math.round(total * 100)
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${uuidv4().substring(0, 8)}`,
      notes: {
        userId: Id,
        orderNumber: orderNumber,
        deliveryOption: deliveryOption || "standard",
        couponCode: couponCode || "none",
        shippingCourier: shippingDetails?.courier?.name || "standard",
      },
    }

    const razorpayOrder = await razorpayInstance.orders.create(options)
    // Format the shipping address according to the order model
    const shippingAddress = {
      name: user ? address.name : address.shippingAddress?.name,
      ...(address.lastname?.trim() && {
        lastname: address.lastname,
      }),
      email: user ? user.email : address.shippingAddress?.email,
      contact: user ? address.contact : address.shippingAddress?.contact,
      address: user ? address.address : address.shippingAddress?.address,
      ...(address.addressline2?.trim() && {
        addressline2: address.addressline2,
      }),
      state: user ? address.state : address.shippingAddress?.state,
      city: user ? address.city : address.shippingAddress?.city,
      pincode: user ? address.pincode : address.shippingAddress?.pincode,
      country: user ? address.country : address.shippingAddress?.country,
    }

    // Create billing address if needed
    const finalBillingAddress = useSameForBilling ? undefined : billingAddress
      ? {
          name: billingAddress.name,
          ...(billingAddress.lastname?.trim() && {
            lastname: billingAddress.lastname,
          }),
          contact:  billingAddress.contact,
          address: billingAddress.address,
          ...(billingAddress.addressline2?.trim() && {
            addressline2: billingAddress.addressline2,
          }),
          city: billingAddress.city,
          state: billingAddress.state,
          country: billingAddress.country,
          pincode: billingAddress.pincode,
        }
      : undefined

    // Create the order
    const newOrder = new Order({
      userId: Id,
      orderNumber: orderNumber,
      items: [], // Will be populated after creating order items
      payment: {
        mode: "Prepaid",
        // paymentId will be added after payment verification
      },
      subtotal: subtotal,
      shippingCost: deliveryCharge,
      discount: discountAmount,
      totalAmount: total,
      orderStatus: "PENDING",
      shippingAddress: shippingAddress,
      billingAddress: finalBillingAddress,
      shipping: {
        deliveryOption: deliveryOption || "standard",
        courier: {
          id: shippingDetails?.courier?.id,
          name: shippingDetails?.courier?.name,
          etd: shippingDetails?.courier?.etd,
          rate: shippingDetails?.courier?.rate,
        },
        estimatedDelivery: calculateEstimatedDelivery(shippingDetails?.courier?.etd),
      },
      coupon: appliedCoupon,
    })

    // Save the order first to get its ID
    await newOrder.save()

    // Create and save order items with reference to the order
    const orderItemsPromises = orderItemsData.map(async (itemData) => {
      const orderItem = new OrderItem({
        orderId: newOrder._id,
        orderNumber: orderNumber,
        ...itemData,
      })
      await orderItem.save()
      return orderItem._id
    })

    // Wait for all order items to be created
    const orderItemIds = await Promise.all(orderItemsPromises)

    // Update the order with the order item IDs
    newOrder.items = orderItemIds
    await newOrder.save()

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: razorpayOrder,
        amount: total,
        orderNumber: orderNumber,
        orderID: newOrder._id,
        shipping: {
          charge: deliveryCharge,
          courier: shippingDetails?.courier?.name,
          estimatedDelivery: calculateEstimatedDelivery(shippingDetails?.courier?.etd),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      {
        message: "Error creating Razorpay order",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
