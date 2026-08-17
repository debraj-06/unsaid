const API_URL =
  "https://unsaid-api-xwyy.onrender.com";


// ==========================================
// GET STORED TOKEN
// ==========================================

const getStoredToken =
  () => {
    try {
      return localStorage.getItem(
        "unsaid_token"
      );
    } catch {
      return null;
    }
  };


// ==========================================
// API FETCH
// ==========================================

export async function apiFetch(
  endpoint,
  options = {}
) {
  try {
    let cleanEndpoint =
      endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;


    // Normalize:
    // /auth/login
    // /api/auth/login
    // /api/api/auth/login

    if (
      cleanEndpoint.startsWith(
        "/api/api/"
      )
    ) {
      cleanEndpoint =
        cleanEndpoint.replace(
          /^\/api\/api\//,
          "/api/"
        );
    } else if (
      !cleanEndpoint.startsWith(
        "/api/"
      )
    ) {
      cleanEndpoint =
        `/api${cleanEndpoint}`;
    }


    const storedToken =
      getStoredToken();


    const headers = {
      "Content-Type":
        "application/json",

      ...(options.headers || {}),
    };


    // ======================================
    // BEARER TOKEN
    // ======================================

    if (
      storedToken &&
      !headers.Authorization
    ) {
      headers.Authorization =
        `Bearer ${storedToken}`;
    }


    const response =
      await fetch(
        `${API_URL}${cleanEndpoint}`,
        {
          ...options,

          credentials:
            "include",

          headers,
        }
      );


    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    // ======================================
    // SESSION EXPIRED
    // ======================================

    if (
      response.status ===
      401
    ) {
      window.dispatchEvent(
        new CustomEvent(
          "unsaid:auth-expired"
        )
      );


      throw new Error(
        data.message ||
          "Your session has expired. Please log in again."
      );
    }


    // ======================================
    // OTHER ERROR
    // ======================================

    if (
      !response.ok
    ) {
      throw new Error(
        data.message ||
          `Request failed with status ${response.status}`
      );
    }


    return data;
  } catch (error) {
    console.error(
      "API request error:",
      error
    );


    throw error;
  }
}