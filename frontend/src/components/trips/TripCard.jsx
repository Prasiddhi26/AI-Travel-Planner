import { useState } from "react";
import axios from "../utils/axios";

const TripCard = ({ trip, onSave, onDelete, isSaved = false }) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [expanded, setExpanded] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post("/trips/save", { tripId: trip._id });
      setSaved(true);
      if (onSave) onSave(trip);
    } catch {
      // already saved or error
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    // Build printable HTML and trigger browser print-to-PDF
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${trip.destination} Itinerary</title>
        <style>
          body { font-family: Georgia, serif; max-width: 800px; margin: 40px auto; color: #1a202c; }
          h1 { font-size: 2rem; border-bottom: 2px solid #4299e1; padding-bottom: 0.5rem; }
          h2 { font-size: 1.3rem; color: #2b6cb0; margin-top: 2rem; }
          h3 { font-size: 1rem; color: #4a5568; }
          .meta { color: #718096; margin-bottom: 1rem; }
          .day { background: #f7fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
          .activity { padding: 0.5rem 0; border-bottom: 1px solid #e2e8f0; }
          .section { margin-bottom: 2rem; }
          ul { padding-left: 1.5rem; }
          li { margin-bottom: 0.4rem; }
        </style>
      </head>
      <body>
        <h1>✈ ${trip.destination} Travel Itinerary</h1>
        <p class="meta">
          📅 ${trip.startDate} → ${trip.endDate} &nbsp;|&nbsp;
          👥 ${trip.travelers} traveler(s) &nbsp;|&nbsp;
          💰 ${trip.budget} ${trip.currency}
        </p>
        ${trip.itinerary?.map(day => `
          <div class="day">
            <h2>Day ${day.day}: ${day.title || ""}</h2>
            ${day.activities?.map(a => `<div class="activity"><strong>${a.time || ""}</strong> — ${a.description}</div>`).join("") || ""}
          </div>`).join("") || ""}
        ${trip.hotels ? `<div class="section"><h2>🏨 Recommended Hotels</h2><ul>${trip.hotels.map(h => `<li><strong>${h.name}</strong> — ${h.price}/night (${h.rating}★)</li>`).join("")}</ul></div>` : ""}
        ${trip.transport ? `<div class="section"><h2>🚌 Transport</h2><ul>${trip.transport.map(t => `<li>${t.type}: ${t.description}</li>`).join("")}</ul></div>` : ""}
        ${trip.budget_breakdown ? `<div class="section"><h2>💰 Budget Breakdown</h2><ul>${Object.entries(trip.budget_breakdown).map(([k,v]) => `<li>${k}: ${v}</li>`).join("")}</ul></div>` : ""}
        ${trip.tips ? `<div class="section"><h2>💡 Travel Tips</h2><ul>${trip.tips.map(t => `<li>${t}</li>`).join("")}</ul></div>` : ""}
      </body>
      </html>
    `;
    const w = window.open("", "_blank");
    w.document.write(content);
    w.document.close();
    w.print();
  };

  const tabs = [
    { id: "itinerary", label: "📅 Itinerary" },
    { id: "hotels", label: "🏨 Hotels" },
    { id: "transport", label: "🚌 Transport" },
    { id: "budget", label: "💰 Budget" },
    { id: "weather", label: "🌤 Weather" },
    { id: "tips", label: "💡 Tips" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .trip-card {
          background: rgba(12,18,35,0.85);
          border: 1px solid rgba(99,179,237,0.15);
          border-radius: 24px;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(12px);
          animation: cardAppear 0.5s ease;
        }
        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .trip-card-header {
          background: linear-gradient(135deg, rgba(17,34,64,0.9), rgba(26,54,93,0.9));
          padding: 2rem 2rem 1.5rem;
          border-bottom: 1px solid rgba(99,179,237,0.12);
        }
        .card-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .card-destination {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #e2e8f0;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ai-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          background: linear-gradient(135deg, #63b3ed, #4299e1);
          color: #fff;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          font-weight: 600;
          letter-spacing: 0.05em;
          vertical-align: middle;
        }
        .card-actions {
          display: flex;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          border: none;
        }
        .btn-save {
          background: ${saved ? "rgba(72,187,120,0.15)" : "rgba(66,153,225,0.15)"};
          border: 1px solid ${saved ? "rgba(72,187,120,0.4)" : "rgba(99,179,237,0.4)"};
          color: ${saved ? "#68d391" : "#63b3ed"};
        }
        .btn-save:hover { transform: translateY(-1px); }
        .btn-pdf {
          background: rgba(237,137,54,0.15);
          border: 1px solid rgba(237,137,54,0.4);
          color: #ed8936;
        }
        .btn-pdf:hover { background: rgba(237,137,54,0.25); }
        .btn-delete {
          background: rgba(245,101,101,0.12);
          border: 1px solid rgba(245,101,101,0.3);
          color: #fc8181;
        }
        .btn-delete:hover { background: rgba(245,101,101,0.22); }
        .card-meta {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        .meta-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #718096;
          background: rgba(255,255,255,0.04);
          border-radius: 8px;
          padding: 0.3rem 0.75rem;
        }
        .meta-chip span { color: #a0aec0; font-weight: 500; }
        .trip-tabs {
          display: flex;
          overflow-x: auto;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 2rem;
          gap: 0;
          scrollbar-width: none;
        }
        .trip-tabs::-webkit-scrollbar { display: none; }
        .tab-btn {
          background: none;
          border: none;
          padding: 1rem 1.2rem;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          color: #4a5568;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: -1px;
        }
        .tab-btn.active {
          color: #63b3ed;
          border-bottom-color: #63b3ed;
        }
        .tab-btn:hover:not(.active) { color: #718096; }
        .trip-content {
          padding: 2rem;
        }
        .day-block {
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          overflow: hidden;
        }
        .day-header {
          background: rgba(66,153,225,0.08);
          padding: 0.9rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .day-num {
          background: linear-gradient(135deg, #4299e1, #2b6cb0);
          color: #fff;
          width: 28px; height: 28px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .day-title {
          color: #e2e8f0;
          font-size: 0.95rem;
          font-weight: 600;
          flex: 1;
        }
        .day-activities {
          padding: 1rem 1.2rem;
        }
        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          align-items: flex-start;
        }
        .activity-item:last-child { border-bottom: none; }
        .activity-time {
          font-size: 0.78rem;
          color: #4299e1;
          font-weight: 600;
          min-width: 60px;
          padding-top: 2px;
        }
        .activity-desc {
          color: #a0aec0;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }
        .hotel-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.2rem;
          transition: all 0.2s;
        }
        .hotel-item:hover { border-color: rgba(99,179,237,0.2); transform: translateY(-2px); }
        .hotel-name { color: #e2e8f0; font-weight: 600; margin-bottom: 0.4rem; font-size: 1rem; }
        .hotel-price { color: #48bb78; font-size: 0.9rem; font-weight: 600; }
        .hotel-stars { color: #ecc94b; font-size: 0.85rem; }
        .hotel-type { color: #718096; font-size: 0.82rem; margin-top: 0.25rem; }
        .transport-list, .tips-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .transport-item, .tip-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 1rem 1.2rem;
        }
        .transport-icon, .tip-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .transport-type { color: #63b3ed; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
        .transport-desc { color: #a0aec0; font-size: 0.9rem; margin-top: 2px; }
        .transport-price { color: #48bb78; font-size: 0.85rem; margin-top: 4px; font-weight: 600; }
        .budget-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .budget-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1.2rem;
          text-align: center;
        }
        .budget-category { color: #718096; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .budget-amount { color: #48bb78; font-size: 1.4rem; font-weight: 700; font-family: 'Playfair Display', serif; }
        .budget-total {
          grid-column: 1 / -1;
          background: rgba(66,153,225,0.08);
          border-color: rgba(99,179,237,0.2);
          text-align: center;
        }
        .budget-total .budget-amount { color: #63b3ed; font-size: 1.8rem; }
        .weather-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.75rem;
        }
        .weather-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }
        .weather-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .weather-desc { color: #a0aec0; font-size: 0.85rem; }
        .weather-temp { color: #e2e8f0; font-size: 1.1rem; font-weight: 700; margin: 0.25rem 0; }
        .tip-text { color: #a0aec0; font-size: 0.9rem; line-height: 1.5; }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #4a5568;
        }
        @media (max-width: 640px) {
          .card-destination { font-size: 1.5rem; }
          .card-actions { flex-wrap: wrap; }
          .trip-content { padding: 1.2rem; }
        }
      `}</style>

      <div className="trip-card">
        <div className="trip-card-header">
          <div className="card-title-row">
            <div>
              <div className="card-destination">
                {trip.destination} <span className="ai-badge">AI</span>
              </div>
              <div className="card-meta">
                {trip.startDate && <div className="meta-chip">📅 <span>{trip.startDate} → {trip.endDate}</span></div>}
                {trip.travelers && <div className="meta-chip">👥 <span>{trip.travelers} traveler(s)</span></div>}
                {trip.budget && <div className="meta-chip">💰 <span>{trip.budget} {trip.currency}</span></div>}
                {trip.tripType && <div className="meta-chip">🎯 <span>{trip.tripType}</span></div>}
              </div>
            </div>
            <div className="card-actions">
              {!saved && (
                <button className="action-btn btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? "⏳" : "🔖"} {saving ? "Saving..." : "Save"}
                </button>
              )}
              {saved && <button className="action-btn btn-save" disabled>✓ Saved</button>}
              <button className="action-btn btn-pdf" onClick={handleDownloadPDF}>📄 PDF</button>
              {onDelete && (
                <button className="action-btn btn-delete" onClick={() => onDelete(trip._id)}>🗑</button>
              )}
            </div>
          </div>
        </div>

        <div className="trip-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="trip-content">
          {activeTab === "itinerary" && (
            trip.itinerary?.length > 0
              ? trip.itinerary.map((day) => (
                  <div key={day.day} className="day-block">
                    <div className="day-header">
                      <div className="day-num">{day.day}</div>
                      <div className="day-title">{day.title || `Day ${day.day}`}</div>
                      <span style={{ color: "#4a5568", fontSize: "0.8rem" }}>{day.activities?.length || 0} activities</span>
                    </div>
                    <div className="day-activities">
                      {day.activities?.map((a, i) => (
                        <div key={i} className="activity-item">
                          <div className="activity-time">{a.time || "—"}</div>
                          <div className="activity-desc">{a.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              : <div className="empty-state">No itinerary data</div>
          )}

          {activeTab === "hotels" && (
            trip.hotels?.length > 0
              ? <div className="hotels-grid">
                  {trip.hotels.map((h, i) => (
                    <div key={i} className="hotel-item">
                      <div className="hotel-name">🏨 {h.name}</div>
                      <div className="hotel-stars">{"★".repeat(Math.round(h.rating || 4))}</div>
                      <div className="hotel-price">{h.price}/night</div>
                      <div className="hotel-type">{h.type || h.description}</div>
                    </div>
                  ))}
                </div>
              : <div className="empty-state">No hotel suggestions</div>
          )}

          {activeTab === "transport" && (
            trip.transport?.length > 0
              ? <div className="transport-list">
                  {trip.transport.map((t, i) => (
                    <div key={i} className="transport-item">
                      <div className="transport-icon">{t.icon || "🚌"}</div>
                      <div>
                        <div className="transport-type">{t.type}</div>
                        <div className="transport-desc">{t.description}</div>
                        {t.price && <div className="transport-price">{t.price}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              : <div className="empty-state">No transport data</div>
          )}

          {activeTab === "budget" && (
            trip.budget_breakdown
              ? <div className="budget-grid">
                  {Object.entries(trip.budget_breakdown).filter(([k]) => k !== "total").map(([key, val]) => (
                    <div key={key} className="budget-item">
                      <div className="budget-category">{key}</div>
                      <div className="budget-amount">{val}</div>
                    </div>
                  ))}
                  {trip.budget_breakdown.total && (
                    <div className="budget-item budget-total">
                      <div className="budget-category">Total Estimated</div>
                      <div className="budget-amount">{trip.budget_breakdown.total}</div>
                    </div>
                  )}
                </div>
              : <div className="empty-state">No budget breakdown</div>
          )}

          {activeTab === "weather" && (
            trip.weather?.length > 0
              ? <div className="weather-grid">
                  {trip.weather.map((w, i) => (
                    <div key={i} className="weather-item">
                      <div className="weather-icon">{w.icon || "🌤"}</div>
                      <div className="weather-temp">{w.temp || "—"}</div>
                      <div className="weather-desc">{w.description}</div>
                    </div>
                  ))}
                </div>
              : <div className="empty-state">No weather data available</div>
          )}

          {activeTab === "tips" && (
            trip.tips?.length > 0
              ? <div className="tips-list">
                  {trip.tips.map((tip, i) => (
                    <div key={i} className="tip-item">
                      <div className="tip-icon">💡</div>
                      <div className="tip-text">{tip}</div>
                    </div>
                  ))}
                </div>
              : <div className="empty-state">No travel tips</div>
          )}
        </div>
      </div>
    </>
  );
};

export default TripCard;