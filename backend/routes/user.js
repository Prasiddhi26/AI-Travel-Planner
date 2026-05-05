import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All user routes are protected (require login)

// @route   GET /api/users/profile
// @desc    Get the logged-in user's profile
// @access  Private
router.get("/profile", protect, getProfile);

// @route   PUT /api/users/profile
// @desc    Update the logged-in user's profile
// @access  Private
router.put("/profile", protect, updateProfile);

export default  router;