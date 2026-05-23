import { useProgressStore } from "@/store/progressStore";
import { useUIStore } from "@/store/uiStore";
import type { Achievement } from "@/types/progress.types";

// All achievement definitions mirrored from the backend seed
const ACHIEVEMENT_DEFS = [
  {
    id: "first_topic",
    title: "First Steps",
    description: "Complete your first topic",
    icon: "🎯",
    rarity: "common" as const,
    check: (xp: number, streak: number, topicsDone: number) => topicsDone >= 1,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    rarity: "rare" as const,
    check: (xp: number, streak: number) => streak >= 7,
  },
  {
    id: "xp_1000",
    title: "Knowledge Seeker",
    description: "Earn 1000 XP",
    icon: "⭐",
    rarity: "rare" as const,
    check: (xp: number) => xp >= 1000,
  },
  {
    id: "xp_5000",
    title: "Math Adept",
    description: "Earn 5000 XP",
    icon: "💎",
    rarity: "epic" as const,
    check: (xp: number) => xp >= 5000,
  },
  {
    id: "streak_30",
    title: "Unstoppable",
    description: "Maintain a 30-day streak",
    icon: "🏆",
    rarity: "legendary" as const,
    check: (xp: number, streak: number) => streak >= 30,
  },
  {
    id: "topics_10",
    title: "Subject Master",
    description: "Complete 10 topics",
    icon: "📚",
    rarity: "epic" as const,
    check: (xp: number, streak: number, topicsDone: number) => topicsDone >= 10,
  },
];

// Call this after every XP gain or topic completion.
export function checkAndGrantAchievements() {
  const { xp, streak, topicMap, achievements, addAchievement } =
    useProgressStore.getState();
  const { addToast } = useUIStore.getState();

  const earnedIds = new Set(achievements.map((a) => a.id));
  const topicsDone = Object.values(topicMap).filter((t) => t.completed).length;

  for (const def of ACHIEVEMENT_DEFS) {
    if (earnedIds.has(def.id)) continue; // already earned
    if (!def.check(xp, streak, topicsDone)) continue; // not yet met

    const newAchievement: Achievement = {
      id: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      rarity: def.rarity,
      unlockedAt: new Date().toISOString(),
    };
    addAchievement(newAchievement);
    addToast(`🏅 Achievement unlocked: ${def.title}`, "success");
  }
}

// Convenience wrapper — add XP then immediately check achievements.
export function awardXP(amount: number) {
  useProgressStore.getState().addXP(amount);
  // Defer the check one tick so the store update settles first
  setTimeout(checkAndGrantAchievements, 0);
}
