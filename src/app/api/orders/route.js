
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

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.findOne({ userId });

    if (!orders) {
      return NextResponse.json({ message: 'No orders found' }, { status: 404 });
    }
    const totalOrders = orders.orders.length;

    if (!totalOrders || totalOrders.length === 0) {
      return NextResponse.json({ message: 'No orders found' }, { status: 404 });
    }

    const orderPage = orders.orders.slice(skip, skip + limit);
    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({ orders:orderPage, currentPage: page, totalPages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
