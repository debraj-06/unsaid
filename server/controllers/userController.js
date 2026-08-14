const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Thought = require("../models/Thought");
const Comment = require("../models/Comment");

const createNotification =
  require("../utils/createNotification");


// ==========================================
// GET MY PROFILE
// ==========================================

const getMyProfile = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.userId
      ).select(
        "_id username bio following createdAt"
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    const thoughtCount =
      await Thought.countDocuments({
        author:
          user._id,
      });

    return res.json({
      user: {
        id:
          user._id,

        username:
          user.username,

        bio:
          user.bio || "",

        followingCount:
          user.following?.length ||
          0,

        createdAt:
          user.createdAt,

        thoughtCount,
      },
    });
  } catch (error) {
    console.error(
      "Get my profile error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while loading your profile",
    });
  }
};


// ==========================================
// UPDATE MY PROFILE
// ==========================================

const updateMyProfile = async (
  req,
  res
) => {
  try {
    const { bio } =
      req.body;

    if (
      typeof bio !==
      "string"
    ) {
      return res.status(400).json({
        message:
          "Bio must be text",
      });
    }

    const cleanBio =
      bio.trim();

    if (
      cleanBio.length >
      160
    ) {
      return res.status(400).json({
        message:
          "Bio cannot exceed 160 characters",
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.userId,
        {
          $set: {
            bio:
              cleanBio,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      ).select(
        "_id username bio following createdAt"
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    const thoughtCount =
      await Thought.countDocuments({
        author:
          user._id,
      });

    return res.json({
      user: {
        id:
          user._id,

        username:
          user.username,

        bio:
          user.bio || "",

        followingCount:
          user.following?.length ||
          0,

        createdAt:
          user.createdAt,

        thoughtCount,
      },
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while updating your profile",
    });
  }
};


// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        message:
          "All password fields are required",
      });
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        message:
          "New passwords do not match",
      });
    }

    if (
      newPassword.length <
      8
    ) {
      return res.status(400).json({
        message:
          "New password must be at least 8 characters",
      });
    }

    if (
      currentPassword ===
      newPassword
    ) {
      return res.status(400).json({
        message:
          "New password must be different from your current password",
      });
    }

    const user =
      await User.findById(
        req.userId
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        message:
          "Current password is incorrect",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    user.password =
      hashedPassword;

    await user.save();

    return res.json({
      message:
        "Password changed successfully",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while changing your password",
    });
  }
};


// ==========================================
// GET MY THOUGHTS
// ==========================================

const getMyThoughts = async (
  req,
  res
) => {
  try {
    const thoughts =
      await Thought.find({
        author:
          req.userId,
      })
        .populate(
          "author",
          "username"
        )
        .sort({
          createdAt: -1,
          _id: -1,
        });

    const thoughtIds =
      thoughts.map(
        (thought) =>
          thought._id
      );

    const commentCounts =
      thoughtIds.length > 0
        ? await Comment.aggregate([
            {
              $match: {
                thought: {
                  $in: thoughtIds,
                },
              },
            },
            {
              $group: {
                _id:
                  "$thought",

                count: {
                  $sum: 1,
                },
              },
            },
          ])
        : [];

    const commentCountMap =
      new Map(
        commentCounts.map(
          (item) => [
            item._id.toString(),
            item.count,
          ]
        )
      );

    const formattedThoughts =
      thoughts.map(
        (thought) => {
          const likes =
            thought.likes || [];

          const bookmarks =
            thought.bookmarks || [];

          return {
            id:
              thought._id,

            username:
              thought.author.username,

            content:
              thought.content,

            likesCount:
              likes.length,

            likedByMe:
              likes.some(
                (userId) =>
                  userId.toString() ===
                  req.userId.toString()
              ),

            commentCount:
              commentCountMap.get(
                thought._id.toString()
              ) || 0,

            bookmarkedByMe:
              bookmarks.some(
                (userId) =>
                  userId.toString() ===
                  req.userId.toString()
              ),

            createdAt:
              thought.createdAt,

            updatedAt:
              thought.updatedAt,
          };
        }
      );

    return res.json({
      thoughts:
        formattedThoughts,
    });
  } catch (error) {
    console.error(
      "Get my thoughts error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while loading your thoughts",
    });
  }
};


// ==========================================
// GET MY BOOKMARKS
// ==========================================

const getMyBookmarks =
  async (
    req,
    res
  ) => {
    try {
      const thoughts =
        await Thought.find({
          bookmarks:
            req.userId,
        })
          .populate(
            "author",
            "username"
          )
          .sort({
            createdAt: -1,
            _id: -1,
          });

      const thoughtIds =
        thoughts.map(
          (thought) =>
            thought._id
        );

      const commentCounts =
        thoughtIds.length > 0
          ? await Comment.aggregate([
              {
                $match: {
                  thought: {
                    $in: thoughtIds,
                  },
                },
              },
              {
                $group: {
                  _id:
                    "$thought",

                  count: {
                    $sum: 1,
                  },
                },
              },
            ])
          : [];

      const commentCountMap =
        new Map(
          commentCounts.map(
            (item) => [
              item._id.toString(),
              item.count,
            ]
          )
        );

      const formattedThoughts =
        thoughts.map(
          (thought) => {
            const likes =
              thought.likes ||
              [];

            return {
              id:
                thought._id,

              username:
                thought.author
                  .username,

              content:
                thought.content,

              likesCount:
                likes.length,

              likedByMe:
                likes.some(
                  (userId) =>
                    userId.toString() ===
                    req.userId.toString()
                ),

              commentCount:
                commentCountMap.get(
                  thought._id.toString()
                ) || 0,

              bookmarkedByMe:
                true,

              createdAt:
                thought.createdAt,

              updatedAt:
                thought.updatedAt,
            };
          }
        );

      return res.json({
        thoughts:
          formattedThoughts,
      });
    } catch (error) {
      console.error(
        "Get bookmarks error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while loading saved thoughts",
      });
    }
  };


// ==========================================
// GET PUBLIC PROFILE
// ==========================================

const getPublicProfile =
  async (
    req,
    res
  ) => {
    try {
      const {
        username,
      } = req.params;

      const user =
        await User.findOne({
          username:
            username.toLowerCase(),
        }).select(
          "_id username bio following createdAt"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const isOwnProfile =
        user._id.toString() ===
        req.userId.toString();

      const isFollowing =
        !isOwnProfile &&
        (
          user.following ||
          []
        ).some(
          (followingId) =>
            followingId.toString() ===
            req.userId.toString()
        );

      const thoughtCount =
        await Thought.countDocuments({
          author:
            user._id,
        });

      const thoughts =
        await Thought.find({
          author:
            user._id,
        })
          .populate(
            "author",
            "username"
          )
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .limit(20);

      const thoughtIds =
        thoughts.map(
          (thought) =>
            thought._id
        );

      const commentCounts =
        thoughtIds.length > 0
          ? await Comment.aggregate([
              {
                $match: {
                  thought: {
                    $in: thoughtIds,
                  },
                },
              },
              {
                $group: {
                  _id:
                    "$thought",

                  count: {
                    $sum: 1,
                  },
                },
              },
            ])
          : [];

      const commentCountMap =
        new Map(
          commentCounts.map(
            (item) => [
              item._id.toString(),
              item.count,
            ]
          )
        );

      const formattedThoughts =
        thoughts.map(
          (thought) => {
            const likes =
              thought.likes ||
              [];

            const bookmarks =
              thought.bookmarks ||
              [];

            return {
              id:
                thought._id,

              username:
                thought.author
                  .username,

              content:
                thought.content,

              likesCount:
                likes.length,

              likedByMe:
                likes.some(
                  (userId) =>
                    userId.toString() ===
                    req.userId.toString()
                ),

              commentCount:
                commentCountMap.get(
                  thought._id.toString()
                ) || 0,

              bookmarkedByMe:
                bookmarks.some(
                  (userId) =>
                    userId.toString() ===
                    req.userId.toString()
                ),

              createdAt:
                thought.createdAt,

              updatedAt:
                thought.updatedAt,
            };
          }
        );

      return res.json({
        user: {
          id:
            user._id,

          username:
            user.username,

          bio:
            user.bio || "",

          createdAt:
            user.createdAt,

          thoughtCount,

          isOwnProfile,

          isFollowing,
        },

        thoughts:
          formattedThoughts,
      });
    } catch (error) {
      console.error(
        "Get public profile error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while loading the profile",
      });
    }
  };


// ==========================================
// FOLLOW / UNFOLLOW
// ==========================================

const toggleFollow =
  async (
    req,
    res
  ) => {
    try {
      const {
        username,
      } = req.params;

      const targetUser =
        await User.findOne({
          username:
            username.toLowerCase(),
        });

      if (!targetUser) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      if (
        targetUser._id.toString() ===
        req.userId.toString()
      ) {
        return res.status(400).json({
          message:
            "You cannot follow yourself",
        });
      }

      const currentUser =
        await User.findById(
          req.userId
        );

      if (!currentUser) {
        return res.status(404).json({
          message:
            "Current user not found",
        });
      }

      if (
        !Array.isArray(
          currentUser.following
        )
      ) {
        currentUser.following = [];
      }

      const existingIndex =
        currentUser.following.findIndex(
          (userId) =>
            userId.toString() ===
            targetUser._id.toString()
        );

      let following;

      if (
        existingIndex !== -1
      ) {
        currentUser.following.splice(
          existingIndex,
          1
        );

        following = false;
      } else {
        currentUser.following.push(
          targetUser._id
        );

        following = true;
      }

      await currentUser.save();

      if (following) {
        await createNotification({
          recipient:
            targetUser._id,

          sender:
            req.userId,

          type:
            "follow",
        });
      }

      return res.json({
        following,
      });
    } catch (error) {
      console.error(
        "Toggle follow error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while following this user",
      });
    }
  };


// ==========================================
// GET FOLLOWING FEED - INFINITE STREAM
// ==========================================

const getFollowingFeed =
  async (
    req,
    res
  ) => {
    try {
      const limit = Math.min(
        Math.max(
          Number(
            req.query.limit
          ) || 10,
          1
        ),
        20
      );

      const cursor =
        req.query.cursor ||
        null;

      const currentUser =
        await User.findById(
          req.userId
        ).select(
          "following"
        );

      if (!currentUser) {
        return res.status(404).json({
          message:
            "Current user not found",
        });
      }

      const following =
        currentUser.following ||
        [];

      if (
        following.length ===
        0
      ) {
        return res.json({
          thoughts: [],
          nextCursor: null,
          hasMore: false,
        });
      }

      const query = {
        author: {
          $in: following,
        },
      };

      // ======================================
      // CURSOR
      // ======================================

      if (cursor) {
        try {
          const decoded =
            JSON.parse(
              Buffer.from(
                cursor,
                "base64"
              ).toString(
                "utf8"
              )
            );

          const cursorDate =
            new Date(
              decoded.createdAt
            );

          const cursorId =
            decoded.id;

          if (
            !Number.isNaN(
              cursorDate.getTime()
            ) &&
            cursorId
          ) {
            query.$or = [
              {
                createdAt: {
                  $lt: cursorDate,
                },
              },
              {
                createdAt:
                  cursorDate,

                _id: {
                  $lt:
                    cursorId,
                },
              },
            ];
          }
        } catch (error) {
          return res.status(400).json({
            message:
              "Invalid feed cursor",
          });
        }
      }

      // ======================================
      // FETCH ONE EXTRA
      // ======================================

      const thoughts =
        await Thought.find(
          query
        )
          .populate(
            "author",
            "username"
          )
          .sort({
            createdAt: -1,
            _id: -1,
          })
          .limit(
            limit + 1
          );

      const hasMore =
        thoughts.length >
        limit;

      const visibleThoughts =
        hasMore
          ? thoughts.slice(
              0,
              limit
            )
          : thoughts;

      // ======================================
      // COMMENT COUNTS
      // ======================================

      const thoughtIds =
        visibleThoughts.map(
          (thought) =>
            thought._id
        );

      const commentCounts =
        thoughtIds.length > 0
          ? await Comment.aggregate([
              {
                $match: {
                  thought: {
                    $in: thoughtIds,
                  },
                },
              },
              {
                $group: {
                  _id:
                    "$thought",

                  count: {
                    $sum: 1,
                  },
                },
              },
            ])
          : [];

      const commentCountMap =
        new Map(
          commentCounts.map(
            (item) => [
              item._id.toString(),
              item.count,
            ]
          )
        );

      // ======================================
      // FORMAT
      // ======================================

      const formattedThoughts =
        visibleThoughts.map(
          (thought) => {
            const likes =
              thought.likes ||
              [];

            const bookmarks =
              thought.bookmarks ||
              [];

            return {
              id:
                thought._id,

              username:
                thought.author
                  .username,

              content:
                thought.content,

              likesCount:
                likes.length,

              likedByMe:
                likes.some(
                  (userId) =>
                    userId.toString() ===
                    req.userId.toString()
                ),

              commentCount:
                commentCountMap.get(
                  thought._id.toString()
                ) || 0,

              bookmarkedByMe:
                bookmarks.some(
                  (userId) =>
                    userId.toString() ===
                    req.userId.toString()
                ),

              createdAt:
                thought.createdAt,

              updatedAt:
                thought.updatedAt,
            };
          }
        );

      // ======================================
      // NEXT CURSOR
      // ======================================

      let nextCursor =
        null;

      if (
        hasMore &&
        visibleThoughts.length >
          0
      ) {
        const lastThought =
          visibleThoughts[
            visibleThoughts.length -
              1
          ];

        nextCursor =
          Buffer.from(
            JSON.stringify({
              createdAt:
                lastThought.createdAt,

              id:
                lastThought._id.toString(),
            })
          ).toString(
            "base64"
          );
      }

      return res.json({
        thoughts:
          formattedThoughts,

        nextCursor,

        hasMore,
      });
    } catch (error) {
      console.error(
        "Get following feed error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while loading your following feed",
      });
    }
  };


module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getMyThoughts,
  getMyBookmarks,
  getPublicProfile,
  toggleFollow,
  getFollowingFeed,
};