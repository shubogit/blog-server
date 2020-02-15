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

// GET - methods ------------------------------------
router // get all blogs
  .route("/blog")
  .get(_verifyToken, userControllers.getBlogs);

// exports
module.exports = router;
