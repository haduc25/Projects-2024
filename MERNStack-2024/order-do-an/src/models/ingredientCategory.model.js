const mongoose = require('mongoose');

// Định nghĩa IngredientCategory Schema
const IngredientCategorySchema = new mongoose.Schema({
    name: String,
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    ingredients: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IngredientsItem',
    },
});

// Định nghĩa và export IngredientCategory Model
const IngredientCategory = mongoose.model('IngredientCategory', IngredientCategorySchema);
module.exports = IngredientCategory;
