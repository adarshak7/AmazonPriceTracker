const follow = require("../model/follow.model");

const isUserFollowing = async (username, product) => {
  return !!(await follow.findOne({ user: username, product: product }));
};

module.exports = { isUserFollowing };
