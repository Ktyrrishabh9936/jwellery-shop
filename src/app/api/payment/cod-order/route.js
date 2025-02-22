import { NextResponse } from 'next/server';
import Order from '@/models/orderModel';
import { connect } from '@/dbConfig/dbConfig';
import Address from '@/models/addressModel';
import Cart from '@/models/cartModel';
import User from '@/models/userModel';
import { UserAuth } from '@/utils/userAuth';
import { createShiprocketOrder } from '@/utils/shipRocket';
import moment from 'moment';
import couponModel from '@/models/couponModel';


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
    const {Items,address,userId,couponCode } = await req.json();
    console.log(address)
    let Id;
    if(!userId) {
     Id = await UserAuth();
  }else{
    Id = userId;
  }
    const user = await User.findById(Id);
    if (!user) {
      return NextResponse.json({ message: 'Invaild user' }, { status: 404 });
    }
    let order_items = [];
    let total = Items.reduce((acc, item) => {
        const price = item.discountedPrice; // Optional chaining
        const quantity = item.quantity || 1; // Default to 1 if quantity is not defined
        order_items.push(  {
          name: item.name,
          sku:  item.SKU,
          units: item.quantity || 1,
          selling_price: item.discountedPrice,
        })
  
        if (typeof price !== 'number' || isNaN(price)) {
          return NextResponse.json({ message: 'Price is not a valid type' }, { status: 403 });
        }
  
        return acc + price * quantity; // Calculate total
      }, 0);
      let coupon;
      if(couponCode){
         coupon = await couponModel.findOne({ code: couponCode });
        if (coupon) {
            if (coupon.minimumOrderValue > total) {
              return NextResponse.json({ message: `Minimum order amount is ${coupon.minOrderAmount}` }, { status: 403 });
            }
            if (coupon.discountType === 'percentage') {
              total -= (total * coupon.discountValue) / 100;
            } else if (coupon.discountType === 'fixed') {
              total -= coupon.discountValue;
            }
            coupon.usedCount++;
          }
        }
            console.log(total)
      
      
      const JENII_ORDERID = generateOrderId()
      const shiprocket = await createShiprocketOrder({
        order_id: JENII_ORDERID,
        order_date: moment().format("YYYY-MM-DD HH:mm"),
        pickup_location: "Primary",
        billing_address: address.addressline1,
        billing_address_2:address.addressline2,
        billing_pincode: address.postalCode,
        billing_isd_code:address.countryCode,
        billing_city: address.city.label,
        billing_state: address.state.label,
        billing_country:address.country.value,
        billing_email:user.email,
        billing_phone: `91${address.contact}`,
        billing_customer_name: address.firstName,
        billing_last_name: address.lastName,
        shipping_is_billing: true,
        order_items,
        payment_method: "COD",
        sub_total: total,
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
      });

      if(!shiprocket.shipment_id || !shiprocket.order_id){
        return NextResponse.json({
          message: "Something went wrong with shiprocket "
      }, { status: 403 });
      }

    let order = await Order.findOne({ userId:Id });
    if (!order) {
      order = new Order({ userId:Id, orders: [] });
    }
    order.orders.push({
      items: Items.map((item) => 
      {
        return {
        productId: item.productId,
        quantity: item.quantity,
        price:item.discountedPrice
      }}),

      payment:{
        mode:"COD",
      },
      customer:{
        name:`${address.firstName} ${address.lastName}`,
        email:user.email,
        contact:address.countryCode+address.contact,
        address:`${address.addressline1} ${address.addressline1} `,
        city:address.city.label,
        state:address.state.label,
        country:address.country.label,
        pincode:address.postalCode
      },
      orderStatus: "CONFIRMED",
      amount:total,
      orderID:JENII_ORDERID,
      shipping:{
        shipmentID:shiprocket.shipment_id,
        shippingOrderId:shiprocket.order_id,
      }
    });
    if(couponCode) await coupon.save();
    await order.save();
    
    // await Cart.findOneAndDelete({ userId }); // Clear the cart after placing the order
    return NextResponse.json({order,shiprocket}, { status: 201 });

} catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: 'Error verifying payment',error:error }, { status: 500 });
  }
}
