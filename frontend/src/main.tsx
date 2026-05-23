import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Apply saved dark mode before first render to avoid flash
const saved = JSON.parse(localStorage.getItem("mathforge-ui") || "{}");
if (saved?.state?.theme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
}

// Global styles
import "./styles/index.css";
import "./styles/components/button.css";
import "./styles/components/card.css";
import "./styles/components/badge.css";
import "./styles/components/navbar.css";
import "./styles/components/modal.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
