import { apiFetch } from "./api";


// ==========================================
// IMPROVE THOUGHT
// ==========================================

export function improveThought(
  content
) {
  return apiFetch(
    "/api/ai/improve-thought",
    {
      method: "POST",

      body: JSON.stringify({
        content,
      }),
    }
  );
}