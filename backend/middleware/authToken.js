const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "User not logged in",
        error: true,
        success: false,
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token",
          error: true,
          success: false,
        });
      }

      if (!decoded?._id) {
        return res.status(403).json({
          message: "Invalid token data: Missing user ID",
          error: true,
          success: false,
        });
      }

      req.userId = decoded._id; // attach userId to request
      next();
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || "Something went wrong in auth middleware",
      error: true,
      success: false,
    });
  }
}

module.exports = authToken;
