const Category = require("../models/category.model");

const router = require("express").Router();

router.get("/new", (req, res)=>{
  Category.find()
    .then((categories)=>{
      res.render("category/new", { categories });
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.post("/new", async (req, res)=>{
  console.log(req.body);
  try {
    let category = new Category(req.body);
    let savedCategory = await category.save();
    if (savedCategory){
      req.flash("success", `Successfully added "${req.body.name}".`);
      res.redirect("/category/new");
    }    
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
