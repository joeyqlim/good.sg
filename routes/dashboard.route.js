const router = require("express").Router();
const Post = require("../models/post.model");

router.get("/", (req, res)=>{
  res.render("dashboard/homepage");
});

router.get("/public-posts", async (req, res)=>{
  try {
    let allPosts = await Post.find().populate("author");
    res.render("dashboard/public-posts", { allPosts });
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
