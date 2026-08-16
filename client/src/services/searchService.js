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
// UNIVERSAL SEARCH ALIAS
// ==========================================

export function universalSearch(
  query
) {
  return searchEverything(
    query
  );
}


// ==========================================
// MENTION SEARCH
// ==========================================

export async function searchMentionUsers(
  query
) {
  const cleanQuery =
    String(
      query || ""
    )
      .replace(
        /^@/,
        ""
      )
      .trim();

  if (!cleanQuery) {
    return {
      users: [],
    };
  }

  const data =
    await apiFetch(
      `/search/mentions?q=${encodeURIComponent(
        cleanQuery
      )}`
    );

  return {
    users:
      Array.isArray(
        data?.users
      )
        ? data.users
        : [],
  };
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