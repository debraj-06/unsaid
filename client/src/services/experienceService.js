import {
  apiFetch,
} from "./api";


// ==========================================
// GET EXPERIENCE MATCHES
// ==========================================

export function getExperienceMatches(
  thoughtId
) {
  if (!thoughtId) {
    return Promise.resolve({
      count: 0,
      experiences: [],
    });
  }


  return apiFetch(
    `/experiences/${encodeURIComponent(
      thoughtId
    )}`
  );
}