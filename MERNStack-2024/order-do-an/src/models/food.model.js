const mongoose = require('mongoose');

// Định nghĩa Food Schema
const FoodSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    foodCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    images: [String],
    available: Boolean,
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    isVegetarian: Boolean,
    isSeasonal: Boolean,
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'IngredientsItem',
        },
    ],
    creationDate: {
        type: Date,
        default: Date.now,
    },
});

// Định nghĩa và export Food Model
const Food = mongoose.model('Food', FoodSchema);
module.exports = Food;
