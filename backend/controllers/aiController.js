import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const buildItineraryPrompt = (tripDetails) => {
  const {
    source, destination, numberOfDays, budget,
    currency, startDate, travelType, numberOfTravelers, preferences
  } = tripDetails;

  return `You are an expert AI travel planner. Create a comprehensive, detailed, and personalized travel itinerary.

TRIP DETAILS:
- From: ${source}
- To: ${destination}
- Duration: ${numberOfDays} days
- Budget: ${currency} ${budget} (total for ${numberOfTravelers} traveler(s))
- Travel Style: ${travelType}
- Start Date: ${startDate || 'Flexible'}
- Travelers: ${numberOfTravelers}
- Special Preferences: ${preferences || 'None'}

Generate a COMPLETE travel plan in the following STRICT JSON format. Return ONLY valid JSON, no markdown, no extra text:

{
  "title": "Trip title",
  "highlights": ["highlight1", "highlight2", "highlight3"],
  "weatherInfo": {
    "season": "season name",
    "avgTemperature": "temperature range",
    "description": "weather description",
    "bestTime": "best visiting months"
  },
  "itinerary": [
    {
      "day": 1,
      "date": "Day 1",
      "title": "Day theme title",
      "description": "Overall day description",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "location": "Specific location",
          "description": "Detailed description",
          "estimatedCost": 500,
          "type": "sightseeing"
        }
      ],
      "accommodation": {
        "name": "Hotel name",
        "type": "hotel",
        "estimatedCost": 2000,
        "rating": 4.2,
        "address": "Area/Address"
      },
      "meals": {
        "breakfast": "Recommended breakfast",
        "lunch": "Recommended lunch",
        "dinner": "Recommended dinner"
      },
      "localTips": ["Local tip 1", "Local tip 2"],
      "estimatedDailyBudget": 5000
    }
  ],
  "budgetBreakdown": {
    "accommodation": 15000,
    "food": 8000,
    "transport": 5000,
    "activities": 4000,
    "shopping": 3000,
    "miscellaneous": 2000,
    "total": 37000,
    "currency": "${currency}"
  },
  "transportOptions": [
    {
      "type": "Flight/Train/Bus",
      "description": "Description",
      "estimatedCost": 5000,
      "duration": "2 hours"
    }
  ],
  "packingList": ["Item 1", "Item 2", "Item 3"],
  "travelTips": ["Tip 1", "Tip 2", "Tip 3"],
  "alternativeBudgetTips": ["Budget tip 1", "Budget tip 2"]
}

Requirements:
- Include EXACTLY ${numberOfDays} days in the itinerary array
- Make activities specific to ${destination} with real place names
- Budget should be realistic for ${destination} in ${currency}
- Tailor everything to ${travelType} travel style
- RETURN ONLY VALID JSON, no extra text`;
};

// @desc    Generate AI itinerary
// @route   POST /api/ai/generate-itinerary
// @access  Private
export const generateItinerary = async (req, res) => {
  try {
    const {
      source, destination, numberOfDays, budget,
      currency = "INR", startDate, travelType,
      numberOfTravelers = 1, preferences
    } = req.body;

    if (!source || !destination || !numberOfDays || !budget || !travelType) {
      return res.status(400).json({
        success: false,
        message: "Please provide: source, destination, numberOfDays, budget, travelType"
      });
    }

    if (numberOfDays > 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum 20 days allowed."
      });
    }

    const prompt = buildItineraryPrompt({
      source, destination, numberOfDays, budget,
      currency, startDate, travelType, numberOfTravelers, preferences
    });

    // ✅ Correct syntax for @google/genai SDK
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text;

    // Clean markdown formatting if present
    let cleanText = text.trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let itineraryData;
    try {
      itineraryData = JSON.parse(cleanText);
    } catch {
      // Try to extract JSON from response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        itineraryData = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Raw AI response:", cleanText);
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    res.json({
      success: true,
      message: "Itinerary generated successfully!",
      itinerary: itineraryData
    });

  } catch (error) {
    console.error("AI generation error:", error.message);

    if (error.message?.includes("API key")) {
      return res.status(500).json({ success: false, message: "Invalid Gemini API key." });
    }
    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return res.status(429).json({ success: false, message: "AI quota exceeded. Try again later." });
    }

    res.status(500).json({ success: false, message: "Failed to generate itinerary. Please try again." });
  }
};

// @desc    Get travel tips
// @route   POST /api/ai/travel-tips
// @access  Private
export const getTravelTips = async (req, res) => {
  try {
    const { destination, travelType } = req.body;
    if (!destination) {
      return res.status(400).json({ success: false, message: "Destination is required." });
    }

    const prompt = `Provide quick travel tips for ${destination} for a ${travelType || "general"} traveler.
    Return ONLY valid JSON:
    {
      "quickFacts": ["fact1", "fact2", "fact3"],
      "mustVisit": ["place1", "place2", "place3"],
      "localFood": ["dish1", "dish2", "dish3"],
      "doAndDont": { "do": ["do1", "do2"], "dont": ["dont1", "dont2"] },
      "bestSeason": "season",
      "safetyTips": ["tip1", "tip2"]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const tips = JSON.parse(text);
    res.json({ success: true, destination, tips });

  } catch (error) {
    console.error("Travel tips error:", error.message);
    res.status(500).json({ success: false, message: "Failed to get travel tips." });
  }
};

// @desc    Optimize budget
// @route   POST /api/ai/optimize-budget
// @access  Private
export const optimizeBudget = async (req, res) => {
  try {
    const { destination, budget, currency, numberOfDays, numberOfTravelers } = req.body;

    const prompt = `Budget optimization tips for ${destination}, ${numberOfDays} days, ${currency} ${budget} for ${numberOfTravelers} person(s).
    Return ONLY valid JSON:
    {
      "budgetAnalysis": "analysis text",
      "savingTips": ["tip1", "tip2", "tip3"],
      "budgetAccommodations": [{"name": "name", "estimatedCost": 0, "type": "type"}],
      "cheapEats": ["place1", "place2"],
      "freeActivities": ["activity1", "activity2"],
      "recommendedBudget": 0
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const text = response.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const optimization = JSON.parse(text);
    res.json({ success: true, optimization });

  } catch (error) {
    console.error("Budget optimization error:", error.message);
    res.status(500).json({ success: false, message: "Failed to optimize budget." });
  }
};