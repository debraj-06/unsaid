const express =
  require("express");

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  getExperienceMatches,
} = require(
  "../controllers/experienceController"
);


const router =
  express.Router();


// ==========================================
// GET ANONYMOUS EXPERIENCE MATCHES
// ==========================================

router.get(
  "/:thoughtId",
  authMiddleware,
  getExperienceMatches
);


module.exports =
  router;