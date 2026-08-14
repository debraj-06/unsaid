import { apiFetch } from "./api";


// ==========================================
// GET MY PROFILE
// ==========================================

export function getMyProfile() {
  return apiFetch("/users/me");
}


// ==========================================
// UPDATE MY PROFILE
// ==========================================

export function updateMyProfile(
  bio
) {
  return apiFetch(
    "/users/me",
    {
      method: "PATCH",

      body: JSON.stringify({
        bio,
      }),
    }
  );
}


// ==========================================
// CHANGE PASSWORD
// ==========================================

export function changePassword(
  data
) {
  return apiFetch(
    "/users/me/password",
    {
      method: "PATCH",

      body: JSON.stringify(data),
    }
  );
}


// ==========================================
// MY THOUGHTS
// ==========================================

export function getMyThoughts() {
  return apiFetch(
    "/users/me/thoughts"
  );
}


// ==========================================
// MY BOOKMARKS
// ==========================================

export function getMyBookmarks() {
  return apiFetch(
    "/users/me/bookmarks"
  );
}


// ==========================================
// PUBLIC PROFILE
// ==========================================

export function getPublicProfile(
  username
) {
  return apiFetch(
    `/users/${username}`
  );
}


// ==========================================
// FOLLOW / UNFOLLOW
// ==========================================

export function toggleFollow(
  username
) {
  return apiFetch(
    `/users/${username}/follow`,
    {
      method: "PATCH",
    }
  );
}


// ==========================================
// FOLLOWING FEED - INFINITE
// ==========================================

export function getFollowingFeed({
  cursor = null,
  limit = 10,
} = {}) {
  const params =
    new URLSearchParams();

  params.set(
    "limit",
    String(limit)
  );

  if (cursor) {
    params.set(
      "cursor",
      cursor
    );
  }

  return apiFetch(
    `/users/me/following-feed?${params.toString()}`
  );
}