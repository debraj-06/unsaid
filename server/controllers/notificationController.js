const Notification = require("../models/Notification");


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

const getNotifications = async (
  req,
  res
) => {
  try {
    const notifications =
      await Notification.find({
        recipient: req.userId,
      })
        .populate(
          "sender",
          "username"
        )
        .populate(
          "thought",
          "_id content"
        )
        .populate(
          "comment",
          "_id content"
        )
        .sort({
          createdAt: -1,
        })
        .limit(50);


    const unreadCount =
      await Notification.countDocuments({
        recipient: req.userId,
        read: false,
      });


    return res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while loading notifications",
    });
  }
};


// ==========================================
// GET UNREAD COUNT
// ==========================================

const getUnreadCount = async (
  req,
  res
) => {
  try {
    const unreadCount =
      await Notification.countDocuments({
        recipient: req.userId,
        read: false,
      });


    return res.json({
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Get unread count error:",
      error
    );

    return res.status(500).json({
      message:
        "Something went wrong while loading notification count",
    });
  }
};


// ==========================================
// MARK ONE AS READ
// ==========================================

const markNotificationRead =
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;


      const notification =
        await Notification.findOne({
          _id: id,
          recipient: req.userId,
        });


      if (!notification) {
        return res.status(404).json({
          message:
            "Notification not found",
        });
      }


      if (!notification.read) {
        notification.read = true;

        await notification.save();
      }


      return res.json({
        notification,
      });
    } catch (error) {
      console.error(
        "Mark notification read error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while updating the notification",
      });
    }
  };


// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllNotificationsRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          recipient: req.userId,
          read: false,
        },
        {
          $set: {
            read: true,
          },
        }
      );


      return res.json({
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.error(
        "Mark all notifications read error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while updating notifications",
      });
    }
  };


// ==========================================
// DELETE ONE NOTIFICATION
// ==========================================

const deleteNotification =
  async (req, res) => {
    try {
      const {
        id,
      } = req.params;


      const notification =
        await Notification.findOne({
          _id: id,
          recipient: req.userId,
        });


      if (!notification) {
        return res.status(404).json({
          message:
            "Notification not found",
        });
      }


      await notification.deleteOne();


      return res.json({
        message:
          "Notification deleted",
      });
    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while deleting the notification",
      });
    }
  };


// ==========================================
// DELETE ALL NOTIFICATIONS
// ==========================================

const deleteAllNotifications =
  async (req, res) => {
    try {
      await Notification.deleteMany({
        recipient: req.userId,
      });


      return res.json({
        message:
          "All notifications deleted",
      });
    } catch (error) {
      console.error(
        "Delete all notifications error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong while deleting notifications",
      });
    }
  };


// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
};