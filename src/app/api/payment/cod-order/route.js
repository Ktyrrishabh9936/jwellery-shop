import { NextResponse } from "next/server"
import Order from "@/models/orderModel"
import OrderItem from "@/models/orderItemModel"
import Product from "@/models/productModel"
import Cart from "@/models/cartModel"
import { UserAuth } from "@/utils/userAuth"
import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel"
import { createShipment } from "@/utils/shipRocket"
import moment from "moment"
import couponModel from "@/models/couponModel"
import { sendEmail, generateOrderConfirmationEmail } from "@/utils/sendMail"
import { getShippingRates } from "@/utils/shipRocket"

// COD fee constant
const COD_FEE = 50 // ₹50 COD handling fee

// Generate a unique order number for COD orders
export const generateOrderNumber = () => {
  return `JENII-COD-${Date.now().toString().substring(7)}${Math.floor(Math.random() * 1000)}`
}

// Helper function to calculate estimated delivery date
export const calculateEstimatedDelivery = (days = 5) => {
  const date = new Date()
  date.setDate(date.getDate() + Number.parseInt(days))
  return date
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
        name: item.name,
        sku: item.SKU || `SKU-${product._id.toString().substring(0, 8)}`,
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
          cod: true, // Force COD to true for COD orders
        },
        deliveryOption: deliveryOption || "standard",
      }
      deliveryCharge = selectedCourier.rate
    } else {
      // Get shipping rates dynamically
      try {
        const shippingRates = await getShippingRates({
          pickup_pincode: process.env.SHIPROCKET_PICKUP_PINCODE || "391410",
          delivery_pincode: address.pincode,
          weight: totalWeight || 0.5,
          cod: 1, // For COD orders, set cod flag to 1
          order_value: subtotal,
        })

        if (!shippingRates.serviceability) {
          return NextResponse.json({ message: "COD delivery not available to this pincode" }, { status: 400 })
        }

        // Select courier based on delivery option
        const courier = deliveryOption === "express" ? shippingRates.express : shippingRates.standard

        if (!courier) {
          return NextResponse.json(
            {
              message: `${deliveryOption} COD delivery not available to this pincode`,
            },
            { status: 400 },
          )
        }

        // Check if courier supports COD
        if (!courier.cod) {
          return NextResponse.json(
            {
              message: "Selected courier does not support COD for this pincode",
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
            message: "Failed to calculate shipping rates for COD",
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
        // Check if coupon is valid for COD orders
        if (coupon.excludeCOD) {
          return NextResponse.json({ message: "This coupon cannot be used with COD orders" }, { status: 403 })
        }

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

        // Update coupon usage
        coupon.usedCount++
        await coupon.save()
      }
    }

   

    // Calculate total with shipping, discount, and COD fee
    const total = subtotal + deliveryCharge - discountAmount

    // Generate unique order number
    const orderNumber = generateOrderNumber()

    // Format the shipping address according to the order model
    const shippingAddress = {
      name: address.name,
      ...(address.lastname?.trim() && {
        lastname: address.lastname,
      }),
      email: user.email,
      contact: address.contact,
      address: address.address,
      ...(address.addressline2?.trim() && {
        addressline2: address.addressline2,
      }),
      state: address.state,
      city: address.city,
      pincode: address.pincode,
      country: address.country,
    }

    // Create billing address if needed
    const finalBillingAddress = useSameForBilling
      ? undefined
      : billingAddress
        ? {
            name: billingAddress.name,
            ...(billingAddress.lastname?.trim() && {
              lastname: billingAddress.lastname,
            }),
            contact: billingAddress.contact,
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
        mode: "COD",
        // No paymentId for COD orders
      },
      subtotal: subtotal,
      shippingCost: deliveryCharge,
      discount: discountAmount,
      totalAmount: total,
      orderStatus: "CONFIRMED", // COD orders are confirmed immediately
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
        status: "CONFIRMED", // COD order items are confirmed immediately
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

    // Create Shiprocket order
    const shiprocketData = {
      order_id: orderNumber,
      order_date: moment().format("YYYY-MM-DD HH:mm"),
      pickup_location: "Primary",
      billing_address: shippingAddress.address,
      billing_address_2: shippingAddress.addressline2,
      billing_pincode: shippingAddress.pincode,
      billing_city: shippingAddress.city,
      billing_state: shippingAddress.state,
      billing_country: shippingAddress.country,
      billing_email: shippingAddress.email,
      billing_phone: shippingAddress.contact,
      billing_customer_name: shippingAddress.name,
      billing_last_name: shippingAddress.lastname,
      shipping_is_billing: useSameForBilling ? true : false,
      shipping_address: finalBillingAddress ? finalBillingAddress.address : shippingAddress.address,
      shipping_address_2: finalBillingAddress ? finalBillingAddress.addressline2 : shippingAddress.addressline2,
      shipping_pincode: finalBillingAddress ? finalBillingAddress.pincode : shippingAddress.pincode,
      shipping_city: finalBillingAddress ? finalBillingAddress.city : shippingAddress.city,
      shipping_state: finalBillingAddress ? finalBillingAddress.state : shippingAddress.state,
      shipping_country: finalBillingAddress ? finalBillingAddress.country : shippingAddress.country,
      shipping_email: user.email,
      shipping_phone: finalBillingAddress ? finalBillingAddress.contact : shippingAddress.contact,
      shipping_customer_name: finalBillingAddress ? finalBillingAddress.name : shippingAddress.name,
      shipping_last_name: finalBillingAddress ? finalBillingAddress.lastname : shippingAddress.lastname,
      order_items: orderItemsData.map((item) => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.discountedPrice,
      })),
      payment_method: "COD", // Set payment method to COD
      sub_total: total, // Include COD fee in the total
      length: 10,
      breadth: 10,
      height: 10,
      weight: totalWeight || 0.5,
    }

    // Add courier_id if a specific courier is selected
    if (selectedCourier && selectedCourier.courier_id) {
      shiprocketData.courier_id = selectedCourier.courier_id
    }

    const shiprocket = await createShipment(shiprocketData)

    if (!shiprocket || !shiprocket.shipment_id) {
      // If shipment creation fails, mark order as pending and notify admin
      newOrder.orderStatus = "PENDING"
      newOrder.adminNote = "Shiprocket shipment creation failed. Manual intervention required."
      await newOrder.save()

      return NextResponse.json(
        {
          message: "Order created but shipment creation failed. Our team will process it manually.",
          order: {
            id: newOrder._id,
            orderNumber: orderNumber,
            status: "PENDING",
            items: orderItemsData.length,
            amount: total,
          },
        },
        { status: 200 },
      )
    }

    // Generate tracking URL
    const trackingUrl = generateTrackingUrl(shiprocket.shipment_id, shiprocket.awb)

    // Update shipping details
    newOrder.shipping.shipmentID = shiprocket.shipment_id
    newOrder.shipping.shippingOrderId = shiprocket.order_id
    newOrder.shipping.awb = shiprocket.awb
    newOrder.shipping.trackingUrl = trackingUrl
    await newOrder.save()

    // Update product stock
    for (const item of orderItemsData) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } })
    }

    // Delete cart after successful order
    await Cart.findOneAndDelete({ userId: Id })

    // Generate enhanced email template
    const emailHtml = generateOrderConfirmationEmail(newOrder, orderItemsData, trackingUrl)

    // Send confirmation email with tracking information
    const mail = await sendEmail(user.email, `JENII - Your COD Order #${orderNumber} is Confirmed`, emailHtml)

    // Send notification to admin about new COD order
    const adminNotificationHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #BC264B;">New COD Order Received</h2>
        <p>A new COD order has been placed and requires attention.</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Customer:</strong> ${shippingAddress.name}</p>
        <p><strong>Amount:</strong> ₹${total.toFixed(2)}</p>
        <p><strong>Items:</strong> ${orderItemsData.length}</p>
        <p>Please review this order in the admin dashboard.</p>
        <p>This is an automated notification.</p>
      </div>
    `

    await sendEmail(process.env.ADMIN_EMAIL, `[JENII] New COD Order #${orderNumber}`, adminNotificationHtml)

    return NextResponse.json(
      {
        success: true,
        message: "COD order created successfully",
        order: {
          id: newOrder._id,
          orderNumber: orderNumber,
          status: "CONFIRMED",
          items: orderItemsData.length,
          amount: total,
          shipping: {
            courier: shippingDetails?.courier?.name || "Standard",
            estimatedDelivery: newOrder.shipping.estimatedDelivery,
            trackingUrl: trackingUrl,
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating COD order:", error)
    return NextResponse.json({ message: "Error creating COD order", error: error.message }, { status: 500 })
  }
}
