const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();

router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup',async (req,res)=>{
    console.log(req.body)
    let {username,password,role,email} = req.body;
    const user = new User({username,role,email})
    let newUser  = await User.register(user,password)
    res.redirect('/login')
})

router.get('/login',(req,res)=>{
    res.render('auth/login')
})

router.post('/login',
passport.authenticate('local',{
    failureRedirect: '/login',
    failureFlash: true
}),
function(req,res){
    req.flash('success', `Welcome Back ${req.user.username}`)
    res.redirect('/home')
}
);

router.get('/logout',(req,res)=>{
    req.logout(()=>{
        req.flash("success",'loged out sucesfully')
    })
    res.redirect('/login')
})

module.exports = router;
