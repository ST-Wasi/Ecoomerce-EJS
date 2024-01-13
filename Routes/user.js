const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/signup", (req, res) => {
  try {
    let token = req.cookies.access_token
  if(token){
    return res.render('home')
  }
  return res.render("signup");
  } catch (error) {
    return res.status(500).json({message: "internal server error"})
  }
  
});
router.get("/login", (req, res) => {
  try {
    let token = req.cookies.access_token
  if(token){
    return res.render('home')
  }
  return res.render("login");
  } catch (error) {
    return res.status(500).json({message: "internal server error"})
  }
  
});

router.post("/signup", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User Already Exist. You Can Login" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ fullname, email, password: hashedPassword });
    res.status(200).render("login");
  } catch (error) {
    res.status(400).json({ message: `Internal Server Error: ${error}` });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res
  .status(201)
  .cookie('access_token', token, {
    expires: new Date(Date.now() + 1 * 3600000)
  })
  .redirect('/home')
  } catch (error) {
    return res.status(500).json({message: "Internal server err"});
  }
});

module.exports = router;
