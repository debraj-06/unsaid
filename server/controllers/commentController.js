const Comment = require("../models/Comment");
const Thought = require("../models/Thought");

const {
  createMentionNotifications,
  createNewMentionNotifications,
} = require("../utils/createMentionNotifications");


// ==========================================
// FORMAT COMMENT
// ==========================================

const formatComment = (
  comment,
  userId
) => {
  const likes = Array.isArray(
    comment.likes
  )
    ? comment.likes
    : [];

  return {
    id: comment._id.toString(),

    username:
      comment.author?.username ||
      "unknown",

    content:
      comment.content,

    parentComment:
      comment.parentComment
        ? comment.parentComment.toString()
        : null,

    thought:
      comment.thought
        ? comment.thought.toString()
        : null,

    likesCount:
      likes.length,

    likedByMe:
      Boolean(
        userId &&
          likes.some(
            (likeUserId) =>
              likeUserId.toString() ===
              userId.toString()
          )
      ),

    createdAt:
      comment.createdAt,

    updatedAt:
      comment.updatedAt,
  };
};


// ==========================================
// GET COMMENTS
// ==========================================

const getComments = async (
  req,
  res
) => {
  try {
    const { thoughtId } =
      req.params;

    if (!thoughtId) {
      return res.status(400).json({
        message:
          "Thought id is required",
      });
    }

    const thought =
      await Thought.findById(
        thoughtId
      );

    if (!thought) {
      return res.status(404).json({
        message:
          "Thought not found",
      });
    }

    const comments =
      await Comment.find({
        thought:
          thoughtId,
      })
        .populate(
          "author",
          "username"
        )
        .sort({
          createdAt: 1,
        });

    return res.json({
      comments:
        comments.map(
          (comment) =>
            formatComment(
              comment,
              req.userId
            )
        ),
    });
  } catch (error) {
    console.error(
      "Get comments error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while loading comments",
    });
  }
};


// ==========================================
// CREATE COMMENT
// ==========================================

const createComment = async (
  req,
  res
) => {
  try {
    const { thoughtId } =
      req.params;

    const {
      content,
      parentComment = null,
    } = req.body;

    if (!thoughtId) {
      return res.status(400).json({
        message:
          "Thought id is required",
      });
    }

    if (
      typeof content !==
        "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message:
          "Comment cannot be empty",
      });
    }

    const cleanContent =
      content.trim();

    if (
      cleanContent.length >
      500
    ) {
      return res.status(400).json({
        message:
          "Comment cannot exceed 500 characters",
      });
    }

    // --------------------------------------
    // CHECK THOUGHT
    // --------------------------------------

    const thought =
      await Thought.findById(
        thoughtId
      );

    if (!thought) {
      return res.status(404).json({
        message:
          "Thought not found",
      });
    }

    // --------------------------------------
    // CHECK PARENT COMMENT
    // --------------------------------------

    if (parentComment) {
      const parent =
        await Comment.findById(
          parentComment
        );

      if (!parent) {
        return res.status(404).json({
          message:
            "Parent comment not found",
        });
      }

      if (
        parent.thought.toString() !==
        thoughtId.toString()
      ) {
        return res.status(400).json({
          message:
            "Invalid parent comment",
        });
      }
    }

    // --------------------------------------
    // CREATE COMMENT
    // --------------------------------------

    const comment =
      await Comment.create({
        thought:
          thoughtId,

        author:
          req.userId,

        content:
          cleanContent,

        parentComment:
          parentComment || null,

        likes: [],
      });

    await comment.populate(
      "author",
      "username"
    );

    // --------------------------------------
    // MENTION NOTIFICATION
    // --------------------------------------

    try {
      await createMentionNotifications({
        content:
          cleanContent,

        senderId:
          req.userId,

        thoughtId:
          thought._id,

        commentId:
          comment._id,
      });
    } catch (notificationError) {
      console.error(
        "Comment mention notification error:",
        notificationError
      );
    }

    return res.status(201).json({
      comment:
        formatComment(
          comment,
          req.userId
        ),
    });
  } catch (error) {
    console.error(
      "Create comment error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while creating the comment",
    });
  }
};


// ==========================================
// UPDATE COMMENT
// ==========================================

const updateComment = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const { content } =
      req.body;

    if (
      typeof content !==
        "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message:
          "Comment cannot be empty",
      });
    }

    const cleanContent =
      content.trim();

    if (
      cleanContent.length >
      500
    ) {
      return res.status(400).json({
        message:
          "Comment cannot exceed 500 characters",
      });
    }

    const comment =
      await Comment.findById(
        id
      );

    if (!comment) {
      return res.status(404).json({
        message:
          "Comment not found",
      });
    }

    // --------------------------------------
    // ONLY OWNER CAN EDIT
    // --------------------------------------

    if (
      comment.author.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only edit your own comments",
      });
    }

    const oldContent =
      comment.content;

    comment.content =
      cleanContent;

    await comment.save();

    // --------------------------------------
    // NEW MENTIONS
    // --------------------------------------

    try {
      await createNewMentionNotifications({
        oldContent,

        newContent:
          cleanContent,

        senderId:
          req.userId,

        thoughtId:
          comment.thought,

        commentId:
          comment._id,
      });
    } catch (notificationError) {
      console.error(
        "Comment edit mention notification error:",
        notificationError
      );
    }

    await comment.populate(
      "author",
      "username"
    );

    return res.json({
      comment:
        formatComment(
          comment,
          req.userId
        ),
    });
  } catch (error) {
    console.error(
      "Update comment error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while editing the comment",
    });
  }
};


// ==========================================
// LIKE / UNLIKE COMMENT
// ==========================================

const toggleCommentLike =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      if (!id) {
        return res.status(400).json({
          message:
            "Comment id is required",
        });
      }

      const comment =
        await Comment.findById(
          id
        );

      if (!comment) {
        return res.status(404).json({
          message:
            "Comment not found",
        });
      }

      // ------------------------------------
      // COMPATIBILITY WITH OLD COMMENTS
      // ------------------------------------

      if (
        !Array.isArray(
          comment.likes
        )
      ) {
        comment.likes = [];
      }

      // ------------------------------------
      // FIND EXISTING LIKE
      // ------------------------------------

      const existingIndex =
        comment.likes.findIndex(
          (userId) =>
            userId.toString() ===
            req.userId.toString()
        );

      let liked;

      // ------------------------------------
      // REMOVE LIKE
      // ------------------------------------

      if (
        existingIndex !==
        -1
      ) {
        comment.likes.splice(
          existingIndex,
          1
        );

        liked = false;
      }

      // ------------------------------------
      // ADD LIKE
      // ------------------------------------

      else {
        comment.likes.push(
          req.userId
        );

        liked = true;
      }

      await comment.save();

      return res.json({
        liked,

        likesCount:
          comment.likes.length,
      });
    } catch (error) {
      console.error(
        "Comment like error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while liking the comment",
      });
    }
  };


// ==========================================
// DELETE COMMENT
// ==========================================

const deleteComment = async (
  req,
  res
) => {
  try {
    const { id } =
      req.params;

    const comment =
      await Comment.findById(
        id
      );

    if (!comment) {
      return res.status(404).json({
        message:
          "Comment not found",
      });
    }

    // --------------------------------------
    // ONLY OWNER CAN DELETE
    // --------------------------------------

    if (
      comment.author.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        message:
          "You can only delete your own comments",
      });
    }

    // --------------------------------------
    // DELETE REPLIES
    // --------------------------------------

    await Comment.deleteMany({
      parentComment:
        comment._id,
    });

    // --------------------------------------
    // DELETE COMMENT
    // --------------------------------------

    await comment.deleteOne();

    return res.json({
      message:
        "Comment deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete comment error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while deleting the comment",
    });
  }
};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getComments,
  createComment,
  updateComment,
  toggleCommentLike,
  deleteComment,
};