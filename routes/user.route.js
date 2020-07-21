const router = require("express").Router();
const moment = require("moment");
const Post = require("../models/post.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");

// Get user homepage once signed in
router.get("/", async (req, res)=>{
  try {
    let { posts, _id, username } = req.user;
    let allPosts = await Post.find().populate("author");
    let categories = await Category.find();

    res.render("user/homepage", { posts, _id, username, allPosts, categories });
    //console.log(req.user)
  } catch (error) {
    console.log(error);
  }
});

router.get("/posts", async (req, res)=>{
  try {
    console.log(req.user._id);
    userId = req.user._id;
    let posts = await User.findById(req.user._id).populate({
      path: "posts",
      populate: { path: "category"},
    });
  
    console.log(posts)

    if (posts) {
      res.render("user/posts", { posts, userId });
    }
  } catch (error) {
    console.log(error);
  }
})

// Post user input, save to posts
router.post("/createpost", async (req, res)=>{
  //console.log(req.body);
  try {
    let postData = {
      text: req.body.text,
      category: req.body.category,
      postDate: moment(),
      author: req.user._id,
    };
    let post = new Post(postData);
    let savedPost = await post.save();

    let updatedCategory = await Category.findByIdAndUpdate(postData.category, {
      $push: { posts: post._id },
    });

    let updatedUser = await User.findByIdAndUpdate(postData.author, {
      $push: { posts: post._id },
    });

    if (savedPost && updatedCategory && updatedUser) {
      res.redirect("/user");
    }
  } catch (error) {
    console.log(error);
  }
});

// Delete post
router.delete("/posts/delete/:postid", (req, res)=>{
  Post.findByIdAndDelete(req.params.postid)
  .then(()=>{
    res.redirect("/user/posts")
  })
  .catch((err)=>{
    console.log(err);
  });
});

module.exports = router;
