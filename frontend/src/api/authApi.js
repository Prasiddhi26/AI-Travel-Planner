// ============================================================
// authApi.js — Authentication API calls
// ============================================================
import axios from "./axios"; // your existing axios instance

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} data
 */
export const registerUser = async (data) => {
  const response = await axios.post("/auth/register", data);
  return response.data; // { token, user }
};

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} data
 */
export const loginUser = async (data) => {
  const response = await axios.post("/auth/login", data);
  return response.data; // { token, user }
};

/**
 * Fetch the currently authenticated user (uses token in header).
 */
export const getMe = async () => {
  const response = await axios.get("/auth/me");
  return response.data; // { user }
};

/**
 * Request a password-reset email.
 * @param {{ email: string }} data
 */
export const forgotPassword = async (data) => {
  const response = await axios.post("/auth/forgot-password", data);
  return response.data;
};

/**
 * Reset password using the emailed token.
 * @param {{ token: string, password: string }} data
 */
export const resetPassword = async (data) => {
  const response = await axios.post("/auth/reset-password", data);
  return response.data;
};

/**
 * Log out — simply removes the local token (no backend call required
 * unless your API maintains a token blacklist).
 */
export const logoutUser = () => {
  localStorage.removeItem("travel_planner_token");
  localStorage.removeItem("travel_planner_user");
};