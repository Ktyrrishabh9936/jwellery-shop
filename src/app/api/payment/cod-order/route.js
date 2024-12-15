import { NextResponse } from 'next/server';
import Order from '@/models/orderModel';
import { connect } from '@/dbConfig/dbConfig';
import Address from '@/models/addressModel';
import Cart from '@/models/cartModel';
import User from '@/models/userModel';
import { UserAuth } from '@/utils/userAuth';
import { NextResponse } from 'next/server';

export const generateOrderId = (prefix = "ID", length = 10) => {
  const timestamp = Date.now().toString(); // Current timestamp
  const randomDigits = Math.floor(Math.random() * Math.pow(10, length - timestamp.length))
    .toString()
    .padStart(length - timestamp.length, "0"); // Generate random digits to fill length
  return `${prefix}${timestamp}${randomDigits}`.slice(0, length + prefix.length);
};
export async function POST(req) {
  await connect();
  try {
    const {selectedDetails, firstName, lastName, contact, street, city, state, postalCode, landmark,isSaveAddress } = await req.json();
    const userId = await UserAuth(); // Assume userId is set in middleware
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }
    const total = cart.items.reduce((acc, item) => {
        const price = item.discountedPrice; // Optional chaining
        const quantity = item.quantity || 1; // Default to 1 if quantity is not defined
  
        // Log for debugging
        console.log(`Item ID: ${item._id}, Price: ${price}, Quantity: ${quantity}`);
  
        if (typeof price !== 'number' || isNaN(price)) {
          return NextResponse.json({ message: 'Price is not a valid type' }, { status: 403 });
        }
  
        return acc + price * quantity; // Calculate total
      }, 0);
      console.log(total)
      // Set up Razorpay order details
      let address;
      if(!selectedDetails){
        if ((!firstName || !lastName || !contact || !street || !city || !state || !postalCode)) {
          return NextResponse.json({ message: 'Given fields are required' }, { status: 400 });
        }
  
         address = {
          firstName,
          lastName,
          contact,
          street,
          city,
          state,
          postalCode,
          landmark,
        }
        if(isSaveAddress){
                 const  newadd = new Address({...address,userId});
                user.addresses.push(newadd._id);
                await user.save();
                await newadd.save();
        }
}
      else{
         address = await Address.findById(selectedDetails);
        if (!address) {
            return NextResponse.json({
                message: " Address Not Found"
            }, { status: 404 });
        }
      

    let order = await Order.findOne({ userId });
    if (!order) {
      order = new Order({ userId, orders: [] });
    }
    order.orders.push({
      items: cart.items.map((item) => 
      {
        console.log(item)
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
        contact:address.contact,
        address:`${address.landmark} ${address.street} ${address.city} ${address.state}`
      },
      orderStatus: "CONFIRMED",
      amount,
      orderID:generateOrderId()
    });
    await order.save();
    await Cart.findOneAndDelete({ userId }); // Clear the cart after placing the order
     user.cart = null;
     await user.save();
    return NextResponse.json(order, { status: 201 });
    
  }
} catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ message: 'Error verifying payment' }, { status: 500 });
  }
}
