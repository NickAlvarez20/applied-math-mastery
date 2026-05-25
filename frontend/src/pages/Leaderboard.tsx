import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import client from "@/api/client";
import { apiV1 } from "@/api/paths";
import { formatXP } from "@/utils/formatters";
import type { APIResponse } from "@/types/api.types";
import "@/styles/pages/leaderboard.css";

interface LeaderboardEntry {
  rank?: number;
  userId: string;
  username?: string;
  xp?: number;
  level?: number;
  streak?: number;
}

function avatarInitial(username?: string): string {
  const letter = (username?.trim() || "?")[0];
  return letter.toUpperCase();
}

export default function Leaderboard() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [tab, setTab] = useState<"global" | "weekly">("global");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    client
      .get<APIResponse<LeaderboardEntry[]>>(
        apiV1(`/leaderboard/${tab === "global" ? "global" : "weekly"}`),
      )
      .then((res) => setEntries(res.data.data ?? []))
      .catch(() =>
        setError("Could not load rankings — is the backend running?"),
      )
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="lb-header">
          <h1 className="lb-title">Leaderboard</h1>
          <p className="lb-subtitle">Top learners ranked by XP earned.</p>
        </div>

        <div className="lb-tabs tab-bar">
          {(["global", "weekly"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`tab-btn ${tab === t ? "tab-btn--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "global" ? "🌍 All-time" : "📅 This week"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="lb-loading">Loading rankings…</div>
        ) : error ? (
          <div className="lb-empty">
            <p>{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="lb-empty">
            <p>No rankings yet — complete topics to appear here!</p>
          </div>
        ) : (
          <div className="lb-list">
            {entries.map((e, i) => (
              <div
                key={e.userId || i}
                className={`lb-row card ${e.userId === user?.id ? "lb-row--me" : ""} ${i < 3 ? `lb-row--top${i + 1}` : ""}`}
              >
                <div className="lb-rank">
                  {i === 0
                    ? "🥇"
                    : i === 1
                      ? "🥈"
                      : i === 2
                        ? "🥉"
                        : `#${e.rank ?? i + 1}`}
                </div>
                <div className="lb-avatar">{avatarInitial(e.username)}</div>
                <div className="lb-user-info">
                  <span className="lb-username">
                    {e.username?.trim() || "Anonymous"}
                  </span>
                  {e.userId === user?.id && (
                    <span className="lb-you-badge">You</span>
                  )}
                </div>
                <div className="lb-level">Lv {e.level ?? 1}</div>
                <div className="lb-streak">🔥 {e.streak ?? 0}</div>
                <div className="lb-xp">{formatXP(e.xp ?? 0)} XP</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
