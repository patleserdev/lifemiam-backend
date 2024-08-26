const mongoose = require('mongoose');

const ingredientsSchema = mongoose.Schema({
    // _id: Number,
    name: String,
    unit: {type : String, enum: ['cl', 'grammes', 'unités','litres','feuilles','cuillères à café','gousses']},
    category: String,
    regime: {type : [String]}

})

const Ingredient = mongoose.model('ingredients', ingredientsSchema);

module.exports = Ingredient;