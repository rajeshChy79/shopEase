const express = require("express");
const app = express();
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const cors = require("cors");
require("dotenv").config();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api", router);

// Database & Server start
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
