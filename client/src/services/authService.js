import { apiFetch } from "./api";


// ==========================================
// REGISTER
// ==========================================

export function registerUser(data) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


// ==========================================
// LOGIN
// ==========================================

export function loginUser(data) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}


// ==========================================
// LOGOUT
// ==========================================

export function logoutUser() {
  return apiFetch("/api/auth/logout", {
    method: "POST",
  });
}


// ==========================================
// CURRENT USER
// ==========================================

export function getCurrentUser() {
  return apiFetch("/api/auth/me");
}