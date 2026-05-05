// ============================================================
// SearchFilter.jsx — Search + filter bar for destinations/trips
// ============================================================
import React, { useState, useEffect, useRef } from "react";
import { DESTINATION_CATEGORIES, CONTINENTS } from "../utils/constants";

/**
 * SearchFilter
 *
 * Props:
 *   onSearch    — (query: string) => void
 *   onFilter    — ({ category, continent, budget }) => void
 *   placeholder — input placeholder text
 *   showFilters — show category/continent pills  (default true)
 *   className   — extra class names
 */
const SearchFilter = ({
  onSearch,
  onFilter,
  placeholder = "Search destinations, cities, countries…",
  showFilters = true,
  className = "",
}) => {
  const [query,     setQuery]     = useState("");
  const [category,  setCategory]  = useState("All");
  const [continent, setContinent] = useState("All");
  const [open,      setOpen]      = useState(false); // mobile filter drawer

  const debounceRef = useRef(null);

  /* Debounce search */
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch && onSearch(query.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  /* Emit filter changes */
  useEffect(() => {
    onFilter && onFilter({ category, continent });
  }, [category, continent]);

  const clearAll = () => {
    setQuery("");
    setCategory("All");
    setContinent("All");
    onSearch && onSearch("");
    onFilter && onFilter({ category: "All", continent: "All" });
  };

  const hasActive =
    query || category !== "All" || continent !== "All";

  return (
    <>
      <style>{`
        .sf-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Search bar ── */
        .sf-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--card-bg, #111827);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 0 16px;
          transition: border-color 0.2s;
        }
        .sf-bar:focus-within {
          border-color: var(--accent, #38bdf8);
          box-shadow: 0 0 0 3px rgba(56,189,248,0.12);
        }
        .sf-icon { font-size: 1.1rem; color: var(--text-muted, #64748b); flex-shrink: 0; }
        .sf-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text, #f1f5f9);
          font-size: 0.95rem;
          padding: 14px 0;
          font-family: inherit;
        }
        .sf-input::placeholder { color: var(--text-muted, #64748b); }
        .sf-clear {
          background: none;
          border: none;
          color: var(--text-muted, #64748b);
          cursor: pointer;
          font-size: 1rem;
          padding: 4px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .sf-clear:hover { color: var(--text, #f1f5f9); background: rgba(255,255,255,0.06); }
        .sf-filter-toggle {
          background: rgba(56,189,248,0.1);
          border: 1px solid rgba(56,189,248,0.25);
          color: var(--accent, #38bdf8);
          padding: 6px 14px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          display: none;
          transition: background 0.2s;
        }
        .sf-filter-toggle:hover { background: rgba(56,189,248,0.18); }

        @media (max-width: 640px) {
          .sf-filter-toggle { display: block; }
          .sf-filters { display: none; }
          .sf-filters.open { display: flex; }
        }

        /* ── Filter pills ── */
        .sf-filters {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .sf-filter-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .sf-filter-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted, #64748b);
          width: 74px;
          flex-shrink: 0;
        }
        .sf-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .sf-pill {
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: var(--text-muted, #94a3b8);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          font-family: inherit;
          white-space: nowrap;
        }
        .sf-pill:hover {
          border-color: var(--accent, #38bdf8);
          color: var(--accent, #38bdf8);
        }
        .sf-pill.active {
          background: var(--accent, #38bdf8);
          border-color: var(--accent, #38bdf8);
          color: #000;
          font-weight: 700;
        }

        /* ── Active count + clear ── */
        .sf-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .sf-active-badge {
          font-size: 0.75rem;
          color: var(--accent, #38bdf8);
          font-weight: 600;
        }
        .sf-clear-all {
          background: none;
          border: none;
          font-size: 0.75rem;
          color: var(--text-muted, #64748b);
          cursor: pointer;
          text-decoration: underline;
          font-family: inherit;
          transition: color 0.2s;
        }
        .sf-clear-all:hover { color: var(--text, #f1f5f9); }
      `}</style>

      <div className={`sf-root ${className}`}>
        {/* ── Search bar ── */}
        <div className="sf-bar">
          <span className="sf-icon">🔍</span>
          <input
            className="sf-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Search"
          />
          {query && (
            <button className="sf-clear" onClick={() => setQuery("")} aria-label="Clear search">
              ✕
            </button>
          )}
          {showFilters && (
            <button
              className="sf-filter-toggle"
              onClick={() => setOpen((p) => !p)}
            >
              {open ? "▲ Filters" : "▼ Filters"}
            </button>
          )}
        </div>

        {/* ── Filters ── */}
        {showFilters && (
          <div className={`sf-filters ${open ? "open" : ""}`}>
            {/* Category */}
            <div className="sf-filter-row">
              <span className="sf-filter-label">Category</span>
              <div className="sf-pills">
                {DESTINATION_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`sf-pill ${category === cat ? "active" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Continent */}
            <div className="sf-filter-row">
              <span className="sf-filter-label">Region</span>
              <div className="sf-pills">
                {CONTINENTS.map((c) => (
                  <button
                    key={c}
                    className={`sf-pill ${continent === c ? "active" : ""}`}
                    onClick={() => setContinent(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear row */}
            {hasActive && (
              <div className="sf-actions">
                <span className="sf-active-badge">Filters active</span>
                <button className="sf-clear-all" onClick={clearAll}>
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchFilter;