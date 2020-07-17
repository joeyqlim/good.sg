const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

// creating a custom instance method that compares passwords
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
  // bcrypt.compare(password, this.password).then((result) => {
  //   return result;
  // });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
