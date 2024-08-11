const User = require("../models/userModel.js");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
exports.getAllUser = async (req, res) => {
  try {
    let query = User.find({});

    if (req.query.username) {
      query = query
        .where("username")
        .regex(new RegExp(req.query.username, "i"));
    }

    const users = await query.select("-password");

    res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.id });
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);

    console.log(error.stack);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

exports.deleteUserByUsername = async (req, res) => {
  try {
    await User.deleteOne({ username: req.params.id });
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);

    console.log(error.stack);
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
