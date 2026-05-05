// ============================================================
// formatDate.js — Date & text formatting helpers
// ============================================================

/**
 * Format a date string or Date object into a readable format.
 * @param {string|Date} date
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export const formatDate = (
  date,
  options = { year: "numeric", month: "long", day: "numeric" }
) => {
  if (!date) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  } catch {
    return "Invalid date";
  }
};

/**
 * Short date: "Jan 5, 2025"
 */
export const formatShortDate = (date) =>
  formatDate(date, { year: "numeric", month: "short", day: "numeric" });

/**
 * Relative time: "3 days ago", "just now", etc.
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);
  const weeks   = Math.floor(days / 7);
  const months  = Math.floor(days / 30);
  const years   = Math.floor(days / 365);

  if (seconds < 10)  return "just now";
  if (seconds < 60)  return `${seconds} seconds ago`;
  if (minutes < 60)  return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24)    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7)      return `${days} day${days !== 1 ? "s" : ""} ago`;
  if (weeks < 4)     return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  if (months < 12)   return `${months} month${months !== 1 ? "s" : ""} ago`;
  return `${years} year${years !== 1 ? "s" : ""} ago`;
};

/**
 * Format trip duration: 7 → "7 days"
 */
export const formatDuration = (days) => {
  if (!days && days !== 0) return "N/A";
  if (days === 1) return "1 day";
  if (days === 7) return "1 week";
  if (days === 14) return "2 weeks";
  if (days === 30) return "1 month";
  return `${days} days`;
};

/**
 * Capitalise first letter of each word.
 */
export const titleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

/**
 * Truncate long text with an ellipsis.
 * @param {string} text
 * @param {number} maxLength
 */
export const truncate = (text, maxLength = 120) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength).trimEnd() + "…" : text;
};

/**
 * Format currency: 1500 → "$1,500"
 */
export const formatCurrency = (amount, currency = "USD") => {
  if (amount === null || amount === undefined) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a star rating number into a display string.
 * 4.857 → "4.9"
 */
export const formatRating = (rating) => {
  if (!rating && rating !== 0) return "N/A";
  return Number(rating).toFixed(1);
};

/**
 * Format large numbers: 12483 → "12.5K"
 */
export const formatCount = (count) => {
  if (!count && count !== 0) return "0";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000)     return `${(count / 1_000).toFixed(1)}K`;
  return String(count);
};

/**
 * Build an itinerary date range string.
 * startDate + duration → "Jun 10 – Jun 17, 2025"
 */
export const formatTripDateRange = (startDate, durationDays) => {
  if (!startDate) return "Dates not set";
  const start = new Date(startDate);
  const end   = new Date(start);
  end.setDate(end.getDate() + (durationDays || 0));
  const opts = { month: "short", day: "numeric" };
  const startStr = new Intl.DateTimeFormat("en-US", opts).format(start);
  const endStr   = new Intl.DateTimeFormat("en-US", {
    ...opts,
    year: "numeric",
  }).format(end);
  return `${startStr} – ${endStr}`;
};