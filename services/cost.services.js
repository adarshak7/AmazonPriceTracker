const nightmare = require("nightmare")();
const product = require("../model/product.model");

const findCost = async (url) => {
  const priceString = await nightmare
    .goto(url)
    .wait("#priceblock_ourprice")
    .evaluate(() => document.getElementById("priceblock_ourprice").innerText)
    .end();
  const priceNumber = parseFloat(priceString.replace(/[₹,]/g, ""));
  console.log(priceNumber);
  return priceNumber;
};

const dailyUpdate = async () => {
  listofproducts = await product.find({});
  for (let i of listofproducts) {
    url = i.url;
    temp_price = await findCost(url);
    i.price = temp_price,
    await i.save(),
    console.log("done");
  }
};
// dailyUpdate();

module.exports = findCost;
