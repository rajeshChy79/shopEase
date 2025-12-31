const express = require("express");
const router = express.Router();
const authToken = require("../middleware/authToken");
const upload = require("../middleware/upload");

const productController = require("../controller/productControllers.js");

// Product Routes
router.post("/upload", authToken, upload.array("productImage", 5), productController.uploadProduct);
router.get("/all", productController.getAllProducts);
router.post("/update", authToken, upload.array("productImage", 5), productController.updateProduct);
router.get("/categories", productController.getCategoryProducts);
router.post("/by-category", productController.getCategoryWiseProducts);
router.post("/details", productController.getProductDetails);
router.get("/search", productController.searchProducts);
router.post("/filter", productController.filterProducts);

module.exports = router;
