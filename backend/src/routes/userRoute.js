const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const authController = require("../controllers/authController");
router.post("/signUp", authController.signUp);
router.post("/login", authController.login);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user", "admin"),
    userController.getAllUser
  )
  .post(userController.createUser);

router
  .route("/:id")
  .delete(userController.deleteUserByUsername)
  .get(userController.getUserByUsername);

module.exports = router;
