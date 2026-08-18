const mongoose = require("mongoose");


// ==========================================
// COURT VOTE
// ==========================================

const CourtVoteSchema =
  new mongoose.Schema(
    {
      courtCase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourtCase",
        required: true,
        index: true,
      },

      voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      decision: {
        type: String,
        enum: [
          "right",
          "wrong",
          "both_wrong",
          "not_enough_info",
        ],
        required: true,
      },

      reasoning: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );


// ==========================================
// ONE VOTE PER USER PER CASE
// ==========================================

CourtVoteSchema.index(
  {
    courtCase: 1,
    voter: 1,
  },
  {
    unique: true,
  }
);


module.exports =
  mongoose.model(
    "CourtVote",
    CourtVoteSchema
  );