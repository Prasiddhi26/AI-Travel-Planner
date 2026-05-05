import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const { data } = await axiosInstance.get(`/trips/${id}`);
        setTrip(data.trip);
      } catch (err) {
        setError("Could not load trip details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  const handleToggleFavorite = async () => {
    try {
      const { data } = await axiosInstance.patch(`/trips/${id}/favorite`);
      setTrip((prev) => ({ ...prev, isFavorite: data.isFavorite }));
    } catch {
      alert("Could not update favorite.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await axiosInstance.delete(`/trips/${id}`);
      navigate("/saved-trips");
    } catch {
      alert("Could not delete trip.");
    }
  };

  if (loading) return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand"><span>✈️</span> AI Travel</div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link">🏠 Dashboard</Link>
          <Link to="/saved-trips" className="sidebar-link">💾 Saved Trips</Link>
          <Link to="/profile" className="sidebar-link">👤 Profile</Link>
        </nav>
        <button onClick={logout} className="sidebar-logout">🚪 Sign Out</button>
      </aside>
      <main className="main-content">
        <div className="loading-state"><div className="spinner" /><p>Loading trip…</p></div>
      </main>
    </div>
  );

  if (error) return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand"><span>✈️</span> AI Travel</div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link">🏠 Dashboard</Link>
          <Link to="/saved-trips" className="sidebar-link active">💾 Saved Trips</Link>
          <Link to="/profile" className="sidebar-link">👤 Profile</Link>
        </nav>
        <button onClick={logout} className="sidebar-logout">🚪 Sign Out</button>
      </aside>
      <main className="main-content">
        <div className="alert alert-error">{error}</div>
        <Link to="/saved-trips" className="btn btn-outline btn-sm">← Back to Trips</Link>
      </main>
    </div>
  );

  const currentDay = trip.itinerary?.[activeDay];

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand"><span>✈️</span> AI Travel</div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link">🏠 Dashboard</Link>
          <Link to="/saved-trips" className="sidebar-link active">💾 Saved Trips</Link>
          <Link to="/profile" className="sidebar-link">👤 Profile</Link>
        </nav>
        <button onClick={logout} className="sidebar-logout">🚪 Sign Out</button>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">

        {/* Header */}
        <div className="page-header">
          <div>
            <Link to="/saved-trips" className="btn btn-outline btn-sm" style={{ marginBottom: "8px", display: "inline-block" }}>
              ← Back
            </Link>
            <h1 className="page-title">{trip.title}</h1>
            <p className="page-subtitle">
              📅 {trip.numberOfDays} days &nbsp;·&nbsp;
              🌍 {trip.destination} &nbsp;·&nbsp;
              💰 ₹{trip.budget} &nbsp;·&nbsp;
              <span className="trip-badge">{trip.travelType}</span>
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-outline btn-sm" onClick={handleToggleFavorite}>
              {trip.isFavorite ? "❤️ Unfavorite" : "🤍 Favorite"}
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>
              🗑 Delete
            </button>
          </div>
        </div>

        {/* Trip Meta */}
        <div className="trip-card" style={{ marginBottom: "24px" }}>
          <div className="trip-meta" style={{ flexWrap: "wrap", gap: "16px" }}>
            <span>🛫 From: <strong>{trip.source}</strong></span>
            <span>👥 {trip.numberOfTravelers} traveler(s)</span>
            {trip.startDate && <span>📆 Start: {new Date(trip.startDate).toLocaleDateString('en-IN')}</span>}
            {trip.endDate && <span>📆 End: {new Date(trip.endDate).toLocaleDateString('en-IN')}</span>}
            <span>💱 {trip.currency}</span>
          </div>

          {/* Highlights */}
          {trip.highlights?.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <strong>✨ Highlights</strong>
              <ul style={{ margin: "8px 0 0 16px", lineHeight: "1.8" }}>
                {trip.highlights.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}
        </div>

        {/* Day Tabs */}
        {trip.itinerary?.length > 0 && (
          <>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
              {trip.itinerary.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`btn btn-sm ${activeDay === idx ? "btn-primary" : "btn-outline"}`}
                >
                  Day {day.day ?? idx + 1}
                </button>
              ))}
            </div>

            {/* Day Detail */}
            {currentDay && (
              <div className="trip-card" style={{ marginBottom: "24px" }}>
                <h2 style={{ marginBottom: "4px" }}>
                  Day {currentDay.day ?? activeDay + 1}
                  {currentDay.title ? ` — ${currentDay.title}` : ""}
                </h2>
                {currentDay.date && (
                  <p className="trip-date">{new Date(currentDay.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                )}
                {currentDay.description && (
                  <p style={{ margin: "12px 0", lineHeight: "1.7" }}>{currentDay.description}</p>
                )}

                {/* Activities */}
                {currentDay.activities?.length > 0 && (
                  <div style={{ marginTop: "16px" }}>
                    <strong>🗺️ Activities</strong>
                    <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      {currentDay.activities.map((act, i) => (
                        <div key={i} style={{ padding: "12px 16px", background: "var(--color-background-secondary)", borderRadius: "8px", borderLeft: "3px solid var(--color-border-primary)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                            <strong>{act.name || act.title || `Activity ${i + 1}`}</strong>
                            {act.duration && <span className="trip-badge">{act.duration}</span>}
                          </div>
                          {act.description && <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: "1.6", color: "var(--color-text-secondary)" }}>{act.description}</p>}
                          <div className="trip-meta" style={{ marginTop: "8px", fontSize: "13px", flexWrap: "wrap" }}>
                            {act.location && <span>📍 {act.location}</span>}
                            {act.estimatedCost != null && <span>💰 ₹{act.estimatedCost}</span>}
                            {act.time && <span>🕐 {act.time}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Accommodation */}
                {currentDay.accommodation && (
                  <div style={{ marginTop: "20px" }}>
                    <strong>🏨 Accommodation</strong>
                    <div style={{ marginTop: "10px", padding: "12px 16px", background: "var(--color-background-secondary)", borderRadius: "8px" }}>
                      <strong>{currentDay.accommodation.name}</strong>
                      {currentDay.accommodation.address && <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>📍 {currentDay.accommodation.address}</p>}
                      {currentDay.accommodation.estimatedCost != null && <p style={{ margin: "4px 0 0", fontSize: "14px" }}>💰 ₹{currentDay.accommodation.estimatedCost}</p>}
                      {currentDay.accommodation.notes && <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>{currentDay.accommodation.notes}</p>}
                    </div>
                  </div>
                )}

                {/* Meals */}
                {currentDay.meals?.length > 0 && (
                  <div style={{ marginTop: "20px" }}>
                    <strong>🍽️ Meals</strong>
                    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {currentDay.meals.map((meal, i) => (
                        <div key={i} style={{ padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: "8px" }}>
                          <span className="trip-badge" style={{ marginRight: "8px" }}>{meal.mealType || meal.type}</span>
                          <strong>{meal.name || meal.restaurant}</strong>
                          {meal.estimatedCost != null && <span style={{ marginLeft: "8px", fontSize: "13px" }}>💰 ₹{meal.estimatedCost}</span>}
                          {meal.description && <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--color-text-secondary)" }}>{meal.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentDay.estimatedDailyBudget != null && (
                  <p style={{ marginTop: "16px", fontWeight: "500" }}>
                    💵 Estimated daily spend: ₹{currentDay.estimatedDailyBudget}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Budget Breakdown */}
        {trip.budgetBreakdown && Object.keys(trip.budgetBreakdown).length > 0 && (
          <div className="trip-card" style={{ marginBottom: "24px" }}>
            <strong>💰 Budget Breakdown</strong>
            <div className="trip-meta" style={{ marginTop: "12px", flexWrap: "wrap", gap: "12px" }}>
              {Object.entries(trip.budgetBreakdown).map(([k, v]) => (
                <span key={k} style={{ padding: "6px 12px", background: "var(--color-background-secondary)", borderRadius: "20px", fontSize: "14px" }}>
                  {k}: ₹{v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Transport Options */}
        {trip.transportOptions?.length > 0 && (
          <div className="trip-card" style={{ marginBottom: "24px" }}>
            <strong>🚌 Transport Options</strong>
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {trip.transportOptions.map((t, i) => (
                <div key={i} style={{ padding: "10px 14px", background: "var(--color-background-secondary)", borderRadius: "8px" }}>
                  <strong>{t.transportType}</strong>
                  {t.duration && <span className="trip-badge" style={{ marginLeft: "8px" }}>{t.duration}</span>}
                  {t.description && <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--color-text-secondary)" }}>{t.description}</p>}
                  {t.estimatedCost != null && <p style={{ margin: "4px 0 0", fontSize: "13px" }}>💰 ₹{t.estimatedCost}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Packing List */}
        {trip.packingList?.length > 0 && (
          <div className="trip-card" style={{ marginBottom: "24px" }}>
            <strong>🎒 Packing List</strong>
            <ul style={{ margin: "10px 0 0 16px", lineHeight: "2", columns: "2" }}>
              {trip.packingList.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        )}

        {/* Travel Tips */}
        {trip.travelTips?.length > 0 && (
          <div className="trip-card" style={{ marginBottom: "24px" }}>
            <strong>💡 Travel Tips</strong>
            <ul style={{ margin: "10px 0 0 16px", lineHeight: "2" }}>
              {trip.travelTips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        )}

        {/* Weather Info */}
        {trip.weatherInfo && (
          <div className="trip-card" style={{ marginBottom: "24px" }}>
            <strong>🌤️ Weather Info</strong>
            <div className="trip-meta" style={{ marginTop: "10px", flexWrap: "wrap" }}>
              {trip.weatherInfo.season && <span>🌿 Season: {trip.weatherInfo.season}</span>}
              {trip.weatherInfo.temperature && <span>🌡️ {trip.weatherInfo.temperature}</span>}
              {trip.weatherInfo.conditions && <span>☁️ {trip.weatherInfo.conditions}</span>}
              {trip.weatherInfo.description && <p style={{ width: "100%", margin: "8px 0 0", fontSize: "14px" }}>{trip.weatherInfo.description}</p>}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ItineraryView;