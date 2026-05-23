import { useCallback } from "react";
import { useProgressStore } from "@/store/progressStore";
import { progressAPI } from "@/api/progress.api";
import {
  awardXP,
  checkAndGrantAchievements,
} from "@/services/gamification.service";

export function useProgress() {
  const store = useProgressStore();

  const completeTopicWithSync = useCallback(
    async (topicId: string, score: number, xpEarned: number) => {
      // 1. Local update immediately (optimistic)
      store.markTopicDone(topicId, score);
      awardXP(xpEarned);

      // 2. Sync to backend in background
      try {
        await progressAPI.submitAnswer(topicId, score, store.xp);
      } catch {
        // Silent — local progress is still saved in localStorage
      }

      // 3. Re-check achievements after the topic completion
      checkAndGrantAchievements();
    },
    [store],
  );

  const claimDailyReward = useCallback(async () => {
    try {
      const res = await progressAPI.claimDaily();
      const xp = res.data.xpAwarded as number;
      if (xp > 0) {
        awardXP(xp);
        return xp;
      }
      return 0;
    } catch {
      return 0;
    }
  }, []);

  return {
    ...store,
    completeTopicWithSync,
    claimDailyReward,
  };
}
