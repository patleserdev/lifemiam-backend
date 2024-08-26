const mongoose = require('mongoose');

const IngredientCopySchema = mongoose.Schema({
    name: String,
    unit: {type : String, enum: ['cl', 'grammes', 'unités','litres','feuilles','cuillères à café','gousses']},
    category: String,
    regime: {type : String, enum: ['vegan', 'lactose-free', 'arachid-free']}
})

const IngredientCopy = mongoose.model('Ingredients2', IngredientCopySchema);

module.exports = IngredientCopy;