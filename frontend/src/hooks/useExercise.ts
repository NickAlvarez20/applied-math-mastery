import { useState, useCallback } from "react";
import { exercisesAPI } from "@/api/exercises.api";
import { progressAPI } from "@/api/progress.api";
import { awardXP } from "@/services/gamification.service";
import { useProgressStore } from "@/store/progressStore";
import type {
  Exercise,
  ExerciseResult,
  MasteryBand,
} from "@/types/exercise.types";

interface UseExerciseReturn {
  exercise: Exercise | null;
  result: ExerciseResult | null;
  mastery: MasteryBand;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  fetchNext: (topicId: string) => Promise<void>;
  submit: (answer: string) => Promise<void>;
  reset: () => void;
}

export function useExercise(): UseExerciseReturn {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [mastery, setMastery] = useState<MasteryBand>("novice");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { markTopicDone } = useProgressStore();

  const fetchNext = useCallback(async (topicId: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await exercisesAPI.getNext(topicId);
      setExercise(res.data.data);
      setMastery(res.data.mastery);
    } catch {
      setError("Could not load exercise — is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  const submit = useCallback(
    async (answer: string) => {
      if (!exercise) return;
      setSubmitting(true);
      try {
        const res = await exercisesAPI.submit(exercise.id, answer);
        const r = res.data.data;
        setResult(r);
        if (r.correct) {
          awardXP(r.xpEarned);
          // Sync with backend progress
          progressAPI
            .submitAnswer(exercise.topicId, 100, r.xpEarned)
            .catch(() => {});
        }
      } catch {
        // Fall back to client-side scoring if backend is unreachable
        const correct = answer === exercise.answer;
        const xp = correct ? exercise.xpReward : 0;
        setResult({
          correct,
          xpEarned: xp,
          explanation: exercise.explanation,
          correctAnswer: exercise.answer,
        });
        if (correct) awardXP(xp);
      } finally {
        setSubmitting(false);
      }
    },
    [exercise],
  );

  const reset = useCallback(() => {
    setExercise(null);
    setResult(null);
    setError(null);
  }, []);

  return {
    exercise,
    result,
    mastery,
    loading,
    submitting,
    error,
    fetchNext,
    submit,
    reset,
  };
}
