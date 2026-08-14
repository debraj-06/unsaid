const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // No session cookie
    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    // JWT secret must exist
    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables"
      );

      return res.status(500).json({
        message: "Server authentication is not configured",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make sure token contains userId
    if (!decoded?.userId) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
};

module.exports = authMiddleware;