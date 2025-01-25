import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: (name) => {
                const nameRegex = /^[a-zA-Z ]{2,}$/;
                return nameRegex.test(name);
            },
            message: 'Invalid name format',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(email);
            },
            message: 'Invalid email format',
        },
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
    wishList:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    image:{
        type:String,
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
    },
    addresses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address"
}],
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    
}, {
    timestamps: true
});


const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;