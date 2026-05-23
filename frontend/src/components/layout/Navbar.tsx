import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { useProgressStore } from "@/store/progressStore";
import { cn } from "@/utils/cn";
import { formatXP } from "@/utils/formatters";
import "@/styles/components/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const { xp, level, streak } = useProgressStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/subjects", label: "Subjects" },
    { to: "/careers", label: "Careers" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  function handleLogout() {
    clearAuth();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">⚡</span>
          MathForge
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "navbar-link",
                location.pathname.startsWith(l.to) && "navbar-link--active",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar-right">
          {/* Streak pill */}
          {streak > 0 && <div className="navbar-streak">🔥 {streak}</div>}

          {/* XP pill */}
          {user && (
            <div className="navbar-xp">
              <span className="navbar-xp-level">Lv {level}</span>
              <span className="navbar-xp-amount">{formatXP(xp)} XP</span>
            </div>
          )}

          {/* Theme toggle */}
          <button
            className="navbar-theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Auth */}
          {user ? (
            <div className="navbar-user">
              <button
                className="navbar-avatar"
                onClick={() => setMenuOpen((o) => !o)}
              >
                {user.username[0].toUpperCase()}
              </button>
              {menuOpen && (
                <div className="navbar-dropdown">
                  <Link
                    to="/dashboard"
                    className="navbar-dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/achievements"
                    className="navbar-dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Achievements
                  </Link>
                  <button
                    className="navbar-dropdown-item navbar-dropdown-item--danger"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth-btns">
              <Link to="/" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
