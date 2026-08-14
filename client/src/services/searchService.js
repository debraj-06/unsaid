import {
  apiFetch,
} from "./api";


// ==========================================
// UNIVERSAL SEARCH
// ==========================================

export function searchEverything(
  query
) {
  const cleanQuery =
    query.trim();

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
// DISCOVER
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