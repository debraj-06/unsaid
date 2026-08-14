import { apiFetch } from "./api";

export function registerUser(data) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function loginUser(data) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logoutUser() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}

export function getCurrentUser() {
  return apiFetch("/auth/me");
}