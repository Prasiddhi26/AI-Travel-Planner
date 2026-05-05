// ============================================================
// DestinationCard.jsx — Recommended destination display card
// ============================================================
import React, { useState } from "react";
import { formatRating, formatCount } from "../utils/formatDate";

/**
 * DestinationCard
 *
 * Props:
 *   destination — object from FEATURED_DESTINATIONS or API
 *   onSelect    — (destination) => void  — called when "Plan Trip" clicked
 *   compact     — boolean, renders a smaller card (default false)
 */
const DestinationCard = ({ destination, onSelect, compact = false }) => {
  const [imgError, setImgError]   = useState(false);
  const [hovered, setHovered]     = useState(false);

  if (!destination) return null;

  const {
    name,
    country,
    continent,
    category,
    image,
    rating,
    reviewCount,
    description,
    highlights = [],
    avgCost,
    bestTime,
  } = destination;

  const fallbackImg =
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80";

  /* ── Category badge colour map ── */
  const categoryColour = {
    Beach:      "#06b6d4",
    Mountain:   "#6366f1",
    City:       "#f59e0b",
    Cultural:   "#ec4899",
    Adventure:  "#ef4444",
    Nature:     "#22c55e",
    Historical: "#a78bfa",
    Island:     "#0ea5e9",
  };
  const badgeColour = categoryColour[category] || "var(--accent)";

  return (
    <>
      <style>{`
        .dest-card {
          border-radius: 20px;
          overflow: hidden;
          background: var(--card-bg, #111827);
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .dest-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        .dest-card__img-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: ${compact ? "16/9" : "4/3"};
        }
        .dest-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .dest-card:hover .dest-card__img {
          transform: scale(1.08);
        }
        .dest-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%);
        }
        .dest-card__badge {
          position: absolute;
          top: 14px;
          left: 14px;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
        }
        .dest-card__rating {
          position: absolute;
          bottom: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.8rem;
          color: #fbbf24;
          font-weight: 600;
        }
        .dest-card__body {
          padding: ${compact ? "14px" : "20px"};
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .dest-card__location {
          font-size: 0.72rem;
          color: var(--accent, #38bdf8);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .dest-card__name {
          font-size: ${compact ? "1.05rem" : "1.25rem"};
          font-weight: 700;
          color: var(--text, #f1f5f9);
          line-height: 1.2;
          margin: 0;
        }
        .dest-card__desc {
          font-size: 0.82rem;
          color: var(--text-muted, #94a3b8);
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: ${compact ? 2 : 3};
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dest-card__highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .dest-card__tag {
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 600;
          background: rgba(56,189,248,0.1);
          color: var(--accent, #38bdf8);
          border: 1px solid rgba(56,189,248,0.2);
          white-space: nowrap;
        }
        .dest-card__meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--text-muted, #94a3b8);
          padding-top: 4px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .dest-card__cta {
          margin-top: auto;
          padding: 10px 0 0;
        }
        .dest-card__btn {
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          border: none;
          background: var(--accent, #38bdf8);
          color: #000;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .dest-card__btn:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
      `}</style>

      <div
        className="dest-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onSelect && onSelect(destination)}
        title={name}
      >
        {/* Image */}
        <div className="dest-card__img-wrap">
          <img
            src={imgError ? fallbackImg : image}
            alt={name}
            className="dest-card__img"
            onError={() => setImgError(true)}
            loading="lazy"
          />
          <div className="dest-card__overlay" />

          {/* Category badge */}
          <span
            className="dest-card__badge"
            style={{ background: badgeColour }}
          >
            {category}
          </span>

          {/* Rating */}
          {rating && (
            <div className="dest-card__rating">
              ★ {formatRating(rating)}
              {reviewCount && (
                <span style={{ color: "#cbd5e1", fontWeight: 400 }}>
                  &nbsp;({formatCount(reviewCount)})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="dest-card__body">
          <div className="dest-card__location">
            {country} · {continent}
          </div>
          <h3 className="dest-card__name">{name}</h3>

          {!compact && description && (
            <p className="dest-card__desc">{description}</p>
          )}

          {highlights.length > 0 && (
            <div className="dest-card__highlights">
              {highlights.slice(0, 3).map((h) => (
                <span key={h} className="dest-card__tag">
                  {h}
                </span>
              ))}
            </div>
          )}

          {!compact && (avgCost || bestTime) && (
            <div className="dest-card__meta">
              {avgCost && <span>💰 {avgCost}</span>}
              {bestTime && <span>🗓 {bestTime}</span>}
            </div>
          )}

          <div className="dest-card__cta">
            <button
              className="dest-card__btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelect && onSelect(destination);
              }}
            >
              Plan This Trip →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DestinationCard;