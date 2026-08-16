const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  universalSearch,
  mentionSearch,
  explore,
} = require(
  "../controllers/searchController"
);

const router =
  express.Router();


// ==========================================
// UNIVERSAL SEARCH
// ==========================================

router.get(
  "/",
  authMiddleware,
  universalSearch
);


// ==========================================
// MENTION SEARCH
// ==========================================

router.get(
  "/mentions",
  authMiddleware,
  mentionSearch
);


// ==========================================
// DISCOVER / EXPLORE
// ==========================================

router.get(
  "/explore",
  authMiddleware,
  explore
);


// ==========================================
// EXPORT
// ==========================================

module.exports =
  router;