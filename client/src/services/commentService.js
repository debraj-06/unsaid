import { apiFetch } from "./api";


// ==========================================
// GET COMMENTS
// ==========================================

export function getComments(
  thoughtId
) {
  return apiFetch(
    `/api/comments/${thoughtId}`
  );
}


// ==========================================
// CREATE COMMENT / REPLY
// ==========================================

export function createComment(
  thoughtId,
  content
) {
  return apiFetch(
    `/api/comments/${thoughtId}`,
    {
      method: "POST",

      body: JSON.stringify({
        content,
      }),
    }
  );
}


// ==========================================
// UPDATE COMMENT
// ==========================================

export function updateComment(
  id,
  content
) {
  return apiFetch(
    `/api/comments/${id}`,
    {
      method: "PATCH",

      body: JSON.stringify({
        content,
      }),
    }
  );
}


// ==========================================
// LIKE / UNLIKE COMMENT
// ==========================================

export function toggleCommentLike(
  id
) {
  return apiFetch(
    `/api/comments/${id}/like`,
    {
      method: "PATCH",
    }
  );
}


// ==========================================
// DELETE COMMENT
// ==========================================

export function deleteComment(
  id
) {
  return apiFetch(
    `/api/comments/${id}`,
    {
      method: "DELETE",
    }
  );
}