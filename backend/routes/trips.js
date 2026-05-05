import express from "express";

const router = express.Router();

import { protect } from "../middleware/auth.js";

import {
  createTrip,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  toggleFavorite,
  getTripStats
} from "../controllers/tripController.js";

router.use(protect); // All trip routes are protected

router.get('/stats', getTripStats);
router.route('/').get(getMyTrips).post(createTrip);
router.route('/:id').get(getTripById).put(updateTrip).delete(deleteTrip);
router.patch('/:id/favorite', toggleFavorite);

export default  router;