import { apiFetch } from "./api";

// ==========================================
// IMPROVE THOUGHT
// ==========================================

export function improveThought(content) {
  return apiFetch(
    "/ai/improve-thought",
    {
      method: "POST",

      body: JSON.stringify({
        content,
      }),
    }
  );
}