import express from "express";
import { generateItinerary } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/ai/generate-itinerary
// @desc    Generate AI-powered travel itinerary using Gemini
// @access  Private (user must be logged in)
router.post("/generate-itinerary", protect, generateItinerary);

export default  router;