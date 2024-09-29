const mongoose = require('mongoose');

// Định nghĩa Order Schema
const OrderSchema = new mongoose.Schema({
    name: String,
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    totalAmount: Number,
    orderStatus: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderItem',
        },
    ],
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    totalItem: Number,
    totalPrice: Number,
});

// Định nghĩa và export Order Model
const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;
