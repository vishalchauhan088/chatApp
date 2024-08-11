const User = require("../models/userModel.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    // now we want to create a jswt token and send it in head
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // putting user in res object
    req.user = user;

    // sending token
    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.log(error.stack);

    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  //using username and password to login
  try {
    if (!(req.body.username || req.body.email) || !req.body.password) {
      return res.status(404).json({
        status: "fail",
        message: "Please provide password username or email",
      });
    }
    const user = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    }).select("+password");

    // check if user is present
    if (!user) {
      return next(new Error("User not found"));
    }
    // then check if user password is correct or not
    const isPasswordCorrect = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      console.error("Error logging in:", error);
      return res.status(401).json({
        status: "error",
        message: "An error occurred. Please try again later.",
      });
    }
    // since all good , now we want to create a  jwt token and sent it in header
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // put user in res object
    req.user = user;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user: user,
      },
    });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.log(error.stack);
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  //now since user has logged in
  //let's check if the token is valid

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return res.status(401).json({
      status: "fail",
      message: "you are not logged in",
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "you are not logged in",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "user not found",
    });
  }
  //let's check if user has changed the password after token was created

  if (user.passwordChangedAfter(decoded.iat)) {
    return res.status(401).json({
      status: "fail",
      message: "user recently changed password. please login again",
    });
  }

  req.user = user;

  next();
};

exports.restrictTo = (...roles) => {
  return async function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
