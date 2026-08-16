import {
  apiFetch,
} from "./api";


// ==========================================
// MY PROFILE
// ==========================================

export function getMyProfile() {
  return apiFetch(
    "/users/me"
  );
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

      body: JSON.stringify(
        data
      ),
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
// MY FOLLOWERS
// ==========================================

export function getMyFollowers() {
  return apiFetch(
    "/users/me/followers"
  );
}


// ==========================================
// MY FOLLOWING
// ==========================================

export function getMyFollowing() {
  return apiFetch(
    "/users/me/following"
  );
}


// ==========================================
// FOLLOWING FEED
// ==========================================

export function getFollowingFeed() {
  return apiFetch(
    "/users/me/following-feed"
  );
}


// ==========================================
// PUBLIC PROFILE
// ==========================================

export function getPublicProfile(
  username
) {
  return apiFetch(
    `/users/${encodeURIComponent(
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
    `/users/${encodeURIComponent(
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
    `/users/${encodeURIComponent(
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
    `/users/${encodeURIComponent(
      username
    )}/follow`,
    {
      method: "PATCH",
    }
  );
}