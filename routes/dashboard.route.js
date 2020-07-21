const router = require("express").Router();
const Post = require("../models/post.model");

router.get("/", (req, res)=>{
  if (req.user){
    res.redirect("/user");
  } else {
    res.render("dashboard/homepage");
  }
});

router.get("/public-posts", async (req, res)=>{
  try {
    let allPosts = await Post.find().populate("author").populate("category");
    res.render("dashboard/public-posts", { allPosts });
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
