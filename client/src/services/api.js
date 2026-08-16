const API_URL =
  "https://unsaid-api-xwyy.onrender.com/api";


export async function apiFetch(
  endpoint,
  options = {}
) {
  try {
    const cleanEndpoint =
      endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;


    const response =
      await fetch(
        `${API_URL}${cleanEndpoint}`,
        {
          ...options,

          credentials:
            "include",

          headers: {
            "Content-Type":
              "application/json",

            ...(options.headers || {}),
          },
        }
      );


    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    // ========================================
    // SESSION EXPIRED
    // ========================================

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


    // ========================================
    // API ERROR
    // ========================================

    if (!response.ok) {
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