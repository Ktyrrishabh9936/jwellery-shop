import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orders: [
    {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          quantity: { type: Number,
          required: true},
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      payment:{
        mode:{
          type:String,
          enum:["Prepaid","COD"],
        },
      paymentId: String,
      signature: String,
      orderId: String,
      },
      amount: {
        type:Number,
        required:true,
      },
      orderStatus: {
        type:String,
        required:true,
        default:"PENDING"
      },
      orderID: {
        type:String,
        required:true,
      },
      customer: {
        name:{
          type:String,
          required:true,
        },
        email:{
          type:String,
          required:true,
        },
        contact:{
          type:String,
          required:true,
        },
        address:{
          type:String,
          required:true,
        },
        state:{
          type:String,
          required:true,
        },
        city:{
          type:String,
          required:true,
        },
        pincode:{
          type:String,
          required:true,
        },
      },
      shipping:{
        shipmentID:{
          type:String,
          required:true,
        },
        shippingOrderId:{
          type:String,
          required:true,
        },
        awb:{
          type:String,
        },
      },
      createdAt: {
        type: Date,
        default: Date.now, // Automatically set to the current date
      },
    },
  ],
});
const Order=mongoose.models.Order ||mongoose.model('Order', orderSchema);

export default Order;
