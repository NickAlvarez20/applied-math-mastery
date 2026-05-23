import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

import { formatXP } from "@/utils/formatters";

import "@/styles/pages/leaderboard.css";

export default function Leaderboard() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<any[]>([]);
  const [tab, setTab] = useState<"global" | "weekly">("global");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Leaderboard is public — no auth required
    fetch(
      `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/v1/leaderboard/${tab}`,
    )
      .then((r) => r.json())
      .then((d) => setEntries(d.data ?? []))
      .finally(() => setLoading(false));
  }, [tab]);

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="lb-header">
          <h1 className="lb-title">Leaderboard</h1>
          <p className="lb-subtitle">Top learners ranked by XP earned.</p>
        </div>

        <div className="lb-tabs">
          {(["global", "weekly"] as const).map((t) => (
            <button
              key={t}
              className={`topic-tab ${tab === t ? "topic-tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "global" ? "🌍 All-time" : "📅 This week"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="lb-loading">Loading rankings…</div>
        ) : entries.length === 0 ? (
          <div className="lb-empty">
            <p>No rankings yet — complete topics to appear here!</p>
          </div>
        ) : (
          <div className="lb-list">
            {entries.map((e, i) => (
              <div
                key={e.userId}
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
                <div className="lb-avatar">
                  {(e.username ?? "?")[0].toUpperCase()}
                </div>
                <div className="lb-user-info">
                  <span className="lb-username">
                    {e.username ?? "Anonymous"}
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
