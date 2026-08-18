const mongoose = require("mongoose");


// ==========================================
// ANONYMOUS COURT CASE
// ==========================================

const CourtCaseSchema =
  new mongoose.Schema(
    {
      // The user who submitted the case.
      // Never expose this through the public API.
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      // The situation being judged.
      situation: {
        type: String,
        required: true,
        trim: true,
        minlength: 20,
        maxlength: 1000,
      },

      // Whether voting is still open.
      status: {
        type: String,
        enum: [
          "open",
          "closed",
        ],
        default: "open",
        index: true,
      },

      // Optional expiration.
      // 24 hours is a good starting point.
      closesAt: {
        type: Date,
        required: true,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );


module.exports =
  mongoose.model(
    "CourtCase",
    CourtCaseSchema
  );