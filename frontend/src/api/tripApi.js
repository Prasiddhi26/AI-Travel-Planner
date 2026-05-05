// ============================================================
// tripApi.js — Trip CRUD API calls
// ============================================================
import axios from "./axios";

/**
 * Fetch all trips saved by the current user.
 * @param {{ page?: number, limit?: number, search?: string }} params
 */
export const getUserTrips = async (params = {}) => {
  const response = await axios.get("/trips", { params });
  return response.data; // { trips, total, page }
};

/**
 * Fetch a single trip by its ID.
 * @param {string} tripId
 */
export const getTripById = async (tripId) => {
  const response = await axios.get(`/trips/${tripId}`);
  return response.data; // { trip }
};

/**
 * Save a new trip to the database.
 * @param {object} tripData — includes destination, duration, itinerary, etc.
 */
export const saveTrip = async (tripData) => {
  const response = await axios.post("/trips", tripData);
  return response.data; // { trip }
};

/**
 * Update an existing trip.
 * @param {string} tripId
 * @param {object} updates
 */
export const updateTrip = async (tripId, updates) => {
  const response = await axios.put(`/trips/${tripId}`, updates);
  return response.data; // { trip }
};

/**
 * Delete a saved trip.
 * @param {string} tripId
 */
export const deleteTrip = async (tripId) => {
  const response = await axios.delete(`/trips/${tripId}`);
  return response.data;
};

/**
 * Toggle a trip's "favourite" flag.
 * @param {string} tripId
 */
export const toggleFavourite = async (tripId) => {
  const response = await axios.patch(`/trips/${tripId}/favourite`);
  return response.data; // { trip }
};

/**
 * Fetch all public / featured trips (for the explore section).
 * @param {{ category?: string, continent?: string, search?: string }} params
 */
export const getFeaturedTrips = async (params = {}) => {
  const response = await axios.get("/trips/featured", { params });
  return response.data;
};