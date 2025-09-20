const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const orderRoutes = require("./orderRoutes");

// Mounting all routes
router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

module.exports = router;
