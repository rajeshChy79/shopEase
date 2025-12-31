const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, getMyOrders, getAllOrders, updateOrderStatus } = require("../controller/orderControllers");
const authToken = require("../middleware/authToken");

// Only keep these two
router.post("/create", authToken, createOrder);
router.get("/all-orders", authToken, getAllOrders);
router.get("/my-orders", authToken, getMyOrders);
router.post("/verify", authToken, verifyPayment);
router.patch("/update-status", authToken, updateOrderStatus);

module.exports = router;
