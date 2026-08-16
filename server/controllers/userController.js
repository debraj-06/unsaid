const bcrypt =
  require("bcryptjs");

const User =
  require("../models/User");

const Thought =
  require("../models/Thought");

const Comment =
  require("../models/Comment");

const createNotification =
  require("../utils/createNotification");


// ==========================================
// FORMAT USER
// ==========================================

const formatUser = (
  user,
  currentUserId = null,
  thoughtCount = 0
) => {
  const followers =
    Array.isArray(user.followers)
      ? user.followers
      : [];

  const following =
    Array.isArray(user.following)
      ? user.following
      : [];


  let isFollowing =
    false;

  let followsMe =
    false;


  if (currentUserId) {
    isFollowing =
      followers.some(
        (id) =>
          id.toString() ===
          currentUserId.toString()
      );


    followsMe =
      following.some(
        (id) =>
          id.toString() ===
          currentUserId.toString()
      );
  }


  return {
    id:
      user._id,

    username:
      user.username,

    bio:
      user.bio || "",

    createdAt:
      user.createdAt,

    thoughtCount:
      Number(
        thoughtCount || 0
      ),

    followersCount:
      followers.length,

    followingCount:
      following.length,

    isFollowing,

    followsMe,
  };
};


// ==========================================
// FORMAT THOUGHT
// ==========================================

const formatThought =
  async (
    thought,
    userId
  ) => {
    await thought.populate(
      "author",
      "username"
    );


    const likes =
      Array.isArray(
        thought.likes
      )
        ? thought.likes
        : [];


    const bookmarks =
      Array.isArray(
        thought.bookmarks
      )
        ? thought.bookmarks
        : [];


    const commentCount =
      await Comment.countDocuments({
        thought:
          thought._id,
      });


    return {
      id:
        thought._id,

      username:
        thought.author?.username ||
        "unknown",

      content:
        thought.content,

      likesCount:
        likes.length,

      likedByMe:
        likes.some(
          (id) =>
            id.toString() ===
            userId.toString()
        ),

      bookmarkedByMe:
        bookmarks.some(
          (id) =>
            id.toString() ===
            userId.toString()
        ),

      commentCount,

      createdAt:
        thought.createdAt,

      updatedAt:
        thought.updatedAt,
    };
  };


// ==========================================
// GET MY PROFILE
// ==========================================

const getMyProfile =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select(
          "_id username bio createdAt followers following"
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
        user:
          formatUser(
            user,
            req.userId,
            thoughtCount
          ),
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

const updateMyProfile =
  async (req, res) => {
    try {
      const bio =
        typeof req.body?.bio ===
        "string"
          ? req.body.bio.trim()
          : "";


      if (
        bio.length > 160
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
              bio,
            },
          },

          {
            new: true,
            runValidators: true,
          }
        ).select(
          "_id username bio createdAt followers following"
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
        user:
          formatUser(
            user,
            req.userId,
            thoughtCount
          ),
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

const changePassword =
  async (req, res) => {
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
        newPassword.length < 8
      ) {
        return res.status(400).json({
          message:
            "New password must be at least 8 characters",
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


      const valid =
        await bcrypt.compare(
          currentPassword,
          user.password
        );


      if (!valid) {
        return res.status(401).json({
          message:
            "Current password is incorrect",
        });
      }


      user.password =
        await bcrypt.hash(
          newPassword,
          12
        );


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

const getMyThoughts =
  async (req, res) => {
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
          });


      const formatted =
        await Promise.all(
          thoughts.map(
            (thought) =>
              formatThought(
                thought,
                req.userId
              )
          )
        );


      return res.json({
        thoughts:
          formatted,
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
  async (req, res) => {
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
          });


      const formatted =
        await Promise.all(
          thoughts.map(
            (thought) =>
              formatThought(
                thought,
                req.userId
              )
          )
        );


      return res.json({
        thoughts:
          formatted,
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
  async (req, res) => {
    try {
      const username =
        String(
          req.params.username || ""
        )
          .trim()
          .toLowerCase();


      if (!username) {
        return res.status(400).json({
          message:
            "Username is required",
        });
      }


      const user =
        await User.findOne({
          username,
        }).select(
          "_id username bio createdAt followers following"
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
          })
          .limit(30);


      const formattedThoughts =
        await Promise.all(
          thoughts.map(
            (thought) =>
              formatThought(
                thought,
                req.userId
              )
          )
        );


      return res.json({
        user:
          formatUser(
            user,
            req.userId,
            thoughtCount
          ),

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
  async (req, res) => {
    try {
      const username =
        String(
          req.params.username || ""
        )
          .trim()
          .toLowerCase();


      if (!username) {
        return res.status(400).json({
          message:
            "Username is required",
        });
      }


      const targetUser =
        await User.findOne({
          username,
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


      // --------------------------------------
      // ENSURE ARRAYS EXIST
      // --------------------------------------

      if (
        !Array.isArray(
          targetUser.followers
        )
      ) {
        targetUser.followers =
          [];
      }


      if (
        !Array.isArray(
          targetUser.following
        )
      ) {
        targetUser.following =
          [];
      }


      if (
        !Array.isArray(
          currentUser.followers
        )
      ) {
        currentUser.followers =
          [];
      }


      if (
        !Array.isArray(
          currentUser.following
        )
      ) {
        currentUser.following =
          [];
      }


      // --------------------------------------
      // CURRENT RELATIONSHIP
      // --------------------------------------

      const alreadyFollowing =
        targetUser.followers.some(
          (id) =>
            id.toString() ===
            req.userId.toString()
        );


      // ======================================
      // UNFOLLOW
      // ======================================

      if (alreadyFollowing) {
        targetUser.followers =
          targetUser.followers.filter(
            (id) =>
              id.toString() !==
              req.userId.toString()
          );


        currentUser.following =
          currentUser.following.filter(
            (id) =>
              id.toString() !==
              targetUser._id.toString()
          );


        await Promise.all([
          targetUser.save(),
          currentUser.save(),
        ]);


        const targetThoughtCount =
          await Thought.countDocuments({
            author:
              targetUser._id,
          });


        const isTargetFollowingMe =
          currentUser.followers.some(
            (id) =>
              id.toString() ===
              targetUser._id.toString()
          );


        return res.json({
          following:
            false,

          followsMe:
            isTargetFollowingMe,

          followersCount:
            targetUser.followers.length,

          followingCount:
            currentUser.following.length,

          user:
            formatUser(
              targetUser,
              req.userId,
              targetThoughtCount
            ),
        });
      }


      // ======================================
      // FOLLOW
      // ======================================

      const currentFollowingTarget =
        currentUser.following.some(
          (id) =>
            id.toString() ===
            targetUser._id.toString()
        );


      if (
        !currentFollowingTarget
      ) {
        currentUser.following.push(
          targetUser._id
        );
      }


      const targetHasCurrentFollower =
        targetUser.followers.some(
          (id) =>
            id.toString() ===
            req.userId.toString()
        );


      if (
        !targetHasCurrentFollower
      ) {
        targetUser.followers.push(
          req.userId
        );
      }


      await Promise.all([
        targetUser.save(),
        currentUser.save(),
      ]);


      // --------------------------------------
      // NOTIFICATION
      // --------------------------------------

      try {
        await createNotification({
          recipient:
            targetUser._id,

          sender:
            req.userId,

          type:
            "follow",
        });
      } catch (notificationError) {
        console.error(
          "Follow notification error:",
          notificationError
        );
      }


      const targetThoughtCount =
        await Thought.countDocuments({
          author:
            targetUser._id,
        });


      return res.json({
        following:
          true,

        followsMe:
          currentUser.followers.some(
            (id) =>
              id.toString() ===
              targetUser._id.toString()
          ),

        followersCount:
          targetUser.followers.length,

        followingCount:
          currentUser.following.length,

        user:
          formatUser(
            targetUser,
            req.userId,
            targetThoughtCount
          ),
      });
    } catch (error) {
      console.error(
        "Toggle follow error:",
        error
      );


      return res.status(500).json({
        message:
          "Something went wrong while updating the follow",
      });
    }
  };


// ==========================================
// GET PEOPLE LIST
// ==========================================

const getUserList =
  async (req, res) => {
    try {
      const type =
        req.params.type;


      if (
        type !== "followers" &&
        type !== "following"
      ) {
        return res.status(400).json({
          message:
            "Invalid user list type",
        });
      }


      const username =
        String(
          req.params.username || ""
        )
          .trim()
          .toLowerCase();


      if (!username) {
        return res.status(400).json({
          message:
            "Username is required",
        });
      }


      const user =
        await User.findOne({
          username,
        }).select(
          "_id username followers following"
        );


      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }


      const ids =
        type === "followers"
          ? user.followers || []
          : user.following || [];


      const people =
        await User.find({
          _id: {
            $in: ids,
          },
        }).select(
          "_id username bio followers following"
        );


      const result =
        people.map(
          (person) => ({
            id:
              person._id,

            username:
              person.username,

            bio:
              person.bio || "",

            followersCount:
              Array.isArray(
                person.followers
              )
                ? person.followers.length
                : 0,

            followingCount:
              Array.isArray(
                person.following
              )
                ? person.following.length
                : 0,

            isFollowing:
              Array.isArray(
                person.followers
              )
                ? person.followers.some(
                    (id) =>
                      id.toString() ===
                      req.userId.toString()
                  )
                : false,

            followsMe:
              Array.isArray(
                person.following
              )
                ? person.following.some(
                    (id) =>
                      id.toString() ===
                      req.userId.toString()
                  )
                : false,
          })
        );


      return res.json({
        type,

        username:
          user.username,

        count:
          ids.length,

        people:
          result,
      });
    } catch (error) {
      console.error(
        "Get user list error:",
        error
      );


      return res.status(500).json({
        message:
          "Something went wrong while loading users",
      });
    }
  };


// ==========================================
// GET FOLLOWERS
// ==========================================

const getFollowers =
  async (req, res) => {
    req.params.type =
      "followers";

    return getUserList(
      req,
      res
    );
  };


// ==========================================
// GET FOLLOWING
// ==========================================

const getFollowing =
  async (req, res) => {
    req.params.type =
      "following";

    return getUserList(
      req,
      res
    );
  };


// ==========================================
// FOLLOWING FEED
// ==========================================

const getFollowingFeed =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select(
          "following"
        );


      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }


      const following =
        Array.isArray(
          user.following
        )
          ? user.following
          : [];


      const thoughts =
        await Thought.find({
          author: {
            $in:
              following,
          },
        })
          .populate(
            "author",
            "username"
          )
          .sort({
            createdAt: -1,
          })
          .limit(50);


      const formatted =
        await Promise.all(
          thoughts.map(
            (thought) =>
              formatThought(
                thought,
                req.userId
              )
          )
        );


      return res.json({
        thoughts:
          formatted,
      });
    } catch (error) {
      console.error(
        "Following feed error:",
        error
      );


      return res.status(500).json({
        message:
          "Something went wrong while loading following feed",
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
  getFollowers,
  getFollowing,
  getFollowingFeed,
};