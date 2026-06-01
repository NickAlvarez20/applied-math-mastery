import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/pages/landing.css";
import "./styles/pages/subject-hub.css";
import "./styles/pages/topic-detail.css";
import "./styles/pages/forge-mode.css";
import "./styles/pages/career-explorer.css";
import "./styles/pages/dashboard.css";
import "./styles/pages/leaderboard.css";
import "./styles/pages/achievements.css";
import "./styles/pages/not-found.css";
import "./styles/components/math-graph.css";
import "./styles/components/exercise.css";
import "./styles/components/mastery-badge.css";
import "./styles/components/daily-challenge.css";

// Apply saved theme before first render to avoid flash
const saved = JSON.parse(localStorage.getItem("mathforge-ui") || "{}");
const storedVersion = saved?.version ?? 0;
const storedTheme = saved?.state?.theme;
const savedTheme =
  storedVersion >= 1 && storedTheme === "light" ? "light" : "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

// Global styles
import "./styles/index.css";
import "./styles/components/button.css";
import "./styles/components/card.css";
import "./styles/components/badge.css";
import "./styles/components/navbar.css";
import "./styles/components/footer.css";
import "./styles/components/modal.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
