const mongoose=require("mongoose");

const cartSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",   // MUST match the model name exactly
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"   // if you have a User model
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("addToCart", cartSchema);
