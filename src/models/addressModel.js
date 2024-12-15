import mongoose from 'mongoose'

const addressSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    contact:{
      type: Number,
      length: 10,
      required: true,
    },
    street: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
      },
      city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
      },
      state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
      },
      postalCode: {
        type: Number,
        required: true,
        match: /^[1-9][0-9]{5}$/,  
      },
      landmark: {
        type: String,
        minlength: 3,
        maxlength: 100,
      },
   
});

const Address=mongoose.models.Address || mongoose.model("Address",addressSchema);

export default Address;