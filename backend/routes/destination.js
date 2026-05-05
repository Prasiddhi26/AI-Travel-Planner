import express from "express";

const router = express.Router();

import {
  getDestination,
  getDestinations,
} from "../controllers/destinationController.js";

import { protect } from "../middleware/auth.js";



// @route   GET /api/destinations/filter?climate=tropical&budget=low
// @desc    Filter destinations by climate, budget, type, etc.
// @access  Private
router.get("/", protect, getDestinations);

// @route   GET /api/destinations/:id
// @desc    Get a single destination's details by ID
// @access  Private
router.get("/:id", protect, getDestination);

export default  router;