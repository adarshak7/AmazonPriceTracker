const mongoose = require("mongoose");
const { v4 } = require("uuid");

const followSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4().toString(),
  },
  product: {
    type: String,
    ref: "Product",
  },
  user: {
    type: String,
    ref: "User",
  },
  active: {
    type: Boolean,
    deafault: true,
  },
});

module.exports = mongoose.model("Follow", followSchema);
