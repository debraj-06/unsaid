const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  improveThought,
} = require("../controllers/aiController");

const router =
  express.Router();


// ==========================================
// IMPROVE THOUGHT
// ==========================================

router.post(
  "/improve-thought",
  authMiddleware,
  improveThought
);


module.exports = router;