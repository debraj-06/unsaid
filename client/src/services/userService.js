import { apiFetch } from "./api";


// ==========================================
// MY PROFILE
// ==========================================

export function getMyProfile() {
  return apiFetch(
    "/api/users/me"
  );
}


// ==========================================
// UPDATE MY PROFILE
// ==========================================

export function updateMyProfile(
  bio
) {
  return apiFetch(
    "/api/users/me",
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
    "/api/users/me/password",
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
    "/api/users/me/thoughts"
  );
}


// ==========================================
// MY BOOKMARKS
// ==========================================

export function getMyBookmarks() {
  return apiFetch(
    "/api/users/me/bookmarks"
  );
}


// ==========================================
// MY FOLLOWERS
// ==========================================

export function getMyFollowers() {
  return apiFetch(
    "/api/users/me/followers"
  );
}


// ==========================================
// MY FOLLOWING
// ==========================================

export function getMyFollowing() {
  return apiFetch(
    "/api/users/me/following"
  );
}


// ==========================================
// FOLLOWING FEED
// ==========================================

export function getFollowingFeed() {
  return apiFetch(
    "/api/users/me/following-feed"
  );
}


// ==========================================
// PUBLIC PROFILE
// ==========================================

export function getPublicProfile(
  username
) {
  return apiFetch(
    `/api/users/${encodeURIComponent(
      username
    )}`
  );
}


// ==========================================
// PUBLIC FOLLOWERS
// ==========================================

export function getUserFollowers(
  username
) {
  return apiFetch(
    `/api/users/${encodeURIComponent(
      username
    )}/followers`
  );
}


// ==========================================
// PUBLIC FOLLOWING
// ==========================================

export function getUserFollowing(
  username
) {
  return apiFetch(
    `/api/users/${encodeURIComponent(
      username
    )}/following`
  );
}


// ==========================================
// FOLLOW / UNFOLLOW
// ==========================================

export function toggleFollow(
  username
) {
  return apiFetch(
    `/api/users/${encodeURIComponent(
      username
    )}/follow`,
    {
      method: "PATCH",
    }
  );
}