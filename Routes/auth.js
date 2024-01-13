const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();

router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup',async (req,res)=>{
    console.log(req.body)
    let {username,password,email} = req.body;
    const user = new User({username,email})
    let newUser  = await User.register(user,password)
    res.send(newUser)
})

router.get('/login',(req,res)=>{
    res.render('auth/login')
})

router.post('/login',
passport.authenticate('local',{
    failureRedirect: '/login',
    failureMessage: true
}),
function(req,res){
    req.flash('success', 'Welcome Back')
    res.redirect('/home')
}
)

module.exports = router;
