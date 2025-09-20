const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay"); // your Razorpay instance

// @desc   Create a new Razorpay order
// @route  POST /api/orders/create
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // amount in smallest unit (paise)
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    return res.status(201).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Server error creating order" });
  }
};

// @desc   Verify Razorpay payment
// @route  POST /api/orders/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("❌ Error verifying Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Server error verifying payment" });
  }
};
