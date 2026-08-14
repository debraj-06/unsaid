const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getComments,
  createComment,
  updateComment,
  toggleCommentLike,
  deleteComment,
} = require("../controllers/commentController");

const router =
  express.Router();


// ==========================================
// GET COMMENTS
// ==========================================

router.get(
  "/:thoughtId",
  authMiddleware,
  getComments
);


// ==========================================
// CREATE COMMENT / REPLY
// ==========================================

router.post(
  "/:thoughtId",
  authMiddleware,
  createComment
);


// ==========================================
// LIKE / UNLIKE COMMENT
// ==========================================

router.patch(
  "/:id/like",
  authMiddleware,
  toggleCommentLike
);


// ==========================================
// UPDATE COMMENT
// ==========================================

router.patch(
  "/:id",
  authMiddleware,
  updateComment
);


// ==========================================
// DELETE COMMENT
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteComment
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;