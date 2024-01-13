const express = require("express");
const path = require("path");
const app = express();
const session = require('express-session')
const flash = require('connect-flash');
const methodoverride = require("method-override");
const mongoose = require("mongoose");
const productRoutes = require("./Routes/product");
const globalRoutes = require('./Routes/global');
const cookieParser = require('cookie-parser')
const authRoutes = require('./Routes/auth')
const reviewRoutes = require('./Routes/review')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require("./models/User");

// db connect
mongoose
  .connect("mongodb://127.0.0.1:27017/Ecom")
  .then(() => {
    console.group("connected to Database");
    let PORT = 8080;
    app.listen(PORT, () => {
      console.log(`listening to the port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting the database: ${err}`);
  });

// session configuration for middleware
let configSession = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
};

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride("_method"));
app.use(cookieParser())
app.use(session(configSession))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use(productRoutes);
app.use(globalRoutes);
app.use(reviewRoutes);
app.use(authRoutes);