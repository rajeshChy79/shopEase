const mongoose = require("mongoose");
const User = require("../models/userModel");

// ✅ Direct MongoDB URI (TEMPORARY)
const MONGO_URI =
  "mongodb+srv://rajesh:mern123@mern-ecommerce-website.xbwcg.mongodb.net/?retryWrites=true&w=majority&appName=mern-ecommerce-website";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected to DB");

    const result = await User.updateMany(
      { wishlist: { $exists: false } },
      { $set: { wishlist: [] } }
    );

    console.log("Updated users:", result.modifiedCount);
    process.exit(0);
  })
  .catch((err) => {
    console.error("DB error:", err.message);
    process.exit(1);
  });
