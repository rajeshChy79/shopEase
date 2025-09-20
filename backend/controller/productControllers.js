const productModel = require("../models/productModel");
const uploadProductPermission = require("../helpers/permission");

// 📌 Upload Product
const uploadProduct = async (req, res) => {
  try {
    if (!(await uploadProductPermission(req.userId))) {
      throw new Error("Permission Denied");
    }
    const uploadProduct = new productModel(req.body);
    const saveProduct = await uploadProduct.save();

    res.status(200).json({
      message: "Product saved successfully",
      success: true,
      error: false,
      data: saveProduct,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// 📌 Update Product
const updateProduct = async (req, res) => {
  try {
    if (!(await uploadProductPermission(req.userId))) {
      throw new Error("Permission Denied");
    }
    const { _id, ...restBody } = req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(_id, restBody);

    res.status(200).json({
      message: "Product updated successfully",
      success: true,
      error: false,
      data: updatedProduct,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// 📌 Get All Products
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All products fetched successfully",
      success: true,
      error: false,
      data: allProducts,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// 📌 Get Product Details by ID
const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.status(200).json({
      success: true,
      error: false,
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// 📌 Search Product (by name or category)
const searchProducts = async (req, res) => {
  try {
    const query = req.query.q || "";
    const regex = new RegExp(query, "i");
    const product = await productModel.find({
      $or: [{ productName: regex }, { category: regex }],
    });

    res.json({
      data: product,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// 📌 Filter Products by Category List
const filterProducts = async (req, res) => {
  try {
    const categoryList = req.body.category || [];
    const products = await productModel.find({
      category: { $in: categoryList },
    });

    res.json({
      data: products,
      success: true,
      error: false,
      message: "Filtered products",
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

// 📌 Get One Product per Category
const getCategoryProducts = async (req, res) => {
  try {
    const productCategory = await productModel.distinct("category");
    const productByCategory = [];

    for (const category of productCategory) {
      const productFromCategory = await productModel.findOne({ category });
      if (productFromCategory) {
        productByCategory.push(productFromCategory);
      }
    }

    res.status(200).json({
      message: "Product by category",
      data: productByCategory,
      success: true,
      error: false,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      success: false,
      error: true,
    });
  }
};

const getCategoryWiseProducts = async (req, res) => {
  try {
    let category = req.query.category || req.body.category;

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
        success: false,
        error: true,
      });
    }

    category = String(category).trim();

    // Case-insensitive partial match
    const products = await productModel.find({
      category: { $regex: category, $options: 'i' }
    });

    console.log("Category-wise products:", products);

    res.status(200).json({
      data: products,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong while fetching products",
      success: false,
      error: true,
    });
  }
};

module.exports = {
  uploadProduct,
  updateProduct,
  getAllProducts,
  getProductDetails,
  searchProducts,
  filterProducts,
  getCategoryProducts,
  getCategoryWiseProducts,
};
