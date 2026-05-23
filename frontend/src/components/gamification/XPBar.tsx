import { useProgressStore } from "@/store/progressStore";
import { xpProgressPercent, xpToNextLevel } from "@/utils/xp";
import "@/styles/components/xpbar.css";

export default function XPBar() {
  const { xp, level } = useProgressStore();
  const pct = xpProgressPercent(xp);
  const toNext = xpToNextLevel(xp);

  return (
    <div className="xpbar">
      <div className="xpbar-header">
        <span className="xpbar-level">Level {level}</span>
        <span className="xpbar-remaining">{toNext} XP to next level</span>
      </div>
      <div className="xpbar-track">
        <div
          className="xpbar-fill"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
