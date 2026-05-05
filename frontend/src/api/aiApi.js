// ============================================================
// aiApi.js — AI itinerary generation API calls
// ============================================================
import axios from "./axios";

/**
 * Generate a full AI itinerary.
 *
 * @param {{
 *   destination: string,
 *   duration: number,       // days
 *   budget: string,         // "budget" | "mid-range" | "luxury"
 *   travelStyle: string[],  // e.g. ["cultural", "foodie"]
 *   travelers: number,
 *   startDate?: string,
 *   preferences?: string,
 * }} tripParams
 *
 * @returns {Promise<{ itinerary: object, destination: object }>}
 */
export const generateItinerary = async (tripParams) => {
  const response = await axios.post("/ai/generate-itinerary", tripParams);
  return response.data;
};

/**
 * Regenerate a specific day within an existing itinerary.
 *
 * @param {string} tripId
 * @param {number} dayNumber
 * @param {string} [customNote] - optional user instruction
 */
export const regenerateDay = async (tripId, dayNumber, customNote = "") => {
  const response = await axios.post(`/ai/regenerate-day`, {
    tripId,
    dayNumber,
    customNote,
  });
  return response.data; // { updatedDay }
};

/**
 * Ask the AI a follow-up question about an existing itinerary.
 *
 * @param {string} tripId
 * @param {string} question
 */
export const askAboutTrip = async (tripId, question) => {
  const response = await axios.post(`/ai/ask`, { tripId, question });
  return response.data; // { answer }
};

/**
 * Get AI-powered destination suggestions based on user preferences.
 *
 * @param {{
 *   budget?: string,
 *   travelStyle?: string[],
 *   duration?: number,
 *   continent?: string,
 * }} preferences
 */
export const getDestinationSuggestions = async (preferences = {}) => {
  const response = await axios.post("/ai/suggest-destinations", preferences);
  return response.data; // { destinations: [...] }
};

/**
 * Generate packing list for a trip.
 *
 * @param {{ destination: string, duration: number, activities: string[] }} params
 */
export const generatePackingList = async (params) => {
  const response = await axios.post("/ai/packing-list", params);
  return response.data; // { categories: [{ name, items: [] }] }
};