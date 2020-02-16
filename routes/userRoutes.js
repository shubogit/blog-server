// imports
const express = require("express");
const router = express.Router();

// middlewares
const _verifyToken = require("../middlewares/verifyToken").verifyUserToken;
const _validateUser = require("../middlewares/validateUser").validateUser;

// controllers
const userControllers = require("../controllers/userControllers");

// POST - methods -----------------------------------
router // login-user
  .route("/login")
  .post(_validateUser, userControllers.userLogin);

router // register user
  .route("/register")
  .post(userControllers.createUser);

router // create blog
  .route("/blog")
  .post(_verifyToken, userControllers.createBlog);

router // add comment to blog
  .route("/blog/:id/comment")
  .post(_verifyToken, userControllers.addCommentToBlog);

// GET - methods ------------------------------------
router // get all blogs
  .route("/blog")
  .get(_verifyToken, userControllers.getBlogs);

router // get comments by blog id
  .route("/blog/:id/comment")
  .get(_verifyToken, userControllers.getAllCommentsByBlogId);

router // get replies by comment id
  .route("/blog/:id/comment/reply")
  .get(_verifyToken, userControllers.getAllReplyByCommentId);

// PUT - methods ------------------------------------
router // add reply to comment
  .route("/blog/:id/comment")
  .put(_verifyToken, userControllers.addReplyToComment);

// exports
module.exports = router;
