const express =
  require("express");

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  createCourtCase,
  getOpenCourtCases,
  getCourtCase,
  voteOnCourtCase,
  getMyCourtCases,
} = require(
  "../controllers/courtController"
);


const router =
  express.Router();


// ==========================================
// COURT FEED
// ==========================================

router.get(
  "/",
  authMiddleware,
  getOpenCourtCases
);


// ==========================================
// MY CASES
// ==========================================

router.get(
  "/mine",
  authMiddleware,
  getMyCourtCases
);


// ==========================================
// CREATE CASE
// ==========================================

router.post(
  "/",
  authMiddleware,
  createCourtCase
);


// ==========================================
// GET SINGLE CASE
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getCourtCase
);


// ==========================================
// VOTE
// ==========================================

router.post(
  "/:id/vote",
  authMiddleware,
  voteOnCourtCase
);


module.exports =
  router;