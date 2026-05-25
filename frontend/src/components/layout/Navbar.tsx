import { useState, useEffect } from "react";
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
  const { theme, toggleTheme, openAuthModal } = useUIStore();
  const { xp, level, streak } = useProgressStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const links = [
    { to: "/subjects", label: "Subjects" },
    { to: "/careers", label: "Careers" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleLogout() {
    clearAuth();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/");
  }

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-icon" aria-hidden>
              ⚡
            </span>
            Applied Math Mastery
          </Link>

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

          <div className="navbar-right">
            {streak > 0 && (
              <div className="navbar-streak navbar-streak--desktop">
                🔥 {streak}
              </div>
            )}

            {user && (
              <div className="navbar-xp navbar-xp--desktop">
                <span className="navbar-xp-level">Lv {level}</span>
                <span className="navbar-xp-amount">{formatXP(xp)} XP</span>
              </div>
            )}

            <button
              type="button"
              className="navbar-theme-btn"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              title={theme === "light" ? "Dark mode" : "Light mode"}
            >
              <span className="navbar-theme-icon" aria-hidden>
                {theme === "light" ? "🌙" : "☀️"}
              </span>
              <span className="navbar-theme-label">
                {theme === "light" ? "Dark" : "Light"}
              </span>
            </button>

            {user ? (
              <div className="navbar-user navbar-user--desktop">
                <button
                  type="button"
                  className="navbar-avatar"
                  onClick={() => setUserMenuOpen((o) => !o)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {user.username[0].toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="navbar-dropdown">
                    <Link
                      to="/dashboard"
                      className="navbar-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/achievements"
                      className="navbar-dropdown-item"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Achievements
                    </Link>
                    <button
                      type="button"
                      className="navbar-dropdown-item navbar-dropdown-item--danger"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar-auth-btns navbar-auth-btns--desktop">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => openAuthModal("login")}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => openAuthModal("register")}
                >
                  Sign up
                </button>
              </div>
            )}

            <button
              type="button"
              className="navbar-menu-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="navbar-mobile-panel"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={cn("navbar-menu-icon", menuOpen && "navbar-menu-icon--open")} />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <button
          type="button"
          className="navbar-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        id="navbar-mobile-panel"
        className={cn("navbar-mobile", menuOpen && "navbar-mobile--open")}
        aria-hidden={!menuOpen}
      >
        <div className="navbar-mobile-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "navbar-mobile-link",
                location.pathname.startsWith(l.to) && "navbar-mobile-link--active",
              )}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {user ? (
          <div className="navbar-mobile-section">
            {streak > 0 && <div className="navbar-streak">🔥 {streak} day streak</div>}
            <div className="navbar-xp">
              <span className="navbar-xp-level">Lv {level}</span>
              <span className="navbar-xp-amount">{formatXP(xp)} XP</span>
            </div>
            <Link
              to="/dashboard"
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/achievements"
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              Achievements
            </Link>
            <button
              type="button"
              className="navbar-mobile-link navbar-mobile-link--danger"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="navbar-mobile-auth">
            <button
              type="button"
              className="btn btn-secondary w-full"
              onClick={() => {
                openAuthModal("login");
                setMenuOpen(false);
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={() => {
                openAuthModal("register");
                setMenuOpen(false);
              }}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </>
  );
}
