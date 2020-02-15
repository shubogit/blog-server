const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const validateComment = comment => {
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    reply: Joi.array().items(Joi.string()),
    content: Joi.string().required(),
    likes: Joi.array().items(Joi.string()),
    blogId: Joi.string(),
    commentId: Joi.string()
  });
  return schema.validate(comment);
};

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true
  },
  reply: [{ type: mongoose.Schema.ObjectId, ref: "comment" }],
  content: { type: String, required: true },
  created: { type: Date, default: Date.now, required: true },
  likes: [{ type: mongoose.Schema.ObjectId, ref: "user", default: [] }],
  blogId: { type: mongoose.Schema.ObjectId, ref: "blog" }
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = { validateComment, Comment };
