import {
  apiFetch,
} from "./api";


// ==========================================
// SEARCH USERS FOR MENTIONS
// ==========================================

export function searchMentionUsers(
  query
) {
  const cleanQuery =
    String(
      query || ""
    ).trim();

  if (!cleanQuery) {
    return Promise.resolve({
      users: [],
    });
  }

  return apiFetch(
    `/search/mentions?q=${encodeURIComponent(
      cleanQuery
    )}`
  );
}


// ==========================================
// UNIVERSAL SEARCH
// ==========================================

export function universalSearch(
  query
) {
  const cleanQuery =
    String(
      query || ""
    ).trim();

  if (!cleanQuery) {
    return Promise.resolve({
      users: [],
      thoughts: [],
    });
  }

  return apiFetch(
    `/search?q=${encodeURIComponent(
      cleanQuery
    )}`
  );
}


// ==========================================
// EXPLORE
// ==========================================

export function getExplore(
  sort = "latest"
) {
  return apiFetch(
    `/search/explore?sort=${encodeURIComponent(
      sort
    )}`
  );
}