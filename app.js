const express = require("express");
const mongoose = require("mongoose");
const user = require("./model/user.model");
const passport = require("passport");
const initialize = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const product = require("./model/product.model");
const findCost = require("./services/cost.services");
const productController = require("./controller/product.controller.js");
const follow = require("./model/follow.model");
const userController = require("./controller/user.controller");
const followController = require("./controller/follow.controller");

initialize(passport);
app = express();

mongoose.connect("mongodb://localhost/aws", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: "summa",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { username: req.user.username });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  let username = req.body.username;
  try {
    await user.create({
      username: req.body.username,
      password: req.body.password,
    });
    console.log("created!");
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.post("/add-product", checkAuthenticated, async (req, res) => {
  let productUrl = req.body.producturl;
  let productfound = await productController.isProductThere(productUrl);
  let username = req.user.username;
  if (!productfound) {
    let productPrice = await findCost(productUrl);
    try {
      await product.create({
        url: productUrl,
        price: productPrice,
      });
      console.log("created");

    } catch {
      console.log("not created");
      res.redirect("/");
    }
    try {
      followController.followProduct(username);
      res.redirect("/");
    } catch {
      console.log("follow request failed");
      res.redirect("/");
    }
  } else if (userController.isUserFollowing(req.user.username, productfound)) {
    try {
      followController.followProduct(username, productfound);
      res.redirect("/");
    } catch {
      console.log("follow request failed");
      res.redirect("/");
    }
  } else {
    console.log("already following");
    res.redirect("/");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.patch("/unfollow", async (req, res) => {
  try {
    if(await followController.unfollowProduct(req.user.username, req.body.url)){
    console.log("unfollowed successfully");
    }
  } catch {
    console.log("unfollow request failed");
  }
  res.redirect("/");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.listen(3000);
