const mongoose = require("mongoose");
const { v4 } = require("uuid");
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4().toString(),
  },
  username: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("User", userSchema);
