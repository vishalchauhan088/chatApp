const express = require("express");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.status(200).json({
      status: "success",
      message: " All user fetched",
    });
  })
  .post((req, res) => {
    res.status(200).json({
      status: "success",
      message: "user created",
    });
  });

router.route("/:id");

module.exports = router;
