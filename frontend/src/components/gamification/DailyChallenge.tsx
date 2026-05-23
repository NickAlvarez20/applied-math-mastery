import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useUIStore } from "@/store/uiStore";
import "@/styles/components/daily-challenge.css";

export default function DailyChallenge() {
  const { claimDailyReward } = useProgress();
  const { addToast } = useUIStore();
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClaim() {
    setLoading(true);
    const xp = await claimDailyReward();
    setLoading(false);
    if (xp > 0) {
      setClaimed(true);
      addToast(`☀️ Daily reward claimed! +${xp} XP`, "success");
    } else {
      addToast("Already claimed today — come back tomorrow!", "info");
    }
  }

  return (
    <div
      className={`daily-challenge ${claimed ? "daily-challenge--claimed" : ""}`}
    >
      <div className="daily-challenge-icon">{claimed ? "✅" : "☀️"}</div>
      <div className="daily-challenge-body">
        <div className="daily-challenge-title">
          {claimed ? "Daily reward claimed!" : "Daily reward available"}
        </div>
        <div className="daily-challenge-desc">
          {claimed
            ? "Great — see you tomorrow for more XP."
            : "Log in every day to earn bonus XP and keep your streak."}
        </div>
      </div>
      {!claimed && (
        <button
          className="btn btn-primary btn-sm"
          onClick={handleClaim}
          disabled={loading}
        >
          {loading ? "…" : "Claim +25 XP"}
        </button>
      )}
    </div>
  );
}
