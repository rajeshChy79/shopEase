const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, getMyOrders } = require("../controller/orderControllers");
const authToken = require("../middleware/authToken");

// Only keep these two
router.post("/create", authToken, createOrder);
router.get("/my-orders", authToken, getMyOrders);
router.post("/verify", authToken, verifyPayment);

module.exports = router;
