import { apiFetch } from "./api";


// ==========================================
// GET COMMENTS
// ==========================================

export function getComments(
  thoughtId
) {
  if (!thoughtId) {
    return Promise.reject(
      new Error(
        "Thought id is required"
      )
    );
  }

  return apiFetch(
    `/comments/${thoughtId}`
  );
}


// ==========================================
// CREATE COMMENT
// ==========================================

export function createComment(
  thoughtId,
  content,
  parentComment = null
) {
  if (!thoughtId) {
    return Promise.reject(
      new Error(
        "Thought id is required"
      )
    );
  }

  return apiFetch(
    `/comments/${thoughtId}`,
    {
      method: "POST",

      body: JSON.stringify({
        content,
        parentComment,
      }),
    }
  );
}


// ==========================================
// UPDATE COMMENT
// ==========================================

export function updateComment(
  commentId,
  content
) {
  if (!commentId) {
    return Promise.reject(
      new Error(
        "Comment id is required"
      )
    );
  }

  return apiFetch(
    `/comments/${commentId}`,
    {
      method: "PATCH",

      body: JSON.stringify({
        content,
      }),
    }
  );
}


// ==========================================
// DELETE COMMENT
// ==========================================

export function deleteComment(
  commentId
) {
  if (!commentId) {
    return Promise.reject(
      new Error(
        "Comment id is required"
      )
    );
  }

  return apiFetch(
    `/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
}


// ==========================================
// LIKE / UNLIKE COMMENT
// ==========================================

export function toggleCommentLike(
  commentId
) {
  if (!commentId) {
    return Promise.reject(
      new Error(
        "Comment id is required"
      )
    );
  }

  return apiFetch(
    `/comments/${commentId}/like`,
    {
      method: "PATCH",
    }
  );
}