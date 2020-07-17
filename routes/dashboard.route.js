const router = require("express").Router();

router.get("/", (req, res)=>{
  res.render("dashboard/homepage");
});

router.get("/public-posts", (req, res)=>{
  res.render("dashboard/public-posts");
});

module.exports = router;
