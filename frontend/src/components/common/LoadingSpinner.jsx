// ============================================================
// LoadingSpinner.jsx — Flexible loading indicator component
// ============================================================
import React from "react";

/**
 * LoadingSpinner
 *
 * Props:
 *   size      — "sm" | "md" | "lg" | "xl"   (default "md")
 *   variant   — "spinner" | "dots" | "pulse" (default "spinner")
 *   label     — optional text shown below
 *   fullPage  — centres spinner in the full viewport
 *   className — additional classes
 */
const LoadingSpinner = ({
  size = "md",
  variant = "spinner",
  label = "",
  fullPage = false,
  className = "",
}) => {
  /* ── size map ── */
  const sizeMap = {
    sm: { ring: 20, border: 2, dot: 6,  text: "0.7rem" },
    md: { ring: 40, border: 3, dot: 10, text: "0.875rem" },
    lg: { ring: 60, border: 4, dot: 14, text: "1rem" },
    xl: { ring: 80, border: 5, dot: 18, text: "1.125rem" },
  };
  const s = sizeMap[size] || sizeMap.md;

  /* ── spinner variant ── */
  const Spinner = () => (
    <div
      style={{
        width:  s.ring,
        height: s.ring,
        border: `${s.border}px solid rgba(255,255,255,0.12)`,
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "ls-spin 0.75s linear infinite",
      }}
    />
  );

  /* ── dots variant ── */
  const Dots = () => (
    <div style={{ display: "flex", gap: s.dot * 0.6, alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width:  s.dot,
            height: s.dot,
            borderRadius: "50%",
            background: "var(--accent)",
            animation: `ls-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );

  /* ── pulse variant ── */
  const Pulse = () => (
    <div style={{ position: "relative", width: s.ring, height: s.ring }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "var(--accent)",
          opacity: 0.3,
          animation: "ls-pulse 1.5s ease-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "20%",
          borderRadius: "50%",
          background: "var(--accent)",
        }}
      />
    </div>
  );

  const variantMap = { spinner: Spinner, dots: Dots, pulse: Pulse };
  const Visual = variantMap[variant] || Spinner;

  /* ── wrapper ── */
  const wrapperStyle = fullPage
    ? {
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "rgba(10,10,20,0.7)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
      }
    : {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      };

  return (
    <>
      <style>{`
        @keyframes ls-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ls-bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40%            { transform: scale(1); opacity: 1; }
        }
        @keyframes ls-pulse {
          0%   { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      <div style={wrapperStyle} className={className} role="status" aria-label="Loading">
        <Visual />
        {label && (
          <p
            style={{
              margin: 0,
              color: "var(--text-muted)",
              fontSize: s.text,
              letterSpacing: "0.03em",
            }}
          >
            {label}
          </p>
        )}
      </div>
    </>
  );
};

/* ── Page-level skeleton preset ── */
export const PageLoader = ({ label = "Loading…" }) => (
  <LoadingSpinner fullPage variant="spinner" size="lg" label={label} />
);

/* ── Button-level inline spinner ── */
export const ButtonSpinner = () => (
  <LoadingSpinner size="sm" variant="spinner" />
);

export default LoadingSpinner;