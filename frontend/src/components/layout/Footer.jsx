// ============================================================
// Footer.jsx — Professional site footer
// ============================================================
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const Footer = () => {
  const year = new Date().getFullYear();

  const navLinks = [
    {
      heading: "Product",
      links: [
        { label: "Home",         to: ROUTES.HOME },
        { label: "Dashboard",    to: ROUTES.DASHBOARD },
        { label: "Saved Trips",  to: ROUTES.SAVED_TRIPS },
        { label: "Profile",      to: ROUTES.PROFILE },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Us",     href: "#" },
        { label: "Blog",         href: "#" },
        { label: "Careers",      href: "#" },
        { label: "Press",        href: "#" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Use",   href: "#" },
        { label: "Cookie Policy",  href: "#" },
        { label: "Contact Us",     href: "#" },
      ],
    },
  ];

  const socials = [
    { icon: "𝕏", label: "Twitter",   href: "#" },
    { icon: "in", label: "LinkedIn",  href: "#" },
    { icon: "▶",  label: "YouTube",   href: "#" },
    { icon: "📸", label: "Instagram", href: "#" },
  ];

  return (
    <>
      <style>{`
        .footer {
          background: #080c14;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 72px 24px 32px;
          color: var(--text-muted, #64748b);
          font-size: 0.875rem;
        }
        .footer__inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px 32px;
          margin-bottom: 56px;
        }
        @media (max-width: 900px) {
          .footer__grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 540px) {
          .footer__grid {
            grid-template-columns: 1fr;
          }
        }

        /* Brand col */
        .footer__brand {}
        .footer__logo {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text, #f1f5f9);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .footer__logo span { color: var(--accent, #38bdf8); }
        .footer__tagline {
          line-height: 1.65;
          max-width: 280px;
          margin-bottom: 24px;
        }
        .footer__socials {
          display: flex;
          gap: 10px;
        }
        .footer__social-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-muted, #64748b);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 700;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .footer__social-btn:hover {
          background: rgba(56,189,248,0.12);
          color: var(--accent, #38bdf8);
          border-color: rgba(56,189,248,0.3);
        }

        /* Nav cols */
        .footer__col-heading {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text, #f1f5f9);
          margin: 0 0 18px;
        }
        .footer__links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .footer__link {
          color: var(--text-muted, #64748b);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer__link:hover { color: var(--text, #f1f5f9); }

        /* Bottom bar */
        .footer__bottom {
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer__copy { font-size: 0.8rem; }
        .footer__copy-accent { color: var(--accent, #38bdf8); font-weight: 600; }
        .footer__badges {
          display: flex;
          gap: 10px;
        }
        .footer__badge {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 0.68rem;
          font-weight: 600;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--text-muted, #64748b);
          letter-spacing: 0.05em;
        }
        .footer__badge.green {
          border-color: rgba(34,197,94,0.3);
          color: #22c55e;
          background: rgba(34,197,94,0.06);
        }
      `}</style>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__grid">
            {/* ── Brand ── */}
            <div className="footer__brand">
              <Link to={ROUTES.HOME} className="footer__logo">
                ✈️ AI<span>Travel</span>
              </Link>
              <p className="footer__tagline">
                Plan unforgettable journeys in seconds with the power of AI.
                Your next adventure is one conversation away.
              </p>
              <div className="footer__socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="footer__social-btn"
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Nav columns ── */}
            {navLinks.map((col) => (
              <div key={col.heading}>
                <h4 className="footer__col-heading">{col.heading}</h4>
                <ul className="footer__links">
                  {col.links.map((l) =>
                    l.to ? (
                      <li key={l.label}>
                        <Link to={l.to} className="footer__link">
                          {l.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={l.label}>
                        <a href={l.href} className="footer__link">
                          {l.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Bottom bar ── */}
          <div className="footer__bottom">
            <p className="footer__copy">
              © {year}{" "}
              <span className="footer__copy-accent">AITravel</span>. All rights
              reserved. Built with ❤️ and React.
            </p>
            <div className="footer__badges">
              <span className="footer__badge green">🟢 All Systems Operational</span>
              <span className="footer__badge">Powered by Claude AI</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;