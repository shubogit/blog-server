// imports
const { validateUser, User } = require("../models/user");
const { generateToken } = require("../helpers/jwt");

exports.userLogin = async (req, res) => {
  try {
    const user = req.body;
    // generate new token
    const token = generateToken(user);

    // updating last login field
    req.body.lastLogin = Date.now();
    await User.findByIdAndUpdate(req.id, req.body, { new: true });

    res.status(200).json({
      token,
      user: {
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
