// src/app/api/orders/update/[orderId]/route.js
import { NextResponse } from 'next/server';
import Order from '@/models/orderModel';
import { connect } from '@/dbConfig/dbConfig';
import { UserAuth } from '@/utils/userAuth';
export async function PATCH(request, { params }) {
  await connect();
  try {
    const { orderId } = await params;
    const { status } = await request.json();

    const updatedOrder = await Order.findOneAndUpdate(
      { 'orders._id': orderId },
      { $set: { 'orders.$.orderStatus': status } },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


export async function GET(request, { params }) {
  await connect();
  try {
    const { orderId } = await params;
    const userId = await UserAuth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const orders = await Order.find({ userId }).populate("orders.items.productId");

    if (!orders || orders.length === 0) {
      return NextResponse.json({ message: 'No orders found' }, { status: 404 });
    }

    let Matchedorder;
    orders.forEach((order) => {
      const matchingOrder = order.orders.find((ord) => ord.orderID === orderId);
      if (matchingOrder) {
        Matchedorder = matchingOrder;
      }
    });

    if (Matchedorder.items.length === 0) {
      return NextResponse.json({ message: 'No items found for the specified order ID' }, { status: 404 });
    }

    

    return NextResponse.json({ order:Matchedorder}, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
