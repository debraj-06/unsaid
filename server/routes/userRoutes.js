const express = require("express");

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
  getFollowers,
  getFollowing,
  getFollowingFeed,
} = require("../controllers/userController");

const User =
  require("../models/User");

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
// MY FOLLOWERS
// ==========================================

router.get(
  "/me/followers",
  authMiddleware,
  async (req, res, next) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select(
          "username"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      req.params.username =
        user.username;

      return getFollowers(
        req,
        res
      );
    } catch (error) {
      return next(error);
    }
  }
);


// ==========================================
// MY FOLLOWING
// ==========================================

router.get(
  "/me/following",
  authMiddleware,
  async (req, res, next) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select(
          "username"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      req.params.username =
        user.username;

      return getFollowing(
        req,
        res
      );
    } catch (error) {
      return next(error);
    }
  }
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
// UPDATE MY PROFILE
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
// FOLLOW / UNFOLLOW
// ==========================================

router.patch(
  "/:username/follow",
  authMiddleware,
  toggleFollow
);


// ==========================================
// PUBLIC USER FOLLOWERS
// ==========================================

router.get(
  "/:username/followers",
  authMiddleware,
  getFollowers
);


// ==========================================
// PUBLIC USER FOLLOWING
// ==========================================

router.get(
  "/:username/following",
  authMiddleware,
  getFollowing
);


// ==========================================
// PUBLIC PROFILE
// ==========================================

router.get(
  "/:username",
  authMiddleware,
  getPublicProfile
);


// ==========================================
// EXPORT
// ==========================================

module.exports =
  router;