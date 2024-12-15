
import { NextResponse } from 'next/server';
import Order from '@/models/orderModel';
import Cart from '@/models/cartModel';
import { UserAuth } from '@/utils/userAuth';
import { connect } from '@/dbConfig/dbConfig';

export async function POST(request) {
  await connect();
  try {
    const { paymentId, address, amount, orderId, signature } = await request.json();
    const userId = await UserAuth(); // Assume userId is set in middleware

    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    let order = await Order.findOne({ userId });
    if (!order) {
      order = new Order({ userId, orders: [] });
    }

    order.orders.push({
      items: cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      paymentStatus: 'confirmed',
      paymentId,
      address,
      orderStatus: 'confirmed',
      amount,
      signature,
      orderId,
    });

    await order.save();
    await Cart.findOneAndDelete({ userId }); // Clear the cart after placing the order

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  await connect();
  try {
    const userId = await UserAuth(); // Assume userId is set in middleware
    
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: 'No orders found' }, { status: 404 });
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
