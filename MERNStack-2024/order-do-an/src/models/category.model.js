const mongoose = require('mongoose');

// Định nghĩa Category Schema
const CategorySchema = new mongoose.Schema({
    name: String,
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
});

// Định nghĩa và export Category Model
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
