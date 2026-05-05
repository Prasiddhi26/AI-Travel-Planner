import Trip from '../models/Trip.js';

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
export const createTrip = async (req, res) => {
  try {
      console.log('Full body received:', JSON.stringify(req.body, null, 2)); // add this
  console.log('travelType raw value:', req.body.travelType);
  console.log('travelType lowercased:', req.body.travelType?.toLowerCase());

    const {
      source, destination, numberOfDays, budget, travelType,
      title, currency, startDate, endDate, numberOfTravelers,
      itinerary, budgetBreakdown, highlights, packingList,
      travelTips, weatherInfo, transportOptions, tags, coverImage, preferences
    } = req.body;

    // Normalize travelType to lowercase to match enum
    const normalizedTravelType = travelType?.toLowerCase();

    const validTypes = ['adventure', 'relaxing', 'cultural', 'family', 'solo', 'romantic', 'budget'];
    if (!validTypes.includes(normalizedTravelType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid travelType. Must be one of: ${validTypes.join(', ')}`
      });
    }

    if (!source || !destination || !numberOfDays || !budget || !travelType || !title) {
      return res.status(400).json({
        success: false,
        message: 'Please provide: title, source, destination, numberOfDays, budget, travelType'
      });
    }

    // Add this after the validTypes check, before tripData
const sanitizedItinerary = (itinerary || []).map(day => ({
  ...day,
  accommodation: day.accommodation || undefined,
  activities: (day.activities || []).map(act => ({
    ...act,
    type: undefined  // remove type to avoid enum conflicts
  }))
}));

    const tripData = {
  user: req.user._id,
  title,
  source,
  destination,
  numberOfDays: Number(numberOfDays),
  budget: Number(budget),
  travelType: normalizedTravelType,
  currency: currency || 'INR',
  numberOfTravelers: numberOfTravelers || 1,
  startDate: startDate || null,
  endDate: endDate || null,
  itinerary: sanitizedItinerary,        // ← changed
  budgetBreakdown: budgetBreakdown || undefined,
  highlights: highlights || [],
  packingList: packingList || [],
  travelTips: travelTips || [],
  weatherInfo: weatherInfo || undefined,
  transportOptions: (transportOptions || []).map(t => ({   // ← changed
    transportType: t.type || t.transportType || '',
    description: t.description || '',
    estimatedCost: t.estimatedCost || 0,
    duration: t.duration || ''
  })),
  tags: tags || [],
  coverImage: coverImage || '',
  aiGenerated: true,
};

    const trip = await Trip.create(tripData);
    res.status(201).json({ success: true, message: 'Trip created successfully!', trip });

  } catch (error) {
    console.error('Create trip error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Failed to create trip.' });
  }
};

// @desc    Get all trips for logged-in user
// @route   GET /api/trips
// @access  Private
export const getMyTrips = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, isFavorite, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;
    if (isFavorite !== undefined) query.isFavorite = isFavorite === 'true';
    if (search) query.$text = { $search: search };

    const sortOrder = order === 'asc' ? 1 : -1;
    const total = await Trip.countDocuments(query);
    const trips = await Trip.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-itinerary');

    res.json({ success: true, count: trips.length, total, trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch trips.' });
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    res.json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch trip.' });
  }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
// @access  Private
export const updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Trip updated successfully!', trip });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update trip.' });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
// @access  Private
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    await trip.deleteOne();
    res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete trip.' });
  }
};

// @desc    Toggle favorite
// @route   PATCH /api/trips/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found.' });
    trip.isFavorite = !trip.isFavorite;
    await trip.save();
    res.json({ success: true, isFavorite: trip.isFavorite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update favorite.' });
  }
};

// @desc    Get trip stats
// @route   GET /api/trips/stats
// @access  Private
export const getTripStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [totalTrips, favoriteTrips, upcomingTrips] = await Promise.all([
      Trip.countDocuments({ user: userId }),
      Trip.countDocuments({ user: userId, isFavorite: true }),
      Trip.find({ user: userId, startDate: { $gte: new Date() } })
        .sort({ startDate: 1 }).limit(3)
        .select('title destination startDate numberOfDays travelType')
    ]);

    res.json({ success: true, stats: { totalTrips, favoriteTrips, upcomingTrips } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats.' });
  }
};