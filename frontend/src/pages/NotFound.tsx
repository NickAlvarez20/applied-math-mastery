import { Link } from "react-router-dom";
import "@/styles/pages/not-found.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-card">
        <div className="not-found-icon" aria-hidden>
          🔢
        </div>
        <h1 className="not-found-code">404</h1>
        <p className="not-found-message">This page doesn't add up.</p>
        <Link to="/" className="btn btn-primary btn-lg">
          Back to home
        </Link>
      </div>
    </div>
  );
}
