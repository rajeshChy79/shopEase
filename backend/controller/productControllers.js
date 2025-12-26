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
  console.log("req comes")
  try {
    const { category, minPrice, maxPrice, rating } = req.query;
    console.log(category);
    console.log(minPrice);
    console.log(maxPrice);
    console.log(rating);
    const filter = {};

    if (category) filter.category = category;
    if (minPrice !== undefined) filter.sellingPrice = { $gte: Number(minPrice) };
    if (maxPrice !== undefined) {
      filter.sellingPrice = {
        ...(filter.sellingPrice || {}),
        $lte: Number(maxPrice)
      };
    }

    if (rating !== undefined) filter.rating = { $gte: Number(rating) };

    const products = await productModel.find(filter);

    res.json({ success: true, data: products, error: false });
  } catch (err) {
    res.json({ success: false, error: true, message: err.message });
  }
};


const filterProducts = async (req, res) => {
  try {
    let { category, minPrice, maxPrice, rating, search } = req.body;

    const filter = {};

    // ⭐ Search filter (product name OR category)
    if (search && search.trim() !== "") {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { productName: regex },
        { category: regex }
      ];
    }

    // ⭐ Category filter
    if (category && category !== "") {
      filter.category = category;
    }

    // ⭐ Price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.sellingPrice = {};
      if (minPrice !== undefined) filter.sellingPrice.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.sellingPrice.$lte = Number(maxPrice);
    }

    // ⭐ Rating filter
    if (rating !== undefined && rating !== "") {
      filter.rating = { $gte: Number(rating) };
    }

    console.log("APPLYING FILTER:", filter);

    const products = await productModel.find(filter);

    res.json({
      success: true,
      error: false,
      data: products,
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
