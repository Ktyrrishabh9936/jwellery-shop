import mongoose from 'mongoose'
const location = {
    label: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    value: {
      type: String,
      required: true,
}}
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
    addressline1: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 300,
      },
      addressline2: {
        type: String,
        maxlength: 300,
      },
      city: {
        type: location,
        required: true,
      },
      state: {
        type: location,
        required: true,
      },
      country: {
        type: location,
        required: true,
      },
      postalCode: {
        type: Number,
        required: true,
        match: /^[1-9][0-9]{5}$/,  
      },
      landmark: {
        type: String,
        maxlength: 100,
      },
   
});

const Address=mongoose.models.Address || mongoose.model("Address",addressSchema);

export default Address;