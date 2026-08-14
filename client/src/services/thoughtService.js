import { apiFetch } from "./api";


// ==========================================
// GET THOUGHTS - INFINITE STREAM
// ==========================================

export function getThoughts({
  cursor = null,
  limit = 10,
} = {}) {
  const params = new URLSearchParams();

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
    `/thoughts?${params.toString()}`
  );
}


// ==========================================
// GET NEW THOUGHTS
// ==========================================

export function getNewThoughts(
  after
) {
  if (!after) {
    return Promise.resolve({
      thoughts: [],
      count: 0,
    });
  }

  return apiFetch(
    `/thoughts/new?after=${encodeURIComponent(
      after
    )}`
  );
}


// ==========================================
// GET SINGLE THOUGHT
// ==========================================

export function getThoughtById(
  id
) {
  return apiFetch(
    `/thoughts/${id}`
  );
}


// ==========================================
// CREATE THOUGHT
// ==========================================

export function createThought(
  content
) {
  return apiFetch(
    "/thoughts",
    {
      method: "POST",

      body: JSON.stringify({
        content,
      }),
    }
  );
}


// ==========================================
// LIKE / UNLIKE
// ==========================================

export function toggleThoughtLike(
  id
) {
  return apiFetch(
    `/thoughts/${id}/like`,
    {
      method: "PATCH",
    }
  );
}


// ==========================================
// BOOKMARK / UNBOOKMARK
// ==========================================

export function toggleThoughtBookmark(
  id
) {
  return apiFetch(
    `/thoughts/${id}/bookmark`,
    {
      method: "PATCH",
    }
  );
}


// ==========================================
// UPDATE THOUGHT
// ==========================================

export function updateThought(
  id,
  content
) {
  return apiFetch(
    `/thoughts/${id}`,
    {
      method: "PATCH",

      body: JSON.stringify({
        content,
      }),
    }
  );
}


// ==========================================
// DELETE THOUGHT
// ==========================================

export function deleteThought(
  id
) {
  return apiFetch(
    `/thoughts/${id}`,
    {
      method: "DELETE",
    }
  );
}