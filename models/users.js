const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  regime: { type: [String]},
  signup_date: { type: Date, default: Date.now },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: "menus" }],
});

const User = mongoose.model("users", usersSchema);

module.exports = User;
