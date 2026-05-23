import { useState } from "react";
import { cn } from "@/utils/cn";
import type { Exercise, ExerciseResult } from "@/types/exercise.types";
import "@/styles/components/exercise.css";

interface Props {
  exercise: Exercise;
  result: ExerciseResult | null;
  submitting: boolean;
  onSubmit: (answer: string) => void;
}

export default function MultipleChoiceExercise({
  exercise,
  result,
  submitting,
  onSubmit,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleSelect(idx: number) {
    if (result) return;
    setSelected(idx);
  }

  function handleSubmit() {
    if (selected === null || result || submitting) return;
    onSubmit(String(selected));
  }

  const answered = result !== null;

  return (
    <div className="exercise-mc">
      <div className="exercise-question">{exercise.question}</div>

      {exercise.hint && !answered && (
        <details className="exercise-hint">
          <summary>Show hint</summary>
          <p>{exercise.hint}</p>
        </details>
      )}

      <div className="exercise-options">
        {(exercise.options ?? []).map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect =
            result !== null && String(i) === result.correctAnswer;
          const isWrong = result !== null && isSelected && !result.correct;

          return (
            <button
              key={i}
              className={cn(
                "exercise-option",
                isSelected && !answered && "exercise-option--selected",
                isCorrect && answered && "exercise-option--correct",
                isWrong && answered && "exercise-option--wrong",
                answered && !isCorrect && !isWrong && "exercise-option--dim",
              )}
              onClick={() => handleSelect(i)}
              disabled={answered || submitting}
            >
              <span className="exercise-option-letter">
                {["A", "B", "C", "D"][i]}
              </span>
              <span className="exercise-option-text">{opt}</span>
              {isCorrect && answered && (
                <span className="exercise-option-tick">✓</span>
              )}
              {isWrong && answered && (
                <span className="exercise-option-cross">✗</span>
              )}
            </button>
          );
        })}
      </div>

      {!answered && (
        <button
          className="btn btn-primary exercise-submit-btn"
          onClick={handleSubmit}
          disabled={selected === null || submitting}
        >
          {submitting ? "Checking…" : "Submit answer"}
        </button>
      )}

      {answered && (
        <div
          className={cn(
            "exercise-feedback",
            result.correct
              ? "exercise-feedback--correct"
              : "exercise-feedback--wrong",
          )}
        >
          <div className="exercise-feedback-icon">
            {result.correct ? "✅" : "❌"}
          </div>
          <div className="exercise-feedback-body">
            <div className="exercise-feedback-title">
              {result.correct
                ? `Correct! +${result.xpEarned} XP`
                : "Not quite — here's why:"}
            </div>
            <p className="exercise-feedback-explanation">
              {result.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
