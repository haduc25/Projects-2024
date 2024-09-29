const mongoose = require('mongoose');

// Định nghĩa Cart Schema
const CartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CartItem',
        },
    ],
    total: Number,
});

// Định nghĩa và export Cart Model
const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
