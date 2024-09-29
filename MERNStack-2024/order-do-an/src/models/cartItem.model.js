const mongoose = require('mongoose');

// Định nghĩa CartItem Schema
const CartItemSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
    },
    quantity: Number,
    ingredients: [String],
    totalPrice: Number,
});

// Định nghĩa và export CartItem Model
const CartItem = mongoose.model('CartItem', CartItemSchema);
module.exports = CartItem;
