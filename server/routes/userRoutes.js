const express =
  require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getMyThoughts,
  getMyBookmarks,
  getPublicProfile,
  toggleFollow,
  getFollowingFeed,
} = require("../controllers/userController");


const router =
  express.Router();


// ==========================================
// MY PROFILE
// ==========================================

router.get(
  "/me",
  authMiddleware,
  getMyProfile
);


// ==========================================
// UPDATE PROFILE
// ==========================================

router.patch(
  "/me",
  authMiddleware,
  updateMyProfile
);


// ==========================================
// CHANGE PASSWORD
// ==========================================

router.patch(
  "/me/password",
  authMiddleware,
  changePassword
);


// ==========================================
// MY THOUGHTS
// ==========================================

router.get(
  "/me/thoughts",
  authMiddleware,
  getMyThoughts
);


// ==========================================
// MY BOOKMARKS
// ==========================================

router.get(
  "/me/bookmarks",
  authMiddleware,
  getMyBookmarks
);


// ==========================================
// FOLLOWING FEED
// ==========================================

router.get(
  "/me/following-feed",
  authMiddleware,
  getFollowingFeed
);


// ==========================================
// FOLLOW / UNFOLLOW
// ==========================================

router.patch(
  "/:username/follow",
  authMiddleware,
  toggleFollow
);


// ==========================================
// PUBLIC PROFILE
// ==========================================

router.get(
  "/:username",
  authMiddleware,
  getPublicProfile
);


module.exports =
  router;