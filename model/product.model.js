const mongoose = require("mongoose");
const { v4 } = require("uuid");

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4().toString(),
  },
  url: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
  },
});


module.exports = mongoose.model("Product", productSchema);
