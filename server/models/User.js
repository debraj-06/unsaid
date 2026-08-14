const mongoose = require("mongoose");


// ==========================================
// USER SCHEMA
// ==========================================

const userSchema =
  new mongoose.Schema(
    {
      // ======================================
      // USERNAME
      // ======================================

      username: {
        type: String,

        required: true,

        unique: true,

        trim: true,

        lowercase: true,

        minlength: 3,

        maxlength: 30,
      },


      // ======================================
      // PASSWORD
      // ======================================

      password: {
        type: String,

        required: true,
      },


      // ======================================
      // BIO
      // ======================================

      bio: {
        type: String,

        default: "",

        trim: true,

        maxlength: 160,
      },


      // ======================================
      // FOLLOWERS
      // ======================================

      followers: [
        {
          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User",
        },
      ],


      // ======================================
      // FOLLOWING
      // ======================================

      following: [
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
// INDEXES
// ==========================================

userSchema.index({
  username: 1,
});

userSchema.index({
  followers: 1,
});

userSchema.index({
  following: 1,
});


module.exports =
  mongoose.model(
    "User",
    userSchema
  );