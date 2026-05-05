import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const SavedTrips = () => {
  const { logout } = useAuth();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await axiosInstance.get("/trips");
        console.log("API response:", data); // debug
        // ✅ API returns { success, trips: [...] }
        setTrips(data.trips || []);
      } catch (err) {
        console.log("Fetch error:", err.response?.data);
        setError("Could not load saved trips.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await axiosInstance.delete(`/trips/${id}`);
      // ✅ use _id not id
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Could not delete trip.");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const { data } = await axiosInstance.patch(`/trips/${id}/favorite`);
      setTrips((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, isFavorite: data.isFavorite } : t,
        ),
      );
    } catch {
      alert("Could not update favorite.");
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
          <Link to="/dashboard" className="sidebar-link">
            🏠 Dashboard
          </Link>
          <Link to="/saved-trips" className="sidebar-link active">
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

      {/* ── Main ── */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">💾 Saved Trips</h1>
            <p className="page-subtitle">
              All your planned adventures in one place
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-primary btn-sm">
            + New Trip
          </Link>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading your trips…</p>
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && trips.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🗺️</span>
            <h2>No saved trips yet</h2>
            <p>Generate an itinerary and save it to see it here.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Plan a Trip
            </Link>
          </div>
        )}

        {!loading && trips.length > 0 && (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div key={trip._id} className="trip-card">
                <div className="trip-card-header">
                  <h3 className="trip-title">{trip.title}</h3>
                  <span className="trip-badge">{trip.travelType}</span>
                </div>

                <div className="trip-meta">
                  {/* ✅ correct field names from MongoDB */}
                  <span>📅 {trip.numberOfDays} days</span>
                  <span>🌍 {trip.destination}</span>
                  <span>💰 ₹{trip.budget}</span>
                </div>

                <div className="trip-meta">
                  <span>🛫 From: {trip.source}</span>
                  <span>👥 {trip.numberOfTravelers} traveler(s)</span>
                </div>

                <p className="trip-date">
                  {/* ✅ correct timestamp field */}
                  Saved on{" "}
                  {new Date(trip.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <div className="trip-actions">
                  <Link
                    to={`/trips/${trip._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    👁 View
                  </Link>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleToggleFavorite(trip._id)}
                  >
                    {trip.isFavorite ? "❤️ Unfavorite" : "🤍 Favorite"}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(trip._id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedTrips;
