const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log(`MongoDB not connected: ${err.message}`);
    process.exit(1); // Exit if DB connection fails
  }
}

module.exports = connectDB;
