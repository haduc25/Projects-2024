const mongoose = require('mongoose');

// Định nghĩa IngredientsItem Schema
const IngredientsItemSchema = new mongoose.Schema({
    name: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IngredientCategory',
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    inStoke: {
        type: Boolean,
        default: true,
    },
});

// Định nghĩa và export IngredientsItem Model
const IngredientsItem = mongoose.model('IngredientsItem', IngredientsItemSchema);
module.exports = IngredientsItem;
