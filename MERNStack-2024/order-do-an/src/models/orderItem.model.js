const mongoose = require('mongoose');

// Định nghĩa OrderItem Schema
const OrderItemSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
    },
    quantity: Number,
    totalPrice: Number,
    ingredients: [String],
});

// Định nghĩa và export OrderItem Model
const OrderItem = mongoose.model('OrderItem', OrderItemSchema);
module.exports = OrderItem;
