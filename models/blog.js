// imports
const mongoose = require("mongoose");
const joi = require("@hapi/joi");

// joi validation
const validateBlog = value => {
  const schema = joi.object().keys({
    text: joi.string().required(),
    userId: joi.string().required(),
    commentCount: joi.number()
  });
  return schema.validate(value);
};

// schema
const blogSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    commentCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

// Blog model
const Blog = mongoose.model("Blog", blogSchema);

// exports
module.exports = { validateBlog, Blog };
