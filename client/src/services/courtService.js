import {
  apiFetch,
} from "./api";


// ==========================================
// GET OPEN COURT CASES
// ==========================================

export function getCourtCases() {
  return apiFetch(
    "/court"
  );
}


// ==========================================
// GET MY CASES
// ==========================================

export function getMyCourtCases() {
  return apiFetch(
    "/court/mine"
  );
}


// ==========================================
// GET ONE CASE
// ==========================================

export function getCourtCase(
  id
) {
  return apiFetch(
    `/court/${encodeURIComponent(
      id
    )}`
  );
}


// ==========================================
// CREATE CASE
// ==========================================

export function createCourtCase(
  situation
) {
  return apiFetch(
    "/court",
    {
      method: "POST",

      body: JSON.stringify({
        situation,
      }),
    }
  );
}


// ==========================================
// VOTE
// ==========================================

export function voteOnCourtCase(
  id,
  decision,
  reasoning = ""
) {
  return apiFetch(
    `/court/${encodeURIComponent(
      id
    )}/vote`,
    {
      method: "POST",

      body: JSON.stringify({
        decision,
        reasoning,
      }),
    }
  );
}