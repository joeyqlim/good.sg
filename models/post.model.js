const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const postSchema = Schema(
  {
    text: {
      type: String,
      required: true,
    },
    postDate: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
