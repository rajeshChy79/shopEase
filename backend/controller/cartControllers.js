const cartModel = require("../models/cartProduct");

const cartController = {
  // Add to cart
  async addToCart(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.userId;

      const existing = await cartModel.findOne({ productId, userId });
      if (existing) return res.status(400).json({ message: "Product already in cart", success: false });

      const newCartItem = new cartModel({ productId, userId, quantity: 1 });
      await newCartItem.save();

      res.json({ message: "Product added to cart", success: true, data: newCartItem });
    } catch (err) {
      res.status(400).json({ message: err.message, success: false });
    }
  },

  // View cart
  async viewCartProducts(req, res) {
    try {
      const products = await cartModel.find({ userId: req.userId }).populate("productId");
      res.json({ message: "Cart products", success: true, data: products });
    } catch (err) {
      res.status(400).json({ message: err.message, success: false });
    }
  },

  // Update cart quantity
  async updateCartProduct(req, res) {
    try {
      const { _id, quantity } = req.body;
      const updated = await cartModel.updateOne({ _id }, { quantity });
      res.json({ message: "Cart updated", success: true, data: updated });
    } catch (err) {
      res.status(400).json({ message: err.message, success: false });
    }
  },

  // Delete product from cart
  async deleteCartProduct(req, res) {
    try {
      const { _id } = req.body;
      const deleted = await cartModel.deleteOne({ userId: req.userId, _id });
      res.json({
        message: deleted.deletedCount ? "Product removed" : "Not found",
        success: !!deleted.deletedCount,
      });
    } catch (err) {
      res.status(400).json({ message: err.message, success: false });
    }
  },

  // Count cart items
  async countCartProducts(req, res) {
    try {
      const count = await cartModel.countDocuments({ userId: req.userId });
      res.json({ message: "Cart count", success: true, count });
    } catch (err) {
      res.status(400).json({ message: err.message, success: false });
    }
  },
};

module.exports = cartController;
