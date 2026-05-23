import client from "./client";
import type { TopicProgress, Achievement } from "@/types/progress.types";
import type { APIResponse } from "@/types/api.types";

export const progressAPI = {
  getMyProgress: () =>
    client.get<APIResponse<Record<string, TopicProgress>>>(
      "/api/v1/progress/me",
    ),

  submitAnswer: (topicId: string, score: number, xp: number) =>
    client.post("/api/v1/progress/submit", { topicId, score, xp }),

  getStreak: () =>
    client.get<APIResponse<{ streak: number; lastActive: string }>>(
      "/api/v1/progress/streak",
    ),

  claimDaily: () => client.post("/api/v1/progress/daily-claim"),

  getAchievements: () =>
    client.get<APIResponse<Achievement[]>>("/api/v1/achievements"),
};
