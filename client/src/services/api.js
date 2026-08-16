const API_URL = "https://unsaid-api-xwyy.onrender.com";

export async function apiFetch(
  endpoint,
  options = {}
) {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      }
    );

    const data = await response
      .json()
      .catch(() => ({}));

    // ========================================
    // SESSION EXPIRED
    // ========================================

    if (response.status === 401) {
      window.dispatchEvent(
        new CustomEvent("unsaid:auth-expired")
      );

      throw new Error(
        data.message ||
          "Your session has expired. Please log in again."
      );
    }

    // ========================================
    // OTHER API ERRORS
    // ========================================

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Something went wrong"
      );
    }

    return data;
  } catch (error) {
    throw error;
  }
}