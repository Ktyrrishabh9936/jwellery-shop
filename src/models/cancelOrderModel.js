import mongoose from 'mongoose';

const CancelOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // type:String,
    required: true,
  },
  orderId: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Order',
    type:String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      productName: {
        type: String,
        // required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  payment: {
    mode: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
    }
  },
  shipping: {
    shipmentID: {
      type: String,
      required: true,
    },
    shippingOrderId: {
      type: String,
      required: true,
    },
  },
  cancelReason: {
    //reason
    type: String,
    required: true,
  },
  canceledAt: {
    type: Date,
    default: Date.now,
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: 'pending',
  },
  refundAmount: {
    //amount
    type: Number,
    required: true,
  },
  refundTo: {
    // UPI
    type: String,
    required: true,
  },
  adminRemarks: {
    type: String,
  },
});

const CancelOrder =mongoose.models.CancelOrder || mongoose.model('CancelOrder', CancelOrderSchema);

module.exports = CancelOrder;
