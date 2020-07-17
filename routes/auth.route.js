const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const passport = require("../lib/passportConfig");
const saltRounds = 10;

// Get signin and signout forms
router.get("/signup", (req, res)=>{
  res.render("auth/signup");
});

router.get("/signin", (req, res)=>{
  res.render("auth/signin");
});

// Post signup form, create new user, redirect to sign in form
router.post("/signup", async (req, res)=>{
  console.log(req.body);
  try {
    let { username, password } = req.body;
    let hashedPassword = await bcrypt.hash(password, saltRounds);
    let user = new User({ username, password: hashedPassword, });

    let savedUser = await user.save();

    if (savedUser) {
      res.redirect("/auth/signin");
    }
  } catch (error) {
    console.log(error);
  }
});

// Post sign in form
router.post("/signin", 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/signin',
    failureFlash: "Invalid Email/Password, please try again" })
);

router.get("/signout", (req, res) => {
  req.logout(); 
  req.flash("success", "Successfully signed out.");
  res.redirect("/auth/signin");
});

module.exports = router;
