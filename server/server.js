require("dotenv").config();


const express =
  require("express");

const cors =
  require("cors");

const cookieParser =
  require("cookie-parser");


// ==========================================
// DATABASE
// ==========================================

const connectDB =
  require("./config/db");


// ==========================================
// ROUTES
// ==========================================

const userRoutes =
  require("./routes/userRoutes");

const authRoutes =
  require("./routes/authRoutes");

const thoughtRoutes =
  require("./routes/thoughtRoutes");

const commentRoutes =
  require("./routes/commentRoutes");

const notificationRoutes =
  require("./routes/notificationRoutes");

const searchRoutes =
  require("./routes/searchRoutes");

const aiRoutes =
  require("./routes/aiRoutes");


// ==========================================
// MODERATION
// ==========================================

const {
  contentModeration,
} = require(
  "./middleware/contentModeration"
);


// ==========================================
// APP
// ==========================================

const app =
  express();


// ==========================================
// DATABASE
// ==========================================

connectDB();


// ==========================================
// CORS
// ==========================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL,

    credentials:
      true,
  })
);


// ==========================================
// BODY PARSING
// ==========================================

app.use(
  express.json({
    limit:
      "1mb",
  })
);


// ==========================================
// COOKIES
// ==========================================

app.use(
  cookieParser()
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
  "/api/health",
  (
    req,
    res
  ) => {
    res.json({
      status:
        "ok",

      message:
        "Unsaid API is running",
    });
  }
);


// ==========================================
// AUTH ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);


// ==========================================
// CONTENT MODERATION
// ==========================================
//
// IMPORTANT:
//
// This middleware runs BEFORE the
// thought/comment routes.
//
// Therefore:
// frontend moderation can be bypassed,
// but server moderation cannot.
//
app.use(
  "/api/thoughts",
  contentModeration
);

app.use(
  "/api/comments",
  contentModeration
);


// ==========================================
// THOUGHT ROUTES
// ==========================================

app.use(
  "/api/thoughts",
  thoughtRoutes
);


// ==========================================
// COMMENT ROUTES
// ==========================================

app.use(
  "/api/comments",
  commentRoutes
);


// ==========================================
// USER ROUTES
// ==========================================

app.use(
  "/api/users",
  userRoutes
);


// ==========================================
// NOTIFICATION ROUTES
// ==========================================

app.use(
  "/api/notifications",
  notificationRoutes
);


// ==========================================
// SEARCH ROUTES
// ==========================================

app.use(
  "/api/search",
  searchRoutes
);


// ==========================================
// AI ROUTES
// ==========================================

app.use(
  "/api/ai",
  aiRoutes
);


// ==========================================
// 404
// ==========================================

app.use(
  (
    req,
    res
  ) => {
    return res.status(404).json({
      message:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    console.error(
      "Unhandled server error:",
      error
    );


    return res.status(
      error.status ||
        500
    ).json({
      message:
        error.message ||
        "Internal server error",
    });
  }
);


// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT ||
  5000;


app.listen(
  PORT,
  () => {
    console.log(
      `Unsaid server running on http://localhost:${PORT}`
    );
  }
);