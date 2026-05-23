import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { authAPI } from "@/api/auth.api";
import "@/styles/components/modal.css";

interface Props {
  onClose: () => void;
  initialMode?: "login" | "register";
}

export default function AuthModal({ onClose, initialMode = "login" }: Props) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setAuth } = useAuthStore();
  const { addToast } = useUIStore();

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await authAPI.register({ username, email, password });
        setAuth(res.data.data, {
          accessToken: res.data.token,
          refreshToken: "",
        });
        addToast(`Welcome to MathForge, ${username}!`, "success");
      } else {
        const res = await authAPI.login({ email, password });
        setAuth(res.data.data, {
          accessToken: res.data.token,
          refreshToken: "",
        });
        addToast("Welcome back!", "success");
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && <div className="auth-error">{error}</div>}

          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                className="form-input"
                type="text"
                placeholder="mathwizard99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </button>

          <p className="auth-switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              className="auth-switch-btn"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
