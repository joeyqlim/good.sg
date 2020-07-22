const router = require("express").Router();
const moment = require("moment");
const cloudinary = require("cloudinary");
const Post = require("../models/post.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");

// MULTER =============== //
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

// set storage enginge
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// initialize upload
const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('avatar');

// check file type
function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/;
  const extName = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extName){
    return cb(null, true);
  } else {
    cb("File type not supported!");
  };
};

// ROUTES =============== //

// Get user homepage once signed in
router.get("/", async (req, res)=>{
  try {
    let { posts, _id, username } = req.user;
    let allPosts = await Post.find().populate("author").populate("category");
    let categories = await Category.find();

    res.render("user/homepage", { posts, _id, username, allPosts, categories });
    //console.log(req.user)
  } catch (error) {
    console.log(error);
  }
});

// Get user's profile
router.get("/profile", async (req, res)=>{
  console.log(req.user)
  try {
    let user = await User.findById(req.user._id);

    res.render("user/profile", { user });
  } catch (error) {
    console.log(error);
  };
});

// View all user details (admin only)
router.get("/view", async (req, res)=>{
  console.log(req.user)
  try {
    let users = await User.find();

    res.render("user/view", { users });
  } catch (error) {
    console.log(error);
  };
});

// Make or remove admin status
router.get("/profile/:userid/makeadmin", async (req, res)=>{
  try {
    let user = await User.updateOne(
      { "_id" : req.params.userid },
      { $set: { "isAdmin" : true } }
    );
    res.redirect("/user/view");
  } catch (error) {
    console.log(error);
  };
});

router.get("/profile/:userid/removeadmin", async (req, res)=>{
  try {
    let user = await User.updateOne(
      { "_id" : req.params.userid },
      { $set: { "isAdmin" : false } }
    );
    res.redirect("user/view");
  } catch (error) {
    console.log(error);
  };
});

// Upload avatar
router.post("/profile/upload", (req, res)=>{
  upload(req, res, async (err)=>{
    try {
      // if there is an error, render the error message
      if(err){
        res.render('user/profile', {
          msg: err
        });
      } else {
      // if no image is uploaded, render the error message
        if(req.file == undefined){
          res.render('user/profile', {
            msg: 'No file selected.'
          });
        }
      // if no errors, save the original image to uploads folder
        console.log(req.file);

      // resize the uploaded image and save as new file
        let uploaded = await cloudinary.uploader.upload(req.file.path, function (result) {
          cloudUrl = result.secure_url;
        })

        //let destination = await `./public/uploads/${req.user._id}_avatar.png`
        let updatedUser = await User.updateOne(
          { "_id" : req.user._id },
          { $set: { "avatar" : cloudUrl } }
        );
        if (updatedUser){ 
          res.redirect('/user/profile')
        } 
      }
    } catch (error) {
      console.log(error)
    }   
  })
});

// Get user's posts
router.get("/posts", async (req, res)=>{
  try {
    console.log(req.user._id);
    let posts = await User.findById(req.user._id).populate({
      path: "posts",
      populate: [{ path: "category"}, { path: "author"}],
    });
  
    console.log(posts)

    if (posts) {
      res.render("user/posts", { posts });
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
