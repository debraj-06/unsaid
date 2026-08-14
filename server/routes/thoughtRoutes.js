const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createThought,
  getThoughts,
  getThoughtById,
  getNewThoughts,
  toggleLike,
  toggleBookmark,
  updateThought,
  deleteThought,
} = require("../controllers/thoughtController");

const router =
  express.Router();


// ==========================================
// GET ALL THOUGHTS
// ==========================================

router.get(
  "/",
  authMiddleware,
  getThoughts
);


// ==========================================
// CREATE THOUGHT
// ==========================================

router.post(
  "/",
  authMiddleware,
  createThought
);


// ==========================================
// GET NEW THOUGHTS
// ==========================================
// MUST COME BEFORE /:id
// ==========================================

router.get(
  "/new",
  authMiddleware,
  getNewThoughts
);


// ==========================================
// GET SINGLE THOUGHT
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getThoughtById
);


// ==========================================
// LIKE / UNLIKE
// ==========================================

router.patch(
  "/:id/like",
  authMiddleware,
  toggleLike
);


// ==========================================
// BOOKMARK / UNBOOKMARK
// ==========================================

router.patch(
  "/:id/bookmark",
  authMiddleware,
  toggleBookmark
);


// ==========================================
// UPDATE
// ==========================================

router.patch(
  "/:id",
  authMiddleware,
  updateThought
);


// ==========================================
// DELETE
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteThought
);


module.exports = router;