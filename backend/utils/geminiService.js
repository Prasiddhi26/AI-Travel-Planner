import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// ✅ Initialize Gemini properly
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// -------------------------------
// Prompt Builder
// -------------------------------
const buildItineraryPrompt = ({
  destination,
  days,
  budget,
  interests,
  travelers,
}) => {
  return `
You are an expert travel planner.

Create a detailed day-by-day travel itinerary.

Destination: ${destination}
Duration: ${days} days
Budget: ${budget}
Travelers: ${travelers || 1}
Interests: ${interests?.join(", ") || "general sightseeing"}

Return ONLY valid JSON in this format:

{
  "destination": "${destination}",
  "totalDays": ${days},
  "budget": "${budget}",
  "summary": "Short 2-3 line trip overview",
  "days": [
    {
      "day": 1,
      "title": "Plan title",
      "activities": [
        {
          "time": "Morning",
          "activity": "Activity name",
          "description": "Short description",
          "estimatedCost": "$10-20"
        }
      ],
      "accommodation": "Hotel suggestion",
      "meals": {
        "breakfast": "Suggestion",
        "lunch": "Suggestion",
        "dinner": "Suggestion"
      },
      "tips": "Helpful tip"
    }
  ],
  "totalEstimatedCost": "Approx cost",
  "bestTimeToVisit": "Season/Month",
  "packingTips": ["tip1", "tip2"],
  "importantNotes": ["note1", "note2"]
}
`;
};

// -------------------------------
// Controller
// -------------------------------
export const generateItineraryWithGemini = async (tripDetails) => {
  try {
    const prompt = buildItineraryPrompt(tripDetails);

    // ✅ Correct SDK usage
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text;

    // Clean response (sometimes Gemini adds ```json)
    const cleanedText = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Error:", error.message);

    throw new Error(
      error instanceof SyntaxError
        ? "Invalid JSON response from Gemini"
        : `Gemini API error: ${error.message}`
    );
  }
};

// Optional default export (if you prefer)
export default generateItineraryWithGemini;