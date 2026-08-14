import {
  apiFetch,
} from "./api";


// ==========================================
// GET NOTIFICATIONS
// ==========================================

export function getNotifications() {
  return apiFetch(
    "/notifications"
  );
}


// ==========================================
// GET UNREAD COUNT
// ==========================================

export function getUnreadNotificationCount() {
  return apiFetch(
    "/notifications/unread-count"
  );
}


// ==========================================
// MARK ONE READ
// ==========================================

export function markNotificationRead(
  id
) {
  return apiFetch(
    `/notifications/${id}/read`,
    {
      method: "PATCH",
    }
  );
}


// ==========================================
// MARK ALL READ
// ==========================================

export function markAllNotificationsRead() {
  return apiFetch(
    "/notifications/read-all",
    {
      method: "PATCH",
    }
  );
}


// ==========================================
// DELETE ONE
// ==========================================

export function deleteNotification(
  id
) {
  return apiFetch(
    `/notifications/${id}`,
    {
      method: "DELETE",
    }
  );
}


// ==========================================
// DELETE ALL
// ==========================================

export function deleteAllNotifications() {
  return apiFetch(
    "/notifications/all",
    {
      method: "DELETE",
    }
  );
}