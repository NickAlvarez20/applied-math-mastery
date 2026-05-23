export type ExerciseType =
  | "multiple_choice"
  | "drag_drop"
  | "graph_challenge"
  | "proof_builder";
export type MasteryBand = "novice" | "developing" | "proficient" | "mastered";

export interface Exercise {
  id: string;
  topicId: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  xpReward: number;
  hint?: string;
}

export interface ExerciseResult {
  correct: boolean;
  xpEarned: number;
  explanation: string;
  correctAnswer: string;
}

export interface ExerciseResponse {
  data: Exercise;
  mastery: MasteryBand;
}
