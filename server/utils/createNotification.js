const Notification = require("../models/Notification");


// ==========================================
// CREATE NOTIFICATION
// ==========================================

const createNotification = async ({
  recipient,
  sender,
  type,
  thought = null,
  comment = null,
}) => {
  try {
    if (!recipient || !sender) {
      return null;
    }


    // ----------------------------------------
    // NEVER NOTIFY YOURSELF
    // ----------------------------------------

    if (
      recipient.toString() ===
      sender.toString()
    ) {
      return null;
    }


    // ----------------------------------------
    // AVOID DUPLICATE MENTION NOTIFICATIONS
    // ----------------------------------------

    if (
      type === "mention"
    ) {
      const existing =
        await Notification.findOne({
          recipient,
          sender,
          type,
          thought,
          comment,
        });

      if (existing) {
        return existing;
      }
    }


    const notification =
      await Notification.create({
        recipient,
        sender,
        type,
        thought,
        comment,
        read: false,
      });


    return notification;
  } catch (error) {
    console.error(
      "Create notification error:",
      error
    );

    return null;
  }
};


// ==========================================
// EXPORT
// ==========================================

module.exports =
  createNotification;