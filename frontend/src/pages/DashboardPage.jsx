import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const TRIP_STYLES = [
  "Adventure",
  "Relaxing",
  "Cultural",
  "Family",
  "Romantic",
  "Budget",
  "Solo",
];

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Adventure");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(10000);
  const [source, setSource] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [travelers, setTravelers] = useState(1);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setItinerary(null);
    setSaveMsg("");

    try {
      const { data } = await axiosInstance.post("/ai/generate-itinerary", {
        source: source || "Not specified",
        destination: prompt,
        numberOfDays: Number(days),
        budget: Number(budget),
        travelType: style.toLowerCase(),
        currency: "INR",
        numberOfTravelers: Number(travelers), // ← fixed
      });
      setItinerary(data.itinerary);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate itinerary. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!itinerary) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await axiosInstance.post("/trips", {
        title: itinerary.title || `${style} Trip to ${prompt}`,
        source: source || "Not specified",
        destination: prompt,
        numberOfDays: Number(days),
        budget: Number(budget),
        travelType: style.toLowerCase(),
        currency: "INR",
        numberOfTravelers: Number(travelers), // ← fixed
        itinerary: itinerary.itinerary || [],
        budgetBreakdown: itinerary.budgetBreakdown || {},
        highlights: itinerary.highlights || [],
        packingList: itinerary.packingList || [],
        travelTips: itinerary.travelTips || [],
        weatherInfo: itinerary.weatherInfo || {},
        transportOptions: (itinerary.transportOptions || []).map((t) => ({
          transportType: t.type || t.transportType || "",
          description: t.description || "",
          estimatedCost: t.estimatedCost || 0,
          duration: t.duration || "",
        })),
      });
      setSaveMsg("✅ Trip saved successfully!");
    } catch (err) {
      console.log("SAVE ERROR:", err.response?.data);
      setSaveMsg("❌ Could not save trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span>✈️</span> AI Travel
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link active">
            🏠 Dashboard
          </Link>
          <Link to="/saved-trips" className="sidebar-link">
            💾 Saved Trips
          </Link>
          <Link to="/profile" className="sidebar-link">
            👤 Profile
          </Link>
        </nav>
        <button onClick={logout} className="sidebar-logout">
          🚪 Sign Out
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="page-subtitle">Where do you want to go next?</p>
        </div>

        {/* ── Generator Form ── */}
        <div className="card generator-card">
          <h2 className="card-title">✨ Generate an Itinerary</h2>
          <form onSubmit={handleGenerate} className="generator-form">
            <div className="form-group">
              <label>Destination</label>
              <input
                type="text"
                placeholder='e.g. "Goa", "Paris", "Tokyo"'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Traveling From (optional)</label>
              <input
                type="text"
                placeholder='e.g. "Mumbai", "Delhi"'
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Travel Style</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                >
                  {TRIP_STYLES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Travelers</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Budget (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" /> Generating…
                </>
              ) : (
                "🪄 Generate Itinerary"
              )}
            </button>
          </form>
        </div>

        {/* ── Generated Itinerary ── */}
        {itinerary && (
          <div className="card itinerary-card">
            {/* Header */}
            <div className="itinerary-header">
              <div>
                <h2 className="card-title">
                  {itinerary.title || "Your Itinerary"}
                </h2>
                <p className="itinerary-meta">
                  📅 {itinerary.itinerary?.length} days · 🌍 {prompt}
                </p>
              </div>
              <button
                onClick={handleSave}
                className="btn btn-outline btn-sm"
                disabled={saving}
              >
                {saving ? "Saving…" : "💾 Save Trip"}
              </button>
            </div>

            {saveMsg && (
              <p style={{ marginBottom: "1rem", fontWeight: 500 }}>{saveMsg}</p>
            )}

            {/* Highlights */}
            {itinerary.highlights?.length > 0 && (
              <div className="highlights-section">
                <h3>✨ Highlights</h3>
                <div className="highlights-list">
                  {itinerary.highlights.map((h, i) => (
                    <span key={i} className="highlight-tag">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weather */}
            {itinerary.weatherInfo && (
              <div className="weather-section">
                <h3>🌤 Weather Info</h3>
                <p>{itinerary.weatherInfo.description}</p>
                <p>
                  🌡 {itinerary.weatherInfo.avgTemperature} · Best time:{" "}
                  {itinerary.weatherInfo.bestTime}
                </p>
              </div>
            )}

            {/* Day-wise Plan */}
            <div className="itinerary-body">
              <h3>🗓 Day-wise Plan</h3>
              {itinerary.itinerary?.map((day, i) => (
                <div key={i} className="day-block">
                  <h4 className="day-title">
                    Day {day.day} — {day.title}
                  </h4>
                  <p className="day-description">{day.description}</p>

                  {/* Activities */}
                  <ul className="activity-list">
                    {day.activities?.map((act, j) => (
                      <li key={j} className="activity-item">
                        <span className="activity-time">{act.time}</span>
                        <div className="activity-details">
                          <strong>{act.activity}</strong>
                          <span className="activity-location">
                            {" "}
                            📍 {act.location}
                          </span>
                          {act.description && <p>{act.description}</p>}
                          {act.estimatedCost > 0 && (
                            <span className="activity-cost">
                              💰 ₹{act.estimatedCost}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Meals */}
                  {day.meals && (
                    <div className="meals-section">
                      <h5>🍽 Meals</h5>
                      <p>🌅 {day.meals.breakfast}</p>
                      <p>☀️ {day.meals.lunch}</p>
                      <p>🌙 {day.meals.dinner}</p>
                    </div>
                  )}

                  {/* Accommodation */}
                  {day.accommodation?.name && (
                    <div className="accommodation-section">
                      <h5>🏨 Stay: {day.accommodation.name}</h5>
                      <p>
                        ₹{day.accommodation.estimatedCost}/night · ⭐{" "}
                        {day.accommodation.rating}
                      </p>
                    </div>
                  )}

                  {/* Local Tips */}
                  {day.localTips?.length > 0 && (
                    <div className="tips-section">
                      <h5>💡 Local Tips</h5>
                      <ul>
                        {day.localTips.map((t, k) => (
                          <li key={k}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="daily-budget">
                    💵 Est. Daily Budget: ₹{day.estimatedDailyBudget}
                  </p>
                </div>
              ))}
            </div>

            {/* Budget Breakdown */}
            {itinerary.budgetBreakdown && (
              <div className="budget-section">
                <h3>💰 Budget Breakdown</h3>
                <div className="budget-grid">
                  <div>
                    🏨 Accommodation: ₹{itinerary.budgetBreakdown.accommodation}
                  </div>
                  <div>🍽 Food: ₹{itinerary.budgetBreakdown.food}</div>
                  <div>
                    🚗 Transport: ₹{itinerary.budgetBreakdown.transport}
                  </div>
                  <div>
                    🎭 Activities: ₹{itinerary.budgetBreakdown.activities}
                  </div>
                  <div>🛍 Shopping: ₹{itinerary.budgetBreakdown.shopping}</div>
                  <div>📦 Misc: ₹{itinerary.budgetBreakdown.miscellaneous}</div>
                </div>
                <h4>Total: ₹{itinerary.budgetBreakdown.total}</h4>
              </div>
            )}

            {/* Packing List */}
            {itinerary.packingList?.length > 0 && (
              <div className="packing-section">
                <h3>🎒 Packing List</h3>
                <ul className="packing-list">
                  {itinerary.packingList.map((item, i) => (
                    <li key={i}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Travel Tips */}
            {itinerary.travelTips?.length > 0 && (
              <div className="tips-section">
                <h3>📌 Travel Tips</h3>
                <ul>
                  {itinerary.travelTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-nav">
        <Link to="/dashboard" className="mobile-nav-link active">
          <span>🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/saved-trips" className="mobile-nav-link">
          <span>💾</span>
          <span>Trips</span>
        </Link>
        <Link to="/profile" className="mobile-nav-link">
          <span>👤</span>
          <span>Profile</span>
        </Link>
        <button onClick={logout} className="mobile-nav-link mobile-nav-btn">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
