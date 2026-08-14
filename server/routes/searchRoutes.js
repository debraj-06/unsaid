const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  universalSearch,
  explore,
} = require("../controllers/searchController");

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
// DISCOVER / EXPLORE
// ==========================================

router.get(
  "/explore",
  authMiddleware,
  explore
);


module.exports = router;