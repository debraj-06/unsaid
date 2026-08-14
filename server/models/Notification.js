const mongoose = require("mongoose");


const notificationSchema =
  new mongoose.Schema(
    {
      recipient: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },


      sender: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },


      type: {
        type: String,
        enum: [
          "like",
          "comment",
          "reply",
          "follow",
          "mention",
        ],
        required: true,
      },


      thought: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Thought",
        default: null,
      },


      comment: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
      },


      read: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );


notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});


notificationSchema.index({
  recipient: 1,
  read: 1,
});


module.exports =
  mongoose.model(
    "Notification",
    notificationSchema
  );