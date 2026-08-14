const mongoose = require("mongoose");

const commentSchema =
  new mongoose.Schema(
    {
      // ======================================
      // THOUGHT
      // ======================================

      thought: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Thought",

        required: true,

        index: true,
      },


      // ======================================
      // AUTHOR
      // ======================================

      author: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },


      // ======================================
      // CONTENT
      // ======================================

      content: {
        type: String,

        required: true,

        trim: true,

        maxlength: 500,
      },


      // ======================================
      // PARENT COMMENT
      // ======================================

      parentComment: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Comment",

        default: null,
      },


      // ======================================
      // COMMENT LIKES
      // ======================================

      likes: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User",
        },
      ],
    },

    {
      timestamps: true,
    }
  );


// ==========================================
// INDEX
// ==========================================

commentSchema.index({
  thought: 1,
  createdAt: 1,
});


module.exports =
  mongoose.model(
    "Comment",
    commentSchema
  );