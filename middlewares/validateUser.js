// imports
const { User } = require("../models/user");

exports.validateUser = async (req, res, next) => {
  try {
    const userLoginData = req.body;
    // console.log(userLoginData);
    if (!userLoginData.email || !userLoginData.password) {
      return res.status(400).json({ message: "Login failed: Invalid data" });
    }

    const user = await User.findOne({ email: userLoginData.email });
    // console.log(user);
    if (!user || !(await user.compareHashPassword(userLoginData.password))) {
      return res
        .status(400)
        .json({ message: "Login failed: either email or password is wrong" });
    }
    req.body = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      lastLogin: user.lastLogin
    };
    return next();
  } catch (error) {
    console.log("ERROR VALIDATING USER :", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
