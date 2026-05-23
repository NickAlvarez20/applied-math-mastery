import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import "@/styles/pages/landing.css";

const stats = [
  { value: "4 Subjects", label: "Fully covered" },
  { value: "20+ Topics", label: "With real-world context" },
  { value: "$30k+", label: "Avg salary boost" },
  { value: "100% Free", label: "Open source" },
];

const features = [
  {
    icon: "🧠",
    title: "Forge Mode learning",
    desc: "Concepts taught through stories, visual simulations, and real-world applications — never rote memorisation.",
  },
  {
    icon: "💼",
    title: "Career impact cards",
    desc: "Every topic shows exactly which careers it unlocks and the salary premium mastery brings.",
  },
  {
    icon: "⚠️",
    title: "Pitfall decoder",
    desc: "Animated breakdowns of where 70–80% of students get stuck — and the exact fix strategy.",
  },
  {
    icon: "🎮",
    title: "Gamified progress",
    desc: "XP, streaks, levels, and rare achievement badges keep you motivated every session.",
  },
  {
    icon: "📊",
    title: "Adaptive exercises",
    desc: "The exercise engine adjusts difficulty based on your performance so you're always challenged.",
  },
  {
    icon: "🏆",
    title: "Global leaderboard",
    desc: "Compete with learners worldwide on weekly and all-time rankings.",
  },
];

const pitfallPreviews = [
  {
    subject: "Algebra",
    pct: 78,
    issue: "Not applying operations to both sides",
  },
  { subject: "Calculus", pct: 81, issue: "Forgetting the chain rule" },
  {
    subject: "Statistics",
    pct: 76,
    issue: "Confusing statistical and practical significance",
  },
  {
    subject: "Geometry",
    pct: 69,
    issue: "Mixing up circumference and area formulas",
  },
];

export default function LandingPage() {
  const { user } = useAuthStore();
  const openAuthModal = useUIStore((s) => s.openAuthModal);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">🚀 Free and open source</div>
          <h1 className="hero-title">
            Math doesn't just open doors.
            <span className="hero-title-highlight"> It builds them.</span>
          </h1>
          <p className="hero-subtitle">
            MathForge teaches you why math matters, where it's used in the real
            world, and exactly how much it can boost your career earnings —
            through an entirely new learning system built around understanding,
            not memorisation.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/subjects" className="btn btn-primary btn-lg">
                Continue learning →
              </Link>
            ) : (
              <>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => openAuthModal("register")}
                >
                  Start for free →
                </button>
                <Link to="/subjects" className="btn btn-secondary btn-lg">
                  Browse subjects
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s) => (
              <div key={s.value} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where students get stuck */}
      <section className="pitfalls-section">
        <div className="container">
          <div className="section-header">
            <h2>Where most students hit a wall</h2>
            <p>
              MathForge maps every common misconception and teaches you the
              exact mental model that fixes it permanently.
            </p>
          </div>
          <div className="pitfalls-grid">
            {pitfallPreviews.map((p) => (
              <div key={p.subject} className="pitfall-card">
                <div className="pitfall-header">
                  <span className="pitfall-subject">{p.subject}</span>
                  <span className="pitfall-pct">{p.pct}% of students</span>
                </div>
                <p className="pitfall-issue">"{p.issue}"</p>
                <div className="pitfall-bar-track">
                  <div
                    className="pitfall-bar-fill"
                    style={{ width: `${p.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>A new way to learn math</h2>
            <p>Everything you need to go from confused to career-ready.</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-title">Ready to forge your math skills?</h2>
            <p className="cta-subtitle">
              Join thousands of learners building real understanding — free
              forever.
            </p>
            <div className="cta-actions">
              {user ? (
                <Link to="/subjects" className="btn btn-primary btn-lg">
                  Go to subjects →
                </Link>
              ) : (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => openAuthModal("register")}
                >
                  Create free account →
                </button>
              )}
              <Link to="/careers" className="btn btn-secondary btn-lg">
                Explore careers
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
