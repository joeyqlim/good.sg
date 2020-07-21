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
    };
  } catch (error) {
    console.log(error);
  };
});

router.get("/view/:catid", async (req, res)=>{
  try {
    let categorized = await Category.findById(req.params.catid)
      .populate({
        path: "posts",
        populate: { path: "author" }
      });
      
    if (categorized) {
      res.render("category/view", { categorized });
    }
  } catch (error) {
    console.log(error);
  };
});

router.get("/edit/:catid", (req, res)=>{
  Category.findById(req.params.catid)
    .then((category)=>{
      res.render("category/edit", { category });
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.post("/edit/:catid", (req, res)=>{
  Category.findByIdAndUpdate(req.params.catid, req.body)
    .then(()=>{
      res.redirect("/category/new");
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.delete("/delete/:catid", (req, res)=>{
  Category.findByIdAndDelete(req.params.catid)
    .then(()=>{
      res.redirect("/category/new");
    })
    .catch((err)=>{
      console.log(err);
    });
})

module.exports = router;
