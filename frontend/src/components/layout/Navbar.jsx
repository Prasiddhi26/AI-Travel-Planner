import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = user
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Plan Trip", path: "/plan" },
        { label: "Saved Trips", path: "/saved-trips" },
        { label: "Profile", path: "/profile" },
      ]
    : [
        { label: "Home", path: "/" },
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: all 0.4s ease;
          padding: 0 2rem;
        }
        .navbar.scrolled {
          background: rgba(10, 15, 30, 0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99, 179, 237, 0.15);
          box-shadow: 0 4px 40px rgba(0,0,0,0.3);
        }
        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #63b3ed, #4299e1, #2b6cb0);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 20px rgba(99,179,237,0.4);
        }
        .logo-text {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 700;
          background: linear-gradient(135deg, #e2e8f0, #63b3ed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.02em;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-link {
          text-decoration: none;
          color: #a0aec0;
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.01em;
        }
        .nav-link:hover, .nav-link.active {
          color: #e2e8f0;
          background: rgba(99,179,237,0.12);
        }
        .nav-link.active {
          color: #63b3ed;
        }
        .btn-logout {
          background: rgba(245,101,101,0.15);
          color: #fc8181;
          border: 1px solid rgba(245,101,101,0.3);
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-logout:hover {
          background: rgba(245,101,101,0.3);
          border-color: rgba(245,101,101,0.6);
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 6px;
          background: none;
          border: none;
        }
        .hamburger span {
          width: 24px; height: 2px;
          background: #a0aec0;
          border-radius: 2px;
          transition: all 0.3s;
        }
        .mobile-menu {
          display: none;
          position: fixed;
          top: 70px; left: 0; right: 0;
          background: rgba(10,15,30,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99,179,237,0.15);
          padding: 1rem 2rem 1.5rem;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 999;
        }
        .mobile-menu.open { display: flex; }
        .mobile-link {
          text-decoration: none;
          color: #a0aec0;
          font-size: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .mobile-link:hover { background: rgba(99,179,237,0.1); color: #e2e8f0; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <Link to="/" className="nav-logo">
            <div className="logo-icon">✈</div>
            <span className="logo-text">Wandr.ai</span>
          </Link>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user && (
              <li>
                <button className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="mobile-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        {user && (
          <button
            className="btn-logout"
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            style={{ marginTop: "0.5rem", textAlign: "left" }}
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;