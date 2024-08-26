const mongoose = require("mongoose");

const ingredientsSchema2 = mongoose.Schema({
  ingredient: String,
  _id: { type: mongoose.Schema.Types.ObjectId, ref: "ingredients" },
  quantity: Number, //should support null value
});

const recipesCopySchema = mongoose.Schema({
  name: String,
  tags: [String],
  regime: [String],
  image: String,
  default_serving: Number,
  ing: [ingredientsSchema2],
  steps: [String],
  difficulty: Number,
  time: Number,
  popularity: Number, //should be the count of menus with this recipe
  ustensiles: [String],
  temps_preparation: Number,
  temps_cuisson: Number,
});

const RecipeCopy = mongoose.model("recipes2", recipesCopySchema);

module.exports = RecipeCopy;
