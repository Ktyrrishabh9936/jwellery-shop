import { NextResponse } from 'next/server';
import crypto from 'crypto';
import Order from '@/models/orderModel';
import Cart from '@/models/cartModel';
import { UserAuth } from '@/utils/userAuth';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { createShiprocketOrder } from '@/utils/shipRocket';
import moment from 'moment';
export const generateOrderId = (length = 10) => {
  const timestamp = Date.now().toString(); // Current timestamp
  const randomDigits = Math.floor(Math.random() * Math.pow(10, length - timestamp.length))
    .toString()
    .padStart(length - timestamp.length, "0"); // Generate random digits to fill length
  return `${timestamp}${randomDigits}`.slice(0, length );
};
export async function POST(req) {
  await connect();
  try {
    const { paymentId, address, amount, orderId, signature,Items } = await req.json();
    const secret = process.env.RAZORPAY_SECRET; // Use environment variables for sensitive data
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest('hex');
    if (digest === signature) {
    const userId = await UserAuth(); // Assume userId is set in middleware
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    let order = await Order.findOne({ userId });
    if (!order) {
      order = new Order({ userId, orders: [] });
    }
    let order_items = [];
    const items = Items.map((item) => 
      {
        order_items.push(  {
          name: item.name,
          sku:  item.SKU,
          units: item.quantity || 1,
          selling_price: item.discountedPrice,
        })
        return {
        productId: item.productId,
        quantity: item.quantity|| 1,
        price:item.discountedPrice
      }})

       const JENII_ORDERID = generateOrderId()
            const shiprocket = await createShiprocketOrder({
              order_id: JENII_ORDERID,
              order_date: moment().format("YYYY-MM-DD HH:mm"),
              pickup_location: "Primary",
              billing_address: `${address.landmark} , ${address.street}`,
              billing_pincode: address.postalCode,
              billing_city: address.city,
              billing_state: address.state,
              billing_country: "India",
              billing_email: user.email,
              billing_phone: `91${address.contact}`,
              billing_customer_name: address.firstName,
              billing_last_name: address.lastName,
              shipping_is_billing: true,
              order_items,
              payment_method: "Prepaid",
              sub_total: amount,
              length: 10,
              breadth: 10,
              height: 10,
              weight: 0.5,
            });
      
            if(!shiprocket){
              return NextResponse.json({
                message: "Something went wrong with shiprocket "
            }, { status: 403 });
            }
      
    
    order.orders.push({
      items ,
      payment:{
        mode:"Prepaid",
        paymentId:paymentId,
        signature:signature,
        orderId:orderId,
      },
      customer:{
        name:`${address.firstName} ${address.lastName}`,
        email:user.email,
        contact:address.contact,
        address:`${address.landmark} ${address.street} ${address.city} ${address.state}`
      },
      orderStatus: "CONFIRMED",
      amount,
      orderID:JENII_ORDERID,
      shipping:{
        shipmentID:shiprocket.shipment_id,
        shippingOrderId:shiprocket.order_id
      }
    });
    await order.save();
    await Cart.findOneAndDelete({ userId }); // Clear the cart after placing the order
     user.cart = null;
     await user.save();
    return NextResponse.json(order, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: 'Error verifying payment' }, { status: 500 });
  }
}
