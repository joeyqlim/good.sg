const router = require("express").Router();

router.get("/", (req, res)=>{
  res.render("dashboard/homepage");
})

module.exports = router;
