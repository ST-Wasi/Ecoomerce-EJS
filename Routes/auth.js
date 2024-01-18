const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();

router.get('/signup',(req,res)=>{
    res.render('auth/signup')
})

router.post('/signup', async (req, res) => {
    const { username, password, options, email } = req.body;
    let role;
    if (options === 'buyer') {
        role = 'buyer';
    } else if (options === 'seller') {
        role = 'seller';
    } else {
        role = 'defaultRole';
    }

    const user = new User({ username, role, email });
    let newUser = await User.register(user, password);
    res.redirect('/login');
});

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
