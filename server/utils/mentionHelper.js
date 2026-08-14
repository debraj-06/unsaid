const User = require("../models/User");

// ==========================================
// EXTRACT MENTIONS
// ==========================================
//
// Examples:
//
// @luffy
// @luffy_fan
// @someone123
//
// Returns unique usernames without @
//

const extractMentionUsernames = (
  content = ""
) => {
  if (
    typeof content !==
    "string"
  ) {
    return [];
  }

  const matches =
    content.match(
      /(^|\s)@([a-zA-Z0-9_]+)/g
    ) || [];

  const usernames =
    matches.map((match) =>
      match
        .trim()
        .slice(1)
        .toLowerCase()
    );

  return [
    ...new Set(
      usernames
    ),
  ];
};


// ==========================================
// GET USERS FROM MENTIONS
// ==========================================

const getMentionedUsers =
  async (content) => {
    const usernames =
      extractMentionUsernames(
        content
      );

    if (
      usernames.length ===
      0
    ) {
      return [];
    }

    const users =
      await User.find({
        username: {
          $in: usernames,
        },
      }).select(
        "_id username"
      );

    return users;
  };


// ==========================================
// GET NEW MENTIONS
// ==========================================
//
// Used when editing a thought/comment.
//
// oldContent:
//   previous text
//
// newContent:
//   new text
//
// Only usernames newly introduced
// in the edited content are returned.
// ==========================================

const getNewMentionedUsers =
  async (
    oldContent = "",
    newContent = ""
  ) => {
    const oldMentions =
      new Set(
        extractMentionUsernames(
          oldContent
        )
      );

    const newMentions =
      extractMentionUsernames(
        newContent
      );

    const addedMentions =
      newMentions.filter(
        (username) =>
          !oldMentions.has(
            username
          )
      );

    if (
      addedMentions.length ===
      0
    ) {
      return [];
    }

    const users =
      await User.find({
        username: {
          $in: addedMentions,
        },
      }).select(
        "_id username"
      );

    return users;
  };


module.exports = {
  extractMentionUsernames,
  getMentionedUsers,
  getNewMentionedUsers,
};