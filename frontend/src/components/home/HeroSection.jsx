import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,179,237,${p.alpha})`;
        ctx.fill();
      });
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,179,237,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  const stats = [
    { value: "50K+", label: "Trips Planned" },
    { value: "120+", label: "Countries" },
    { value: "4.9★", label: "User Rating" },
    { value: "AI", label: "Powered" },
  ];

  const destinations = ["🗼 Paris", "🏯 Tokyo", "🗽 New York", "🏛️ Rome", "🌴 Bali", "🏔️ Swiss Alps"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #050a14 0%, #0a1628 40%, #0d1f3c 70%, #071020 100%);
          padding: 100px 2rem 4rem;
        }
        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
        }
        .hero-glow-1 {
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(66,153,225,0.12) 0%, transparent 70%);
          top: -100px; right: -100px;
          pointer-events: none;
        }
        .hero-glow-2 {
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%);
          bottom: 50px; left: -50px;
          pointer-events: none;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          text-align: center;
          animation: heroFadeUp 0.9s ease both;
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,179,237,0.1);
          border: 1px solid rgba(99,179,237,0.25);
          border-radius: 100px;
          padding: 0.4rem 1.1rem;
          font-size: 0.82rem;
          color: #63b3ed;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1.8rem;
          animation: heroFadeUp 0.9s 0.1s ease both;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #63b3ed;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          font-weight: 900;
          line-height: 1.1;
          color: #f0f4f8;
          margin: 0 0 1.5rem;
          letter-spacing: -0.03em;
          animation: heroFadeUp 0.9s 0.2s ease both;
        }
        .title-highlight {
          background: linear-gradient(135deg, #63b3ed, #4299e1, #90cdf4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: #718096;
          max-width: 580px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
          font-weight: 400;
          animation: heroFadeUp 0.9s 0.3s ease both;
        }
        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: heroFadeUp 0.9s 0.4s ease both;
          margin-bottom: 3rem;
        }
        .btn-primary {
          background: linear-gradient(135deg, #4299e1, #2b6cb0);
          color: #fff;
          border: none;
          padding: 0.85rem 2.2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 8px 30px rgba(66,153,225,0.35);
          letter-spacing: 0.01em;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(66,153,225,0.5);
        }
        .btn-secondary {
          background: rgba(255,255,255,0.06);
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.85rem 2.2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }
        .hero-destinations {
          display: flex;
          gap: 0.6rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 4rem;
          animation: heroFadeUp 0.9s 0.5s ease both;
        }
        .dest-pill {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          padding: 0.35rem 0.9rem;
          font-size: 0.85rem;
          color: #a0aec0;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          cursor: default;
        }
        .dest-pill:hover {
          background: rgba(99,179,237,0.1);
          border-color: rgba(99,179,237,0.3);
          color: #63b3ed;
        }
        .hero-stats {
          display: flex;
          gap: 3rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: heroFadeUp 0.9s 0.6s ease both;
        }
        .stat-item {
          text-align: center;
        }
        .stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #63b3ed;
          display: block;
          line-height: 1;
        }
        .stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          color: #4a5568;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }
        .hero-scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #4a5568;
          font-size: 0.75rem;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          animation: scrollBounce 2s infinite;
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        .scroll-line {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, rgba(99,179,237,0.6), transparent);
        }
      `}</style>

      <section className="hero">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-glow-1" />
        <div className="hero-glow-2" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Travel Planning
          </div>

          <h1 className="hero-title">
            Plan Your Dream Trip<br />
            with <span className="title-highlight">Wandr.ai</span>
          </h1>

          <p className="hero-subtitle">
            Describe where you want to go. Our AI crafts a personalized itinerary
            complete with hotels, transport, budgets, and local tips — in seconds.
          </p>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => navigate(user ? "/plan" : "/register")}>
              ✨ Plan My Trip
            </button>
            <button className="btn-secondary" onClick={() => navigate(user ? "/dashboard" : "/login")}>
              {user ? "View Dashboard →" : "Sign In →"}
            </button>
          </div>

          <div className="hero-destinations">
            {destinations.map((d) => (
              <span key={d} className="dest-pill">{d}</span>
            ))}
          </div>

          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>
    </>
  );
};

export default Hero;