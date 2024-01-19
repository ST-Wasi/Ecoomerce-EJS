const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const {
  validateProduct,
  isLoggedIn,
  isSeller,
  isProductAuther,
  isProductInCart,
} = require("../middlewares/middleware");
const Review = require("../models/Review");
const User = require("../models/User");

router.get(
  "/product/:id/edit",
  isLoggedIn,
  isSeller,
  isProductAuther,
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/home");
      }
      res.render("edit", { product });
    } catch (error) {
      console.error(error);
      req.flash("error", "Internal Server Error");
      res.redirect("/home");
    }
  }
);

router.get("/product/new", isLoggedIn, isSeller, (req, res) => {
  res.render("new");
});

router.get("/home", async (req, res) => {
  try {
    const data = await Product.find({});
    return res.render("home", { data });
  } catch (error) {
    req.flash("error", `Internal Server Error: ${error}`);
    return res.redirect("/home");
  }
});

router.get("/product/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Product.findById(id).populate("reviews");
    if (!item) {
      req.flash("error", "Product not found");
      return res.redirect("/home");
    }
    res.render("show", { item });
  } catch (e) {
    req.flash("error", e.message);
    res.render("error", { err: e.message });
  }
});

router.patch(
  "/product/:id",
  isLoggedIn,
  isSeller,
  isProductAuther,
  async (req, res) => {
    try {
      const { name, price, image, description } = req.body;
      const { id } = req.params;
      const updatedProduct = await Product.findByIdAndUpdate(id, {
        name,
        price,
        image,
        description,
      });
      if (!updatedProduct) {
        req.flash("error", "Product not found");
        return res.redirect("/home");
      }
      req.flash("success", "Product Updated Successfully");
      res.redirect("/home");
    } catch (error) {
      console.error(error);
      req.flash("error", "Internal Server Error");
      res.redirect("/home");
    }
  }
);

router.post(
  "/products",
  isLoggedIn,
  isSeller,
  validateProduct,
  async (req, res) => {
    try {
      const { name, image, price, description, author, quantity } = req.body;
      await Product.create({
        name,
        image,
        price,
        quantity,
        description,
        author: req.user._id,
      });
      req.flash("success", "Product Created Successfully");
      res.redirect("/home");
    } catch (error) {
      console.error("Error creating product:", error);
      req.flash("error", "Internal Server Error");
      res.status(500).send("Internal Server Error");
    }
  }
);

router.delete(
  "/product/:id/delete",
  isLoggedIn,
  isSeller,
  isProductAuther,
  async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/home");
      }

      for (let item of product.reviews) {
        await Review.findByIdAndDelete(item._id);
      }
      await Product.findByIdAndDelete(id);
      const user = req.user;
      await User.findByIdAndUpdate(user._id, { $pull: { cart: {product: id} } });
      await User.findByIdAndUpdate(user._id, { $pull: { wishlist: id } });
      res.redirect("/home");
    } catch (error) {
      req.flash("error", "Internal Server Error", error);
      res.redirect("/home");
    }
  }
);



module.exports = router;
