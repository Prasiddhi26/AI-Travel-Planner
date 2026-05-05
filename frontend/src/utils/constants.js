// ============================================================
// constants.js — App-wide constants for AI Travel Planner
// ============================================================

export const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "https://ai-travel-planner-7j0u.onrender.com/api";

// ── Auth ────────────────────────────────────────────────────
export const TOKEN_KEY = "travel_planner_token";
export const USER_KEY  = "travel_planner_user";

// ── Trip / Itinerary ────────────────────────────────────────
export const TRIP_DURATIONS = [
  { label: "Weekend (2–3 days)", value: 3 },
  { label: "Short Trip (4–5 days)", value: 5 },
  { label: "One Week (7 days)", value: 7 },
  { label: "Two Weeks (14 days)", value: 14 },
  { label: "Three Weeks (21 days)", value: 21 },
  { label: "One Month (30 days)", value: 30 },
];

export const BUDGET_RANGES = [
  { label: "Budget (< $500)", value: "budget" },
  { label: "Mid-Range ($500–$2,000)", value: "mid-range" },
  { label: "Luxury ($2,000+)", value: "luxury" },
];

export const TRAVEL_STYLES = [
  { label: "Adventure", value: "adventure", icon: "🧗" },
  { label: "Cultural", value: "cultural", icon: "🏛️" },
  { label: "Relaxation", value: "relaxation", icon: "🏖️" },
  { label: "Foodie", value: "foodie", icon: "🍜" },
  { label: "Nature", value: "nature", icon: "🌿" },
  { label: "City Exploration", value: "city", icon: "🌆" },
  { label: "Road Trip", value: "road-trip", icon: "🚗" },
  { label: "Family", value: "family", icon: "👨‍👩‍👧" },
];

// ── Destination Categories ───────────────────────────────────
export const DESTINATION_CATEGORIES = [
  "All",
  "Beach",
  "Mountain",
  "City",
  "Cultural",
  "Adventure",
  "Nature",
  "Historical",
  "Island",
];

export const CONTINENTS = [
  "All",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa",
  "Oceania",
];

// ── Featured Destinations (fallback / mock data) ─────────────
export const FEATURED_DESTINATIONS = [
  {
    id: 1,
    name: "Kyoto, Japan",
    country: "Japan",
    continent: "Asia",
    category: "Cultural",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    rating: 4.9,
    reviewCount: 12483,
    description:
      "Ancient temples, serene bamboo forests and traditional tea ceremonies await in Japan's cultural heart.",
    highlights: ["Fushimi Inari", "Arashiyama", "Geisha Districts"],
    avgCost: "$150/day",
    bestTime: "Mar–May, Oct–Nov",
  },
  {
    id: 2,
    name: "Santorini, Greece",
    country: "Greece",
    continent: "Europe",
    category: "Island",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    rating: 4.8,
    reviewCount: 9821,
    description:
      "Iconic blue-domed churches, dramatic caldera views and extraordinary sunsets over the Aegean Sea.",
    highlights: ["Oia Village", "Caldera Views", "Black Sand Beach"],
    avgCost: "$200/day",
    bestTime: "Apr–Oct",
  },
  {
    id: 3,
    name: "Machu Picchu, Peru",
    country: "Peru",
    continent: "South America",
    category: "Historical",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
    rating: 4.9,
    reviewCount: 8204,
    description:
      "The legendary Incan citadel floating above the clouds — one of humanity's most breathtaking achievements.",
    highlights: ["Sun Gate", "Huayna Picchu", "Inca Trail"],
    avgCost: "$100/day",
    bestTime: "May–Oct",
  },
  {
    id: 4,
    name: "Safari, Kenya",
    country: "Kenya",
    continent: "Africa",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    rating: 4.8,
    reviewCount: 5632,
    description:
      "Witness the great wildebeest migration and the Big Five across endless golden savannahs.",
    highlights: ["Masai Mara", "Amboseli", "Lake Nakuru"],
    avgCost: "$300/day",
    bestTime: "Jul–Oct",
  },
  {
    id: 5,
    name: "Bali, Indonesia",
    country: "Indonesia",
    continent: "Asia",
    category: "Beach",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.7,
    reviewCount: 15890,
    description:
      "Terraced rice paddies, sacred temples and turquoise waves make Bali a perennial paradise.",
    highlights: ["Ubud", "Tanah Lot", "Seminyak Beach"],
    avgCost: "$80/day",
    bestTime: "Apr–Oct",
  },
  {
    id: 6,
    name: "Patagonia, Argentina",
    country: "Argentina",
    continent: "South America",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
    rating: 4.9,
    reviewCount: 3241,
    description:
      "Towering granite spires, vast glaciers and raw wilderness at the edge of the world.",
    highlights: ["Torres del Paine", "Perito Moreno", "Los Glaciares"],
    avgCost: "$120/day",
    bestTime: "Nov–Mar",
  },
];

// ── Toast / Notification ─────────────────────────────────────
export const TOAST_DURATION = 3500; // ms

// ── Pagination ───────────────────────────────────────────────
export const TRIPS_PER_PAGE = 6;
export const DESTINATIONS_PER_PAGE = 9;

// ── Routes ───────────────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  SAVED_TRIPS: "/saved-trips",
  PROFILE: "/profile",
};