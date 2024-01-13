const jwt = require("jsonwebtoken");
const {productSchema,reviewSchema} = require('../schema')

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

const validateProduct = (req,res,next)=>{
  const {name, price, image, description} = req.body;
  const {error} = productSchema.validate({name, price, image, description});
  if(error){
    const msg = error.details.map((item)=> item.message).join(',')
    return res.render('error',{err:msg})
  }
  next();
}

const validateReview = (req,res,next)=>{
  const {rating,comment} = req.body;
  const {error} = reviewSchema.validate({rating,comment});
  if(error){
    const msg = error.details.map((item)=> item.message).join(',')
    return res.render('error',{err:msg})
  }
  next();
}

module.exports = {verifyToken,validateProduct,validateReview};