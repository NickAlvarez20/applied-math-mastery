export interface TopicProgress {
  topicId: string;
  completed: boolean;
  bestScore: number; // 0–100
  attempts: number;
  completedAt: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: string;
}

export interface DailyChallenge {
  id: string;
  topicId: string;
  date: string;
  xpReward: number;
  claimed: boolean;
}
