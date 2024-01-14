const express = require("express");
const Product = require("../models/Product");
const router = express.Router();
const { validateProduct,isLoggedIn } = require("../middlewares/middleware");
const Review = require("../models/Review");


router.get('/product/:id/edit',isLoggedIn, async (req,res)=>{
  try {
    const {id} = req.params;
  const product = await Product.findById(id);
  res.render('edit',{product})
  } catch (error) {
    console.log(error);
    res.redirect('/home')
  }
  
})

router.get('/product/new',isLoggedIn,(req,res)=>{
  res.render('new');
})

router.get("/home", async (req, res) => {
  try {
    const data = await Product.find({});
    return res.render("home", { data});
  } catch (error) {
    return res.status(400).json({ message: `Internal Server Error: ${error}` });
  }
});



router.get('/product/:id',isLoggedIn,async(req,res)=>{
  try {
    const {id} = req.params;
  const item = await Product.findById(id).populate('reviews');
  res.render('show',{item});
  } catch (e) {
    res.render('error',{err:e.message});
  }
  
})

router.patch('/product/:id',isLoggedIn, async (req,res)=>{
  try {
    const {name, price, image, description} = req.body;
  const {id} = req.params;
  await Product.findByIdAndUpdate(id,{name, price, image, description});
  req.flash('success','Product Edited Successfully')
  res.redirect(`/home`)
  } catch (error) {
    console.log(error);
    res.redirect('/home')
  }
  
})

router.post('/products',isLoggedIn, validateProduct, async (req, res) => {
  try {
    const { name, image, price, description,author } = req.body;
    await Product.create({ name, image, price, description,author:req.user._id });
    res.cookie('name','wasi');
    res.redirect('/home');
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete('/product/:id/delete',isLoggedIn, async (req,res)=>{
  try {
    const {id} = req.params;
  const product = await Product.findById(id);
  for(let item of product.reviews){
    await Review.findByIdAndDelete(item._id);
  };
  await Product.findByIdAndDelete(id);
  res.redirect('/home');
  } catch (error) {
    console.log(error);
  } 
})

module.exports = router;