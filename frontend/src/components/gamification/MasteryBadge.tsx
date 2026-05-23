import type { MasteryBand } from "@/types/exercise.types";
import "@/styles/components/mastery-badge.css";

const config: Record<
  MasteryBand,
  { label: string; icon: string; cls: string }
> = {
  novice: { label: "Novice", icon: "🌱", cls: "mastery--novice" },
  developing: { label: "Developing", icon: "📈", cls: "mastery--developing" },
  proficient: { label: "Proficient", icon: "⭐", cls: "mastery--proficient" },
  mastered: { label: "Mastered", icon: "💎", cls: "mastery--mastered" },
};

interface Props {
  band: MasteryBand;
  size?: "sm" | "md";
}

export default function MasteryBadge({ band, size = "md" }: Props) {
  const { label, icon, cls } = config[band];
  return (
    <span className={`mastery-badge ${cls} mastery-badge--${size}`}>
      {icon} {label}
    </span>
  );
}
