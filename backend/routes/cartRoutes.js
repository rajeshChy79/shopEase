const express = require("express");
const router = express.Router();
const authToken = require("../middleware/authToken");

const cartController = require("../controller/cartControllers.js");

// Cart Routes
router.post("/add", authToken, cartController.addToCart);
router.get("/count", authToken, cartController.countCartProducts);
router.get("/view", authToken, cartController.viewCartProducts);
router.post("/update", authToken, cartController.updateCartProduct);
router.post("/delete", authToken, cartController.deleteCartProduct);

module.exports = router;
