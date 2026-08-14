const express = require("express");

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");


const router =
  express.Router();


// ==========================================
// GET NOTIFICATIONS
// ==========================================

router.get(
  "/",
  authMiddleware,
  getNotifications
);


// ==========================================
// GET UNREAD COUNT
// ==========================================

router.get(
  "/unread-count",
  authMiddleware,
  getUnreadCount
);


// ==========================================
// MARK ALL READ
// ==========================================

router.patch(
  "/read-all",
  authMiddleware,
  markAllNotificationsRead
);


// ==========================================
// MARK ONE READ
// ==========================================

router.patch(
  "/:id/read",
  authMiddleware,
  markNotificationRead
);


// ==========================================
// DELETE ALL
// ==========================================

router.delete(
  "/all",
  authMiddleware,
  deleteAllNotifications
);


// ==========================================
// DELETE ONE
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);


module.exports =
  router;