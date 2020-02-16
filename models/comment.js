const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const validateComment = comment => {
  const schema = Joi.object().keys({
    userId: Joi.string().required(),
    reply: Joi.array().items(Joi.string()),
    type: Joi.string().required(),
    content: Joi.string().required(),
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
  type: { type: String, required: true },
  reply: [{ type: mongoose.Schema.ObjectId, ref: "comment" }],
  content: { type: String, required: true },
  created: { type: Date, default: Date.now, required: true },
  blogId: { type: mongoose.Schema.ObjectId, ref: "blog" },
  commentId: { type: mongoose.Schema.ObjectId, ref: "comment" }
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = { validateComment, Comment };
