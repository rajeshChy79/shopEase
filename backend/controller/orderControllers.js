const orderModel = require("../models/orderModel");
// POST /api/order/create
// POST /api/order/create
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, order_id} = req.body;
    console.log(req.userId);
    console.log("Creating order with data:", { items, shippingAddress, paymentMethod, totalAmount });

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in order" });
    }

    const order = new orderModel({
      user: req.userId,  // ✅ comes from authToken middleware
      items,             // ✅ matches schema
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderStatus: paymentMethod === "cod" ? "placed" : "processing",
      paymentStatus: "pending",
      key: process.env.RAZORPAY_KEY_ID ,// 🔹 For Razorpay integration
      razorpayOrderId: order_id
    });
    console.log(order);

    await order.save();

    if (paymentMethod === "cod") {
      return res.status(201).json({ success: true, data: order });
    } else {
      // 🔹 Add Razorpay/Stripe integration here
      return res.status(201).json({
        success: true,
        data: order,
        payment: "Initiate online payment"
      });
    }
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

