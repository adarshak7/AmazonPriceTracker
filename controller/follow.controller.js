const follow = require("../model/follow.model");
const user = require("../model/user.model");
const product = require("../model/product.model");
const userController = require("../controller/user.controller");

const isFollowthere = async (user, productfound) => {
  const followdoc = await follow.findOne({ user: user, product: productfound });
  if(followdoc == null){
    return false
  }
  followdoc.active = true;
  return !followdoc.save();
};

const followProduct = async (username, productfound) => {
  const userfound = await user.findOne({ username });
  if (! await isFollowthere(userfound, productfound)) {
    console.log("following");
  } else {
    try {
      await follow.create({
        product: productfound,
        user: userfound,
        active: true,
      });
      console.log("product found and followed");
    } catch {
      console.log("error in follow request");
    }
  }
};

const unfollowProduct = async (username, producturl) => {
  const users = await user.findOne({ username });
  const products = await product.findOne({ producturl });
  let temp5 = await follow.findOne({ user: users, product: products });
  temp5.active = false;
  return await temp5.save();
};
module.exports = { followProduct, unfollowProduct };
