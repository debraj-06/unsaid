import {
  apiFetch,
} from "./api";


// ==========================================
// GET ANONYMOUS EXPERIENCE MATCHES
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


// ==========================================
// OPTIONAL: SAFE NORMALIZED RESPONSE
// ==========================================
//
// Keeps the frontend from breaking if the API
// returns missing or unexpected fields.
//

export async function fetchExperienceMatches(
  thoughtId
) {
  if (!thoughtId) {
    return {
      count: 0,
      experiences: [],
    };
  }

  const data =
    await getExperienceMatches(
      thoughtId
    );

  return {
    count:
      Number(
        data?.count || 0
      ),

    experiences:
      Array.isArray(
        data?.experiences
      )
        ? data.experiences.map(
            (experience) => ({
              content:
                typeof experience
                  ?.content ===
                "string"
                  ? experience.content
                  : "",

              createdAt:
                experience?.createdAt ||
                null,
            })
          )
        : [],
  };
}