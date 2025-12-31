const uploadProductPermission = require("../helpers/permission");
const orderModel = require("../models/orderModel");
const razorpay = require("../config/razorpay");
// POST /api/order/create
// POST /api/order/create
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    let razorpayOrder = null;

    if (paymentMethod !== "cod") {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // ✅ ALWAYS paise
        currency: "INR",
        receipt: "order_" + Date.now(),
      });
    }

    const order = new orderModel({
      user: req.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderStatus: paymentMethod === "cod" ? "placed" : "processing",
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      razorpayOrderId: razorpayOrder?.id || null,
      key: process.env.RAZORPAY_KEY_ID,
    });

    await order.save();

    res.status(201).json({
      success: true,
      data: order,
      razorpayOrder,
    });
  } catch (error) {
    console.error("❌ Create order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/order/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'productName productImage sellingPrice');

    const formatted = orders.map(o => ({
      _id: o._id,
      orderNumber: `ORD-${o.createdAt.getFullYear()}-${o._id.toString().slice(-4)}`,
      date: o.createdAt,
      status: o.orderStatus,
      total: o.totalAmount,
      shippingAddress: o.shippingAddress,
      items: o.items
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// POST /api/order/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // 🔹 Normally verify with Razorpay/Stripe here
    order.paymentStatus = "paid";
    order.orderStatus = "placed";
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/order/all-orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    console.log("hi")
    // Optionally, check if user is admin here (if you have req.isAdmin)
    if (!(await uploadProductPermission(req.userId))) {
      throw new Error("Permission Denied");
    }
    const orders = await orderModel
      .find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.productId', 'productName productImage sellingPrice');

const formatted = orders.map(o => ({
  _id: o._id,
  orderNumber: `ORD-${o.createdAt.getFullYear()}-${o._id.toString().slice(-4)}`,
  createdAt: o.createdAt,
  status: o.orderStatus,
  total: o.totalAmount,
  shippingAddress: o.shippingAddress,
  items: o.items,
  userId: o.user,   // 👈 rename here
  paymentMethod: o.paymentMethod,
  paymentStatus: o.paymentStatus
}));


    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/order/update-status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Order ID and status are required" });
    }
    // Optionally, check if user is admin here (if you have req.isAdmin)
    if (!(await uploadProductPermission(req.userId))) {
      throw new Error("Permission Denied");
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    order.orderStatus = status;
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

