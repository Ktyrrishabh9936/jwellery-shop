import mongoose from 'mongoose'
import Product from './productModel';
// const cartSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   items: [
//     {
//       productId: {
//         // type: mongoose.Schema.Types.ObjectId,
//         // ref: 'Product',
//         // required: true,
//         type:String,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         default: 1,
//       },
//       img_src: String,
//       name: String,
//       price: Number,
//     },
//   ],
// });


const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
        productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        type:String,
      },
      SKU:{
        type:String,
        required:true,
      },
      name:{
        type:String,
        required: true,
      },
      category:{
        type:String,
        required: true,
      },
      img_src:{
        type:String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        default: 0,
      },
      discountedPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  totalPrice:{
    type: Number,
    default: 0,
  },
  totalDiscountedPrice:{
    type: Number,
    default: 0,
  },
  totalItem:{
    type: Number,
    default: 0,
  },
  discounte:{
    type: Number,
    default: 0,
  },

});


const Cart =mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;