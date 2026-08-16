require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const thoughtRoutes = require("./routes/thoughtRoutes");
const commentRoutes = require("./routes/commentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const searchRoutes = require("./routes/searchRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(cookieParser());


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Unsaid API is running",
  });
});


// ==========================================
// ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/thoughts", thoughtRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/users", userRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/ai", aiRoutes);


// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Unsaid API running on port ${PORT}`);
});