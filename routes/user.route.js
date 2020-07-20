const router = require("express").Router();
const moment = require("moment");
const Post = require("../models/post.model");
const Category = require("../models/category.model");

// Get user homepage once signed in
router.get("/", async (req, res)=>{
  try {
    let { posts, _id, username } = req.user;
    let allPosts = await Post.find().populate("author");
    let categories = await Category.find();

    res.render("dashboard/user", { posts, _id, username, allPosts, categories });
    console.log(req.user)
  } catch (error) {
    console.log(error);
  }
});

// Post user input, save to posts
router.post("/createpost", async (req, res)=>{
  console.log(req.body);
  try {
    let postData = {
      text: req.body.text,
      postDate: moment(),
      author: req.user._id,
    };
    let post = new Post(postData);
    let savedPost = await post.save();
    if (savedPost) {
      res.redirect("/user");
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
