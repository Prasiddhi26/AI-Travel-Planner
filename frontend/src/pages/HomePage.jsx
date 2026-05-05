import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: "🤖", title: "AI-Powered Itineraries", desc: "Generate complete day-by-day trip plans in seconds using advanced AI." },
  { icon: "🗺️", title: "Smart Destination Picks", desc: "Get personalized destination recommendations based on your travel style." },
  { icon: "💾", title: "Save & Revisit Trips",   desc: "Store your favourite itineraries and access them anytime, anywhere." },
  { icon: "✏️", title: "Edit & Customise",        desc: "Tweak generated plans to match your exact preferences and budget." },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* ── Navbar ── */}
      <nav className="home-nav">
        <div className="nav-brand">
          <span>✈️</span> AI Travel Planner
        </div>
        <div className="nav-links">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Powered by AI ✨</span>
          <h1 className="hero-title">
            Plan Your Dream Trip<br />
            <span className="gradient-text">in Minutes, Not Hours</span>
          </h1>
          <p className="hero-subtitle">
            Describe where you want to go and let our AI craft a personalised,
            detailed travel itinerary — flights, hotels, activities and more.
          </p>
          <div className="hero-cta">
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn btn-primary btn-lg">
              Start Planning for Free
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card floating">
            <p className="hero-card-label">AI generating your trip…</p>
            <div className="hero-card-line" style={{ width: "80%" }} />
            <div className="hero-card-line" style={{ width: "60%" }} />
            <div className="hero-card-line" style={{ width: "90%" }} />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <h2 className="section-title">Everything you need to travel smarter</h2>
        <div className="features-grid">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="feature-card">
              <span className="feature-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <h2>Ready to explore the world?</h2>
        <p>Join thousands of travellers planning smarter with AI.</p>
        <Link to="/register" className="btn btn-white btn-lg">
          Create Free Account
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <p>© {new Date().getFullYear()} AI Travel Planner. Built with ❤️ and React.</p>
      </footer>
    </div>
  );
};

export default Home;