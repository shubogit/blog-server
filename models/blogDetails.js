const mongoose = require("mongoose");

const blogDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
    required: true
  },
  like: { type: Boolean, default: false }
});

const BlogDetails = mongoose.model("blogdetail", blogDetailsSchema);

module.exports = { BlogDetails };
