const mongoose = require('mongoose');

// Định nghĩa Category Schema
const CategorySchema = new mongoose.Schema({
    name: Number,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    },
});

// Định nghĩa và export Category Model
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
