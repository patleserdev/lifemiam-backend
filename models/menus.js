const mongoose = require("mongoose");

const menuRecipeSchema = mongoose.Schema({
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: "recipes" },
  serving: {
    type: Number,
    min: 1,
    max: 100,
  },
});

const menusSchema = mongoose.Schema({
  name: String,
  is_archived: { type: Boolean, default: false },
  date_created: { type: Date, default: Date.now },
  menu_recipes: [menuRecipeSchema],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users'}
});

const Menu = mongoose.model("menus", menusSchema);

module.exports = Menu;
