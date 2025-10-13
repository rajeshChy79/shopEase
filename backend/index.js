const express = require("express");
const app = express();
const connectDB = require("./config/connectDB");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const cors = require("cors");
require("dotenv").config();

// ✅ Use one consistent CORS config everywhere
const corsOptions = {
  origin: "https://shopease-frontend-raja.onrender.com", // or process.env.FRONTEND_URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ handle preflight

app.use(express.json());
app.use(cookieParser());

// ✅ Debug log to check the request origin (optional)
app.use((req, res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  next();
});

// API Routes
app.use("/api", router);

// Database & Server start
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
