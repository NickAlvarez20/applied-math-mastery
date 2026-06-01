import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import "@/styles/components/footer.css";

const exploreLinks = [
  { to: "/subjects", label: "Subjects" },
  { to: "/careers", label: "Career Explorer" },
  { to: "/leaderboard", label: "Leaderboard" },
];

const accountLinks = [
  { to: "/dashboard", label: "Dashboard", auth: true },
  { to: "/achievements", label: "Achievements", auth: true },
];

export default function Footer() {
  const { user } = useAuthStore();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon" aria-hidden>
                ⚡
              </span>
              Applied Math Mastery
            </Link>
            <p className="footer-tagline">
              Gamified math learning that connects mastery to real careers,
              salary impact, and measurable progress.
            </p>
            <p className="footer-badge">Free and open source</p>
          </div>

          <div className="footer-column">
            <h2 className="footer-heading">Explore</h2>
            <ul className="footer-links">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h2 className="footer-heading">Account</h2>
            <ul className="footer-links">
              {user ? (
                accountLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link to="/subjects">Browse subjects</Link>
                  </li>
                  <li>
                    <Link to="/">Sign up free</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="footer-column">
            <h2 className="footer-heading">Project</h2>
            <ul className="footer-links">
              <li>
                <a
                  href="https://appliedmathmastery.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live demo
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/NickAlvarez20/applied-math-mastery"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {year} Applied Math Mastery. Open and free for educational
            use.
          </p>
          <p className="footer-note">
            Built with React, TypeScript, and Go.
          </p>
        </div>
      </div>
    </footer>
  );
}
