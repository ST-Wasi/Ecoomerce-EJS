const jwt = require("jsonwebtoken");
const {productSchema,reviewSchema} = require('../schema');
const Product = require("../models/Product");

const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies.access_token
    if (!token) return res.status(401).render('needLogin');
      const payload = await jwt.verify(token, process.env.SECRET_KEY);
      if (payload) {
        console.log(payload)
        req.user = payload;
        next();
      } else {
        return res.status(400).json({ message: "Token Malfunctioned" });
      }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const validateProduct = (req, res, next) => {
  const { name, price, image, description } = req.body;
  const { error } = productSchema.validate({ name, price, image, description });

  if (error) {
    const msg = error.details.map((item) => item.message).join(',');
    req.flash('error', msg);
    return res.render('error', { err: msg });
  }

  next();
};

const validateReview = (req, res, next) => {
  const { rating, comment } = req.body;
  const { error } = reviewSchema.validate({ rating, comment });

  if (error) {
    const msg = error.details.map((item) => item.message).join(',');
    req.flash('error', msg);
    return res.render('error', { err: msg });
  }

  next();
};

const isLoggedIn = (req,res,next)=>{
  if(!req.isAuthenticated()){
    req.flash('error','You Are Not Loggedin. PLease Login');
    res.redirect('/login')
  }
  next();
}

const isSeller = (req, res, next) => {
  if (!req.user.role) {
    req.flash('error', 'You are Not Authorized. Role Not Found');
    return res.redirect('/home');
  }

  if (req.user.role !== 'seller') {
    req.flash('error', 'You are Not Authorized');
    return res.redirect('/home');
  }

  next();
};

const isProductAuther = async (req,res,next)=>{
  const {id} = req.params;
  const product = await Product.findById(id);
  if(!product.author.equals(req.user._id)){
    req.flash('error', 'You are Not The Owner Of This Product');
    return res.redirect(`/product/${id}`);
  }
  next();
}

module.exports = {verifyToken,validateProduct,validateReview,isLoggedIn,isSeller,isProductAuther};