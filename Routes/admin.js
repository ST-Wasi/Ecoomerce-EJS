const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin');

router.post('/admin/dashboard/create/user',async (req,res)=>{
    try {
        const {email,password} = req.body;
    const admin = await Admin.findOne({email});
    if(admin){
        return res.status(400).json({message: "User Already Exist"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    await Admin.create({email,password:hashedPassword});
    return res.status(200).json({message: "Admin Registered Sucesfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server err"});
    }
    
});

router.post('/admin/dashboard/login', async (req,res)=>{
    try {
        const {email,password} = req.body
    const admin = await Admin.findOne({email});
    if(!admin) return res.status(400).json({message: "credentials invalid"})
    const isValidPassword = await bcrypt.compare(password,admin.password);
    if(!isValidPassword) return res.status(400).json({message: "credentials invalid"});
    const token = jwt.sign({email},process.env.SECRET_KEY,{
        expiresIn: '1h'
    });
    // res.status(200).json({token});
    res
  .status(201)
  .cookie('access_token', token, {
    expires: new Date(Date.now() + 1 * 3600000) // cookie will be removed after 1 hours
  })
  .redirect('/home')
    } catch (error) {
        return res.status(500).json({message: "Internal server err"});
    }
    
});

module.exports = router;