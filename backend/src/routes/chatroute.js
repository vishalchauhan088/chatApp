const express = require("express");
const chatController = require("../controllers/chatController.js");
const router = express.Router();

router
  .route("/")
  .get(chatController.getAllChat)
  .post(chatController.createChat);

router.route("/:id");

module.exports = router;
