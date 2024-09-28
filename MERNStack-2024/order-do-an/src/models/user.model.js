const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    role: {
        type: String,
        enum: ['ROLE_CUSTOMER', 'ROLE_RESTAURANT_OWNER'],
        default: 'ROLE_CUSTOMER',
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
    ],
    favorites: [
        {
            name: String,
            description: String,
            images: [],
        },
    ],
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address',
        },
    ],
});

const User = (mongoose = mongoose.model('User', UserSchema));
module.exports = User;
