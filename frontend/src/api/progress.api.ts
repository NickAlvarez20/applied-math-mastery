import client from "./client";
import { apiV1 } from "./paths";
import type { TopicProgress, Achievement } from "@/types/progress.types";
import type { APIResponse } from "@/types/api.types";

export const progressAPI = {
  getMyProgress: () =>
    client.get<APIResponse<Record<string, TopicProgress>>>(apiV1("/progress/me")),

  submitAnswer: (topicId: string, score: number, xp: number) =>
    client.post(apiV1("/progress/submit"), { topicId, score, xp }),

  getStreak: () =>
    client.get<APIResponse<{ streak: number; lastActive: string }>>(
      apiV1("/progress/streak"),
    ),

  claimDaily: () => client.post(apiV1("/progress/daily-claim")),

  getAchievements: () =>
    client.get<APIResponse<Achievement[]>>(apiV1("/achievements")),
};
