import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  time: String,
  activity: String,
  location: String,
  description: String,
  estimatedCost: Number,
  // ✅ removed strict enum so AI values don't cause cast errors
  type: String
}, { _id: false });

// ✅ Add this BEFORE dayPlanSchema
const accommodationSchema = new mongoose.Schema({
  name: String,
  type: String,
  estimatedCost: Number,
  rating: Number,
  address: String
}, { _id: false });

// ✅ Then update dayPlanSchema to use it
const dayPlanSchema = new mongoose.Schema({
  day: Number,
  date: String,
  title: String,
  description: String,
  activities: [activitySchema],
  accommodation: accommodationSchema,  // ← use schema instead of inline object
  meals: {
    breakfast: String,
    lunch: String,
    dinner: String
  },
  localTips: [String],
  estimatedDailyBudget: Number
}, { _id: false });

const budgetBreakdownSchema = new mongoose.Schema({
  accommodation: Number,
  food: Number,
  transport: Number,
  activities: Number,
  shopping: Number,
  miscellaneous: Number,
  total: Number,
  currency: { type: String, default: 'INR' }
}, { _id: false });

// ✅ separate schema for transportOptions to avoid 'type' reserved word conflict
const transportOptionSchema = new mongoose.Schema({
  transportType: String,
  description: String,
  estimatedCost: Number,
  duration: String
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  source: {
    type: String,
    required: [true, 'Source location is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  numberOfDays: {
    type: Number,
    required: [true, 'Number of days is required'],
    min: [1, 'Minimum 1 day'],
    max: [30, 'Maximum 30 days']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  startDate: { type: Date },
  endDate: { type: Date },
  travelType: {
    type: String,
    enum: ['adventure', 'relaxing', 'cultural', 'family', 'solo', 'romantic', 'budget'],
    required: true
  },
  numberOfTravelers: {
    type: Number,
    default: 1,
    min: 1
  },
  itinerary: [dayPlanSchema],
  budgetBreakdown: budgetBreakdownSchema,
  highlights: [String],
  packingList: [String],
  travelTips: [String],
  weatherInfo: {
    season: String,
    avgTemperature: String,
    description: String,
    bestTime: String
  },
  // ✅ using separate schema instead of inline object with 'type'
  transportOptions: [transportOptionSchema],
  status: {
    type: String,
    enum: ['draft', 'planned', 'ongoing', 'completed'],
    default: 'planned'
  },
  isFavorite: { type: Boolean, default: false },
  tags: [String],
  coverImage: { type: String, default: '' },
  aiGenerated: { type: Boolean, default: true }
}, {
  timestamps: true
});

tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ destination: 'text', title: 'text' });

export default mongoose.model('Trip', tripSchema);