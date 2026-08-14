const User =
  require("../models/User");

const createNotification =
  require("./createNotification");


// ==========================================
// EXTRACT @USERNAME MENTIONS
// ==========================================

const extractMentionUsernames =
  (content = "") => {
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
      matches.map(
        (match) =>
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
// FIND MENTIONED USERS
// ==========================================

const findMentionedUsers =
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
// FIND NEW MENTIONS AFTER EDIT
// ==========================================

const findNewMentionedUsers =
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


// ==========================================
// CREATE MENTION NOTIFICATIONS
// ==========================================

const createMentionNotifications =
  async ({
    content,
    senderId,
    thoughtId = null,
    commentId = null,
  }) => {
    try {
      const users =
        await findMentionedUsers(
          content
        );


      if (
        users.length ===
        0
      ) {
        return;
      }


      await Promise.all(
        users.map(
          async (user) => {
            if (
              user._id.toString() ===
              senderId.toString()
            ) {
              return;
            }


            await createNotification({
              recipient:
                user._id,

              sender:
                senderId,

              type:
                "mention",

              thought:
                thoughtId,

              comment:
                commentId,
            });
          }
        )
      );
    } catch (error) {
      console.error(
        "Mention notification error:",
        error
      );
    }
  };


// ==========================================
// CREATE ONLY NEW MENTION NOTIFICATIONS
// ==========================================

const createNewMentionNotifications =
  async ({
    oldContent,
    newContent,
    senderId,
    thoughtId = null,
    commentId = null,
  }) => {
    try {
      const users =
        await findNewMentionedUsers(
          oldContent,
          newContent
        );


      if (
        users.length ===
        0
      ) {
        return;
      }


      await Promise.all(
        users.map(
          async (user) => {
            if (
              user._id.toString() ===
              senderId.toString()
            ) {
              return;
            }


            await createNotification({
              recipient:
                user._id,

              sender:
                senderId,

              type:
                "mention",

              thought:
                thoughtId,

              comment:
                commentId,
            });
          }
        )
      );
    } catch (error) {
      console.error(
        "New mention notification error:",
        error
      );
    }
  };


module.exports = {
  extractMentionUsernames,
  findMentionedUsers,
  findNewMentionedUsers,
  createMentionNotifications,
  createNewMentionNotifications,
};