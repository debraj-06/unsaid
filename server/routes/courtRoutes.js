const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  createCourtCase,
  getOpenCourtCases,
  getCourtCase,
  voteOnCourtCase,
  getMyCourtCases,
} = require("../controllers/courtController");

const router =
  express.Router();

router.get(
  "/",
  authMiddleware,
  getOpenCourtCases
);

router.get(
  "/mine",
  authMiddleware,
  getMyCourtCases
);

router.post(
  "/",
  authMiddleware,
  createCourtCase
);

router.get(
  "/:id",
  authMiddleware,
  getCourtCase
);

router.post(
  "/:id/vote",
  authMiddleware,
  voteOnCourtCase
);

module.exports =
  router;