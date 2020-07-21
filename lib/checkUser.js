module.exports = function(req, res, next) {
  if(!req.user) {
    req.flash("error", "You need to log in to see this page.");
    res.redirect("/auth/signin");
  } else {
    next();
  }
};
