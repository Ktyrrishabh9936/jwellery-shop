import { NextResponse } from 'next/server';
import Order from '@/models/orderModel';
import { connect } from '@/dbConfig/dbConfig';
import { UserAuth } from '@/utils/userAuth';
import CancelOrder from '@/models/cancelOrderModel';

export async function POST(request, { params }) {
    await connect();
    try {
      
        const user = await UserAuth(request);
        console.log("User Id", user)
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { orderId } = await params;
        const { reason, upiId } = await request.json();

      
        const orderItem = await Order.findOneAndUpdate(
            { "orders.orderID": orderId },
            { $set: { "orders.$.orderStatus": "Canceled" } },
            { new: true } 
        );

        if (!orderItem) {
            return NextResponse.json({ message: "Order not found" });
        }

      
        const order = orderItem.orders.find(o => o.orderID === orderId);
        if (!order) {
            return NextResponse.json({ message: "Order details not found" });
        }

        console.log(order.orderID);
        const isAlreadyExist = await CancelOrder.findOne({ orderId: orderId });

        console.log(isAlreadyExist);

        if (isAlreadyExist) {
            return NextResponse.json({ message: "Already Exist" });
        }

        console.log("Id", user.id);

        const cancelOrderData = {
            userId: user,
            orderId: orderId,
            items: order.items.map(item => ({
                productId: item.productId,
                price: item.price,
                quantity: item.quantity,
            })),
            payment: {
                mode: order.payment.mode,
                paymentId: order.payment.paymentId,
                orderId: order.payment.orderId,
                signature: order.payment.signature,
            },
            shipping: {
                shipmentID: order.shipping.shipmentID,
                shippingOrderId: order.shipping.shippingOrderId,
            },
            cancelReason: reason,
            refundAmount: order.amount,
            refundTo: upiId,
        };

        const cancelOrder = await CancelOrder.create(cancelOrderData);

        return NextResponse.json({ message: "Order cancellation recorded", cancelOrder });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
