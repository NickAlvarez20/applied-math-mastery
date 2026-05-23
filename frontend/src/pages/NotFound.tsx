import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-5)",
        textAlign: "center",
        padding: "var(--space-6)",
      }}
    >
      <div style={{ fontSize: "4rem" }}>🔢</div>
      <h1 style={{ fontSize: "var(--text-4xl)", color: "var(--color-text)" }}>
        404
      </h1>
      <p
        style={{ color: "var(--color-text-muted)", fontSize: "var(--text-lg)" }}
      >
        This page doesn't add up.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
