import {
  apiFetch,
} from "./api";


// ==========================================
// REGISTER
// ==========================================

export async function registerUser(
  data
) {
  const response =
    await apiFetch(
      "/auth/register",
      {
        method:
          "POST",

        body:
          JSON.stringify(
            data
          ),
      }
    );


  if (
    response?.token
  ) {
    localStorage.setItem(
      "unsaid_token",
      response.token
    );
  }


  return response;
}


// ==========================================
// LOGIN
// ==========================================

export async function loginUser(
  data
) {
  const response =
    await apiFetch(
      "/auth/login",
      {
        method:
          "POST",

        body:
          JSON.stringify(
            data
          ),
      }
    );


  if (
    response?.token
  ) {
    localStorage.setItem(
      "unsaid_token",
      response.token
    );
  }


  return response;
}


// ==========================================
// CURRENT USER
// ==========================================

export function getCurrentUser() {
  return apiFetch(
    "/auth/me"
  );
}


// ==========================================
// LOGOUT
// ==========================================

export async function logoutUser() {
  try {
    return await apiFetch(
      "/auth/logout",
      {
        method:
          "POST",
      }
    );
  } finally {
    localStorage.removeItem(
      "unsaid_token"
    );
  }
}