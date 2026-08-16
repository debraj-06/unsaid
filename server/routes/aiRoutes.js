const express =
  require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  improveThought,
  aiHealth,
} =
  require("../controllers/aiController");


const router =
  express.Router();


// ==========================================
// AI HEALTH
// ==========================================

router.get(
  "/health",
  authMiddleware,
  aiHealth
);


// ==========================================
// IMPROVE THOUGHT
// ==========================================

router.post(
  "/improve-thought",
  authMiddleware,
  improveThought
);


module.exports =
  router;