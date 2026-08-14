const Thought = require("../models/Thought");
const Comment = require("../models/Comment");

const createNotification =
  require("../utils/createNotification");


// ==========================================
// CREATE THOUGHT
// ==========================================

const createThought = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Thought cannot be empty",
      });
    }

    const cleanContent = content.trim();

    if (cleanContent.length > 1000) {
      return res.status(400).json({
        message:
          "Thought cannot exceed 1000 characters",
      });
    }

    const thought = await Thought.create({
      author: req.userId,
      content: cleanContent,
      likes: [],
      bookmarks: [],
    });

    await thought.populate(
      "author",
      "username"
    );

    return res.status(201).json({
      thought: {
        id: thought._id,
        username: thought.author.username,
        content: thought.content,
        likesCount: 0,
        likedByMe: false,
        commentCount: 0,
        bookmarkedByMe: false,
        createdAt: thought.createdAt,
        updatedAt: thought.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Create thought error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while creating the thought",
    });
  }
};


// ==========================================
// GET THOUGHTS - INFINITE STREAM
// ==========================================

const getThoughts = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      20
    );

    const cursor =
      req.query.cursor || null;

    const query = {};

    // ========================================
    // CURSOR
    // ========================================

    if (cursor) {
      try {
        const decoded = JSON.parse(
          Buffer.from(
            cursor,
            "base64"
          ).toString("utf8")
        );

        const cursorDate = new Date(
          decoded.createdAt
        );

        const cursorId = decoded.id;

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
              createdAt: cursorDate,
              _id: {
                $lt: cursorId,
              },
            },
          ];
        }
      } catch (error) {
        return res.status(400).json({
          message: "Invalid feed cursor",
        });
      }
    }

    // ========================================
    // GET ONE EXTRA
    // ========================================

    const thoughts =
      await Thought.find(query)
        .populate(
          "author",
          "username"
        )
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .limit(limit + 1);

    const hasMore =
      thoughts.length > limit;

    const visibleThoughts =
      hasMore
        ? thoughts.slice(0, limit)
        : thoughts;

    // ========================================
    // COMMENT COUNTS
    // ========================================

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
                _id: "$thought",
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

    // ========================================
    // FORMAT
    // ========================================

    const formattedThoughts =
      visibleThoughts.map(
        (thought) => {
          const likes =
            thought.likes || [];

          const bookmarks =
            thought.bookmarks || [];

          return {
            id: thought._id,

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

    // ========================================
    // NEXT CURSOR
    // ========================================

    let nextCursor = null;

    if (
      hasMore &&
      visibleThoughts.length > 0
    ) {
      const lastThought =
        visibleThoughts[
          visibleThoughts.length - 1
        ];

      nextCursor =
        Buffer.from(
          JSON.stringify({
            createdAt:
              lastThought.createdAt,
            id:
              lastThought._id.toString(),
          })
        ).toString("base64");
    }

    return res.json({
      thoughts:
        formattedThoughts,

      nextCursor,

      hasMore,
    });
  } catch (error) {
    console.error(
      "Get thoughts error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while loading thoughts",
    });
  }
};


// ==========================================
// GET SINGLE THOUGHT
// ==========================================

const getThoughtById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const thought =
      await Thought.findById(id).populate(
        "author",
        "username"
      );

    if (!thought) {
      return res.status(404).json({
        message:
          "Thought not found",
      });
    }

    const commentCount =
      await Comment.countDocuments({
        thought: thought._id,
      });

    const likes =
      thought.likes || [];

    const bookmarks =
      thought.bookmarks || [];

    return res.json({
      thought: {
        id: thought._id,

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

        commentCount,

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
      },
    });
  } catch (error) {
    console.error(
      "Get thought by ID error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while loading the thought",
    });
  }
};


// ==========================================
// LIKE / UNLIKE
// ==========================================

const toggleLike = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const thought =
      await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        message:
          "Thought not found",
      });
    }

    if (!Array.isArray(thought.likes)) {
      thought.likes = [];
    }

    const existingLikeIndex =
      thought.likes.findIndex(
        (userId) =>
          userId.toString() ===
          req.userId.toString()
      );

    let liked;

    if (
      existingLikeIndex !==
      -1
    ) {
      thought.likes.splice(
        existingLikeIndex,
        1
      );

      liked = false;
    } else {
      thought.likes.push(
        req.userId
      );

      liked = true;
    }

    await thought.save();

    if (liked) {
      await createNotification({
        recipient:
          thought.author,

        sender:
          req.userId,

        type:
          "thought_like",

        thought:
          thought._id,
      });
    }

    return res.json({
      liked,
      likesCount:
        thought.likes.length,
    });
  } catch (error) {
    console.error(
      "Like error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while liking the thought",
    });
  }
};


// ==========================================
// SAVE / UNSAVE
// ==========================================

const toggleBookmark = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const thought =
      await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        message:
          "Thought not found",
      });
    }

    if (
      !Array.isArray(
        thought.bookmarks
      )
    ) {
      thought.bookmarks = [];
    }

    const existingBookmarkIndex =
      thought.bookmarks.findIndex(
        (userId) =>
          userId.toString() ===
          req.userId.toString()
      );

    let bookmarked;

    if (
      existingBookmarkIndex !==
      -1
    ) {
      thought.bookmarks.splice(
        existingBookmarkIndex,
        1
      );

      bookmarked = false;
    } else {
      thought.bookmarks.push(
        req.userId
      );

      bookmarked = true;
    }

    await thought.save();

    return res.json({
      bookmarked,
    });
  } catch (error) {
    console.error(
      "Toggle bookmark error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while saving the thought",
    });
  }
};


// ==========================================
// EDIT THOUGHT
// ==========================================

const updateThought = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const { content } =
      req.body;

    if (
      !content ||
      !content.trim()
    ) {
      return res.status(400).json({
        message:
          "Thought cannot be empty",
      });
    }

    const cleanContent =
      content.trim();

    if (
      cleanContent.length >
      1000
    ) {
      return res.status(400).json({
        message:
          "Thought cannot exceed 1000 characters",
      });
    }

    const thought =
      await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        message:
          "Thought not found",
      });
    }

    if (
      thought.author.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own thoughts",
      });
    }

    thought.content =
      cleanContent;

    await thought.save();

    await thought.populate(
      "author",
      "username"
    );

    const commentCount =
      await Comment.countDocuments({
        thought:
          thought._id,
      });

    const likes =
      thought.likes || [];

    const bookmarks =
      thought.bookmarks || [];

    return res.json({
      thought: {
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

        commentCount,

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
      },
    });
  } catch (error) {
    console.error(
      "Update thought error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while editing the thought",
    });
  }
};


// ==========================================
// DELETE THOUGHT
// ==========================================

const deleteThought = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const thought =
      await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        message:
          "Thought not found",
      });
    }

    if (
      thought.author.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own thoughts",
      });
    }

    await Comment.deleteMany({
      thought:
        thought._id,
    });

    await thought.deleteOne();

    return res.json({
      message:
        "Thought deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete thought error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while deleting the thought",
    });
  }
};
// ==========================================
// GET NEW THOUGHTS
// ==========================================
// Returns thoughts created AFTER the given
// cursor. Used for the live "new thoughts"
// buffer.
//
// Query:
// /api/thoughts/new?after=<cursor>
// ==========================================

const getNewThoughts = async (req, res) => {
  try {
    const after = req.query.after;

    if (!after) {
      return res.status(400).json({
        message: "Missing feed cursor",
      });
    }

    // ========================================
    // DECODE CURSOR
    // ========================================

    let decoded;

    try {
      decoded = JSON.parse(
        Buffer.from(
          after,
          "base64"
        ).toString("utf8")
      );
    } catch (error) {
      return res.status(400).json({
        message: "Invalid feed cursor",
      });
    }

    const cursorDate = new Date(
      decoded.createdAt
    );

    const cursorId = decoded.id;

    if (
      Number.isNaN(
        cursorDate.getTime()
      ) ||
      !cursorId
    ) {
      return res.status(400).json({
        message: "Invalid feed cursor",
      });
    }

    // ========================================
    // FIND NEWER THOUGHTS
    // ========================================
    //
    // Newest first:
    //
    // createdAt > cursor date
    //
    // OR same timestamp and larger _id
    //
    // ========================================

    const thoughts =
      await Thought.find({
        $or: [
          {
            createdAt: {
              $gt: cursorDate,
            },
          },
          {
            createdAt: cursorDate,
            _id: {
              $gt: cursorId,
            },
          },
        ],
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

    // ========================================
    // COMMENT COUNTS
    // ========================================

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

    // ========================================
    // FORMAT
    // ========================================

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

      count:
        formattedThoughts.length,
    });
  } catch (error) {
    console.error(
      "Get new thoughts error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while checking for new thoughts",
    });
  }
};

module.exports = {
  createThought,
  getThoughts,
  getThoughtById,
  getNewThoughts,
  toggleLike,
  toggleBookmark,
  updateThought,
  deleteThought,
};