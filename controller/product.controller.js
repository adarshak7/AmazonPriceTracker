const product = require("../model/product.model");

const isProductThere = async (url) => {
  return await product.findOne({ url });
};

module.exports = { isProductThere };
