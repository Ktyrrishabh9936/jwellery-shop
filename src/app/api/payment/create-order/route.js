import { connect } from '@/dbConfig/dbConfig';
import Address from '@/models/addressModel';
import Cart from '@/models/cartModel';
import User from '@/models/userModel';
import { UserAuth } from '@/utils/userAuth';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req) {
  await connect();
  try {
    const {selectedDetails, firstName, lastName, contact, street, city, state, postalCode, landmark,isSaveAddress } = await req.json();
    const userId = await UserAuth();
    
    // Validate fields manually if Yup is not used
 
    // Find cart and ensure it exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User Exist' }, { status: 404 });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ message: 'Cart does not exist' }, { status: 404 });
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
    const amountInPaise = Math.round(total * 100);
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt#${Date.now()}`,
    };

    // Create Razorpay order

    const order = await razorpayInstance.orders.create(options);
    if(!selectedDetails){
      if ((!firstName || !lastName || !contact || !street || !city || !state || !postalCode)) {
        return NextResponse.json({ message: 'Given fields are required' }, { status: 400 });
      }

      let addressObj = {
        firstName,
        lastName,
        contact,
        street,
        city,
        state,
        postalCode,
        landmark,
      }
      if(!isSaveAddress){
        return NextResponse.json({ message: 'Order created successfully', order:order , address:addressObj,amount:total}, { status: 200 });
      }
      
  
      // Create and save new address
      let address = new Address({...addressObj,userId});
      user.addresses.push(address._id);
      await user.save();
      await address.save();
      return NextResponse.json({ message: 'Order created successfully', order:order , address:address,amount:total}, { status: 200 });
    }
    else{
      const address = await Address.findById(selectedDetails);
      if (!address) {
          return NextResponse.json({
              message: " Address Not Found"
          }, { status: 404 });
      }
      // Confirm successful order creation
      return NextResponse.json({ message: 'Order created successfully', order:order,address,amount:total}, { status: 200 });
    }
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Error creating Razorpay order', error: error.message }, { status: 500 });
  }
}
