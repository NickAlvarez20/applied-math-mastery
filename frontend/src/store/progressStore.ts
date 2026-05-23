import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TopicProgress, Achievement } from "@/types/progress.types";

interface ProgressState {
  xp: number;
  level: number;
  streak: number;
  topicMap: Record<string, TopicProgress>;
  achievements: Achievement[];

  addXP: (amount: number) => void;
  markTopicDone: (topicId: string, score: number) => void;
  setStreak: (n: number) => void;
  addAchievement: (a: Achievement) => void;
  reset: () => void;
}

const XP_PER_LEVEL = 500;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      topicMap: {},
      achievements: [],

      addXP(amount) {
        set((s) => {
          const newXP = s.xp + amount;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          return { xp: newXP, level: newLevel };
        });
      },

      markTopicDone(topicId, score) {
        set((s) => ({
          topicMap: {
            ...s.topicMap,
            [topicId]: {
              topicId,
              completed: true,
              bestScore: Math.max(score, s.topicMap[topicId]?.bestScore ?? 0),
              attempts: (s.topicMap[topicId]?.attempts ?? 0) + 1,
              completedAt: new Date().toISOString(),
            },
          },
        }));
      },

      setStreak: (n) => set({ streak: n }),
      addAchievement: (a) =>
        set((s) => ({
          achievements: [...s.achievements.filter((x) => x.id !== a.id), a],
        })),
      reset: () =>
        set({
          xp: 0,
          level: 1,
          streak: 0,
          topicMap: {},
          achievements: [],
        }),
    }),
    {
      name: "mathforge-progress",
      partialize: (s) => ({
        xp: s.xp,
        level: s.level,
        streak: s.streak,
        topicMap: s.topicMap,
        achievements: s.achievements,
      }),
    },
  ),
);
