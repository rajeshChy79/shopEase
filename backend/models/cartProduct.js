const mongoose=require("mongoose");

const cartSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
    ref: "Product",   // MUST match the model name exactly
=======
    ref: "Product",
>>>>>>> 9112b7566f17d0df0401e582f3cf558ac5dbff48
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
    ref: "User"   // if you have a User model
=======
    ref: "User"
>>>>>>> 9112b7566f17d0df0401e582f3cf558ac5dbff48
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("addToCart", cartSchema);
