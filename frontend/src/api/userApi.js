// ============================================================
// userApi.js — User profile & preference API calls
// ============================================================
import axios from "./axios";

/**
 * Get the current user's full profile.
 */
export const getProfile = async () => {
  const response = await axios.get("/users/profile");
  return response.data; // { user }
};

/**
 * Update profile fields (name, bio, avatar URL, etc.).
 * @param {object} profileData
 */
export const updateProfile = async (profileData) => {
  const response = await axios.put("/users/profile", profileData);
  return response.data; // { user }
};

/**
 * Upload a profile avatar image.
 * @param {File} file
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await axios.post("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // { avatarUrl }
};

/**
 * Change password (requires current password for verification).
 * @param {{ currentPassword: string, newPassword: string }} data
 */
export const changePassword = async (data) => {
  const response = await axios.put("/users/change-password", data);
  return response.data;
};

/**
 * Get user travel statistics (trips created, destinations visited, etc.).
 */
export const getUserStats = async () => {
  const response = await axios.get("/users/stats");
  return response.data; // { totalTrips, destinations, daysPlanned, ... }
};

/**
 * Save or update user travel preferences.
 * @param {{ travelStyle: string[], preferredBudget: string, ... }} prefs
 */
export const updatePreferences = async (prefs) => {
  const response = await axios.put("/users/preferences", prefs);
  return response.data;
};

/**
 * Delete the user's account (irreversible).
 * @param {{ password: string }} data — requires password confirmation
 */
export const deleteAccount = async (data) => {
  const response = await axios.delete("/users/account", { data });
  return response.data;
};