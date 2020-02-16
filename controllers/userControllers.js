// imports
const { generateToken } = require("../helpers/jwt");
// models
const { validateUser, User } = require("../models/user");
const { validateBlog, Blog } = require("../models/blog");
const { validateComment, Comment } = require("../models/comment");

exports.userLogin = async (req, res) => {
  try {
    const user = req.body;
    // generate new token
    const token = generateToken(user);

    // updating last login field
    req.body.lastLogin = Date.now();
    await User.findByIdAndUpdate(req.body.id, req.body, { new: true });

    res.status(200).json({
      token,
      user: {
        id: req.body.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error." });
    console.log("ERROR-WHILE-LOGIN-USER: ", e.message);
  }
};
// /Register new user
exports.createUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const email = req.body.email;
    // checking for existing email
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email is already registered" });
    }
    const newUser = new User(req.body);

    await newUser.save();
    res.status(201).json(newUser);
  } catch (e) {
    res.status(500).json({ message: "Internal Server error." });
    console.log("ERROR-WHILE-CREATING-USER: ", e);
  }
};

// create blog
exports.createBlog = async (req, res) => {
  try {
    const { error } = validateBlog(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const user = User.findById(req.body.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }
    let blog = await Blog.create(req.body);
    const newBlog = await blog
      .populate("userId", { firstname: 1, lastname: 1, _id: 0 })
      .execPopulate();

    console.log(newBlog);
    res.status(201).json(newBlog);
  } catch (e) {
    res.status(500).json({ message: "Internal Server error." });
    console.log("ERROR-WHILE-CREATING-BLOG: ", e);
  }
};

// get all blogs
exports.getBlogs = async (req, res) => {
  try {
    let perPage = req.query.limit;
    let skipNo = perPage * req.query.skip;
    const blogs = await Blog.find()
      .skip(parseInt(skipNo))
      .limit(parseInt(perPage))
      .populate("userId", { firstname: 1, lastname: 1, _id: 0 });
    res.status(200).send(blogs);
  } catch (e) {
    res.status(500).json({ message: "Internal Server error." });
    console.log("ERROR-WHILE-GETTING-ALL-BLOGS: ", e);
  }
};

// add comments

exports.addCommentToBlog = async (req, res) => {
  const { error } = validateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(400).json({ message: "Invalid Blog" });
    }
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }
    let comment = await new Comment({
      type: "comment",
      blogId,
      ...req.body
    }).save();
    await Blog.findByIdAndUpdate(blogId, {
      $inc: { commentCount: 1 }
    });
    const newComment = await comment
      .populate("userId", { firstname: 1, lastname: 1, _id: 0 })
      .execPopulate();
    res.status(201).send(newComment);
  } catch (e) {
    res.status(500).json({ message: "Internal Server error." });
    console.log("ERROR-WHILE-ADDING-COMMENTS: ", e);
  }
};

exports.addReplyToComment = async (req, res) => {
  const { error } = validateComment(data);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(400).json({ message: "Invalid Blog" });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }
    const reply = await new Comment({
      type: "reply",
      ...req.data
    }).save();
    const comment = await Comment.findByIdAndUpdate(req.body.commentId, {
      $push: { reply: reply._id }
    });
    res.status(201).send(reply);
  } catch (e) {
    res.status(500).json({ message: "Internal Server error." });
    console.log("ERROR-WHILE-ADDING-REPLY: ", e);
  }
};

exports.getAllCommentsByBlogId = async (req, res) => {
  try {
    const _id = req.params.id;
    const comments = await Comment.find({
      blogId: _id,
      type: { $eq: "comment" }
    }).populate("userId", { firstname: 1, lastname: 1 });
    res.status(200).send({ comments });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error." });
    console.log("ERROR-WHILE-GETTING-COMMENTS: ", e);
  }
};

exports.getAllReplyByCommentId = async (req, res) => {
  try {
    const _id = req.query.commentId;
    const comment = await Comment.findById(_id)
      .populate({
        path: "reply",
        populate: { path: "userId", select: "firstname lastname" }
      })
      .exec();
    if (!comment) {
      return res.status(404).json("Comment does not exists");
    }
    const replies = comment.reply;
    res.status(200).send(replies);
  } catch (e) {
    res.status(500).json({ message: "Internal Server error." });
    console.log("ERROR-WHILE-GETTING-COMMENTS: ", e);
  }
};
