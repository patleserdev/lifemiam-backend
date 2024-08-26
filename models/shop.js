const mongoose = require('mongoose');

const ingredientsSchema = mongoose.Schema({
    
    name: String,
    unit: String,
    quantity: Number,
    category: String,
    recipes: [mongoose.Schema.Types.ObjectId],
    isBuyed: Boolean,
})


const shopSchema = mongoose.Schema({

    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "menus" },
    Ingredients:  [ingredientsSchema] 
})

const Shop = mongoose.model("shop", shopSchema);

module.exports = Shop;