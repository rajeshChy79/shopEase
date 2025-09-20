const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    products: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
        seller: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentId: { type: String }, //  Will be updated after payment success
    orderStatus: {
      orderConfirmed: { type: Date, default: Date.now },
      delivered: { type: Date },
      returnPolicyEnds: { type: Date },
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Credit Card", "Debit Card", "Net Banking", "COD"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"], //  Fixed valid enum values
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
