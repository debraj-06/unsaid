import { apiFetch } from "./api";


// ==========================================
// GET NOTIFICATIONS
// ==========================================

export function getNotifications() {
  return apiFetch(
    "/api/notifications"
  );
}


// ==========================================
// GET UNREAD COUNT
// ==========================================

export function getUnreadNotificationCount() {
  return apiFetch(
    "/api/notifications/unread-count"
  );
}


// ==========================================
// MARK ONE READ
// ==========================================

export function markNotificationRead(
  id
) {
  return apiFetch(
    `/api/notifications/${id}/read`,
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
    "/api/notifications/read-all",
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
    `/api/notifications/${id}`,
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
    "/api/notifications/all",
    {
      method: "DELETE",
    }
  );
}