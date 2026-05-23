import client from "./client";
import type { ExerciseResponse, ExerciseResult } from "@/types/exercise.types";

export const exercisesAPI = {
  getNext: (topicId: string) =>
    client.get<ExerciseResponse>(`/api/v1/exercises/next/${topicId}`),

  submit: (exerciseId: string, userAnswer: string) =>
    client.post<{ data: ExerciseResult }>("/api/v1/exercises/submit", {
      exerciseId,
      userAnswer,
    }),

  getRecommended: (subjectId: string) =>
    client.get(`/api/v1/exercises/recommended/${subjectId}`),
};
