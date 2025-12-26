const mongoose=require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  paymentMethod: { type: String, enum: ["cod", "card"], default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, enum: ["placed", "processing", "shipped", "delivered"], default: "placed" },
  key: { type: String },
  razorpayOrderId: {type: String},
  createdAt: { type: Date, default: Date.now }
});

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;