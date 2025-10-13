const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6, // good practice
    },

    profilePic: {
      type: String,
      default: '', // optional, prevents undefined
    },

    role: {
      type: String,
      enum: ['GENERAL', 'admin'], // only allow valid roles
      default: 'GENERAL',
    },

    isActive: {
      type: Boolean,
      default: true, // supports activate/deactivate feature
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
