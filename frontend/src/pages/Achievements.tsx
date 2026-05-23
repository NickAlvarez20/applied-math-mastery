import { useProgressStore } from "@/store/progressStore";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import "@/styles/pages/achievements.css";

const allBadges = [
  {
    id: "first_topic",
    title: "First Steps",
    icon: "🎯",
    rarity: "common",
    desc: "Complete your first topic",
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    icon: "🔥",
    rarity: "rare",
    desc: "Maintain a 7-day streak",
  },
  {
    id: "xp_1000",
    title: "Knowledge Seeker",
    icon: "⭐",
    rarity: "rare",
    desc: "Earn 1000 XP",
  },
  {
    id: "xp_5000",
    title: "Math Adept",
    icon: "💎",
    rarity: "epic",
    desc: "Earn 5000 XP",
  },
  {
    id: "streak_30",
    title: "Unstoppable",
    icon: "🏆",
    rarity: "legendary",
    desc: "Maintain a 30-day streak",
  },
  {
    id: "topics_10",
    title: "Subject Master",
    icon: "📚",
    rarity: "epic",
    desc: "Complete 10 topics",
  },
];

const rarityColor: Record<string, string> = {
  common: "success",
  rare: "info",
  epic: "badge-rare",
  legendary: "badge-epic",
};

export default function Achievements() {
  const { achievements } = useProgressStore();
  const earnedIds = new Set(achievements.map((a) => a.id));

  return (
    <div className="achievements-page">
      <div className="container">
        <div className="ach-header">
          <h1 className="ach-title">Achievements</h1>
          <p className="ach-subtitle">
            {achievements.length} of {allBadges.length} unlocked
          </p>
        </div>

        <div className="ach-progress-summary">
          <div className="ach-progress-track">
            <div
              className="ach-progress-fill"
              style={{
                width: `${(achievements.length / allBadges.length) * 100}%`,
              }}
            />
          </div>
          <span className="ach-progress-pct">
            {Math.round((achievements.length / allBadges.length) * 100)}%
          </span>
        </div>

        <div className="ach-grid">
          {allBadges.map((badge) => {
            const earned = earnedIds.has(badge.id);
            const data = achievements.find((a) => a.id === badge.id);
            return (
              <div
                key={badge.id}
                className={cn(
                  "ach-card card",
                  earned ? "ach-card--earned" : "ach-card--locked",
                )}
              >
                <div className={cn("ach-icon", !earned && "ach-icon--locked")}>
                  {earned ? badge.icon : "🔒"}
                </div>
                <div className="ach-info">
                  <div className="ach-name">{badge.title}</div>
                  <div className="ach-desc">{badge.desc}</div>
                  {earned && data && (
                    <div className="ach-date">
                      Unlocked {formatDate(data.unlockedAt)}
                    </div>
                  )}
                </div>
                <span className={`badge badge-${rarityColor[badge.rarity]}`}>
                  {badge.rarity}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
