import client from "./client";
import { apiV1 } from "./paths";
import type { ExerciseResponse, ExerciseResult } from "@/types/exercise.types";

export const exercisesAPI = {
  getNext: (topicId: string) =>
    client.get<ExerciseResponse>(apiV1(`/exercises/next/${topicId}`)),

  submit: (exerciseId: string, userAnswer: string) =>
    client.post<{ data: ExerciseResult }>(apiV1("/exercises/submit"), {
      exerciseId,
      userAnswer,
    }),

  getRecommended: (subjectId: string) =>
    client.get(apiV1(`/exercises/recommended/${subjectId}`)),
};
