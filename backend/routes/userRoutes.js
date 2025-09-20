const express = require("express");
const router = express.Router();
const authToken = require("../middleware/authToken");

const userController = require("../controller/userControllers");

// User Routes
router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.get("/user-details", authToken, userController.getUserDetails);
router.get("/logout", userController.logout);
router.get("/all", authToken, userController.getAllUsers);
router.post("/update", authToken, userController.updateUser);

module.exports = router;
