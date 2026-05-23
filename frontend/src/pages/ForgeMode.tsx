import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExercise } from "@/hooks/useExercise";
import { useProgress } from "@/hooks/useProgress";
import { subjectsAPI } from "@/api/subjects.api";
import XPBar from "@/components/gamification/XPBar";
import MasteryBadge from "@/components/gamification/MasteryBadge";
import MultipleChoiceExercise from "@/components/learning/MultipleChoiceExercise";
import ConceptVisual from "@/components/learning/ConceptVisual";
import type { Topic } from "@/types/subject.types";
import "@/styles/pages/forge-mode.css";

type ForgePhase = "concept" | "exercise" | "complete";

export default function ForgeMode() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [topicLoading, setTopicLoading] = useState(true);
  const [phase, setPhase] = useState<ForgePhase>("concept");
  const [conceptIdx, setConceptIdx] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [attempted, setAttempted] = useState(0);

  const {
    exercise,
    result,
    mastery,
    loading,
    submitting,
    error,
    fetchNext,
    submit,
    reset,
  } = useExercise();
  const { completeTopicWithSync } = useProgress();

  // Load topic metadata
  useEffect(() => {
    if (!topicId) return;
    subjectsAPI
      .getTopic(topicId)
      .then((res) => setTopic(res.data.data))
      .finally(() => setTopicLoading(false));
  }, [topicId]);

  // When entering exercise phase, fetch the first adaptive exercise
  useEffect(() => {
    if (phase === "exercise" && !exercise && topicId) {
      fetchNext(topicId);
    }
  }, [phase, topicId]);

  function handleConceptNext() {
    if (!topic) return;
    if (conceptIdx < topic.concepts.length - 1) {
      setConceptIdx((i) => i + 1);
    } else {
      setPhase("exercise");
    }
  }

  async function handleSubmitAnswer(answer: string) {
    await submit(answer);
  }

  function handleExerciseNext() {
    if (!result) return;
    const newCorrect = correct + (result.correct ? 1 : 0);
    const newAttempted = attempted + 1;
    const newXP = totalXP + result.xpEarned;
    setCorrect(newCorrect);
    setAttempted(newAttempted);
    setTotalXP(newXP);

    // After 3 exercises, finish the topic
    if (newAttempted >= 3) {
      const score = Math.round((newCorrect / newAttempted) * 100);
      completeTopicWithSync(topicId!, score, newXP);
      setPhase("complete");
    } else {
      reset();
      fetchNext(topicId!);
    }
  }

  if (topicLoading || !topic) {
    return (
      <div className="forge-loading">
        <div className="forge-loading-spinner" />
        <p>Loading Forge Mode…</p>
      </div>
    );
  }

  // ── Complete screen ───────────────────────────────────────────────────────
  if (phase === "complete") {
    const score = Math.round((correct / attempted) * 100);
    return (
      <div className="forge-complete">
        <div className="forge-complete-card">
          <div className="forge-complete-icon">
            {score >= 80 ? "🏆" : score >= 60 ? "⭐" : "📚"}
          </div>
          <h1>Topic complete!</h1>
          <p className="forge-complete-subtitle">
            You earned <strong>{totalXP} XP</strong> on {topic.name}
          </p>
          <div className="forge-complete-stats">
            <div className="forge-stat">
              <span className="forge-stat-value">
                {correct}/{attempted}
              </span>
              <span className="forge-stat-label">Correct</span>
            </div>
            <div className="forge-stat">
              <span className="forge-stat-value">{score}%</span>
              <span className="forge-stat-label">Score</span>
            </div>
            <div className="forge-stat">
              <span className="forge-stat-value">+{totalXP}</span>
              <span className="forge-stat-label">XP earned</span>
            </div>
          </div>
          <MasteryBadge
            band={
              score >= 90
                ? "mastered"
                : score >= 70
                  ? "proficient"
                  : score >= 40
                    ? "developing"
                    : "novice"
            }
          />
          <div className="forge-complete-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/topics/${topicId}`)}
            >
              Review topic
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/subjects")}
            >
              More subjects
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Header (shared) ───────────────────────────────────────────────────────
  const conceptCount = topic.concepts.length;
  const totalSteps = conceptCount + 3; // concepts + 3 exercises
  const currentStep =
    phase === "concept" ? conceptIdx : conceptCount + attempted;

  return (
    <div className="forge-mode">
      <div className="forge-header">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(`/topics/${topicId}`)}
        >
          ✕ Exit
        </button>
        <div className="forge-progress-dots">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`forge-dot ${
                i < currentStep
                  ? "forge-dot--done"
                  : i === currentStep
                    ? "forge-dot--active"
                    : ""
              }`}
            />
          ))}
        </div>
        <MasteryBadge band={mastery} size="sm" />
      </div>

      <div className="forge-xpbar">
        <XPBar />
      </div>

      <div className="forge-body">
        <div className="forge-card">
          {/* ── Concept phase ─────────────────────────────────────────── */}
          {phase === "concept" && (
            <>
              <div className="forge-phase-label">
                🧠 Concept {conceptIdx + 1} of {conceptCount}
              </div>
              <h2 className="forge-question">
                {topic.concepts[conceptIdx].title}
              </h2>
              <p className="forge-concept-explanation">
                {topic.concepts[conceptIdx].explanation}
              </p>

              {/* Plotly visualisation */}
              {topic.concepts[conceptIdx].visualType !== "quiz" && (
                <ConceptVisual
                  visualType={topic.concepts[conceptIdx].visualType}
                  topicId={topicId!}
                  conceptIndex={conceptIdx}
                />
              )}

              <button
                className="btn btn-primary forge-next-btn"
                onClick={handleConceptNext}
              >
                {conceptIdx < conceptCount - 1
                  ? "Next concept →"
                  : "Start exercises →"}
              </button>
            </>
          )}

          {/* ── Exercise phase ────────────────────────────────────────── */}
          {phase === "exercise" && (
            <>
              <div className="forge-phase-label">
                ⚡ Exercise {attempted + 1} of 3
                {totalXP > 0 && (
                  <span className="forge-xp-pill">+{totalXP} XP so far</span>
                )}
              </div>

              {loading && (
                <div className="forge-exercise-loading">
                  <div
                    className="forge-loading-spinner"
                    style={{ width: 28, height: 28 }}
                  />
                  <span>Loading adaptive exercise…</span>
                </div>
              )}

              {error && <div className="forge-error">{error}</div>}

              {exercise && !loading && (
                <>
                  <MultipleChoiceExercise
                    exercise={exercise}
                    result={result}
                    submitting={submitting}
                    onSubmit={handleSubmitAnswer}
                  />
                  {result && (
                    <button
                      className="btn btn-primary forge-next-btn"
                      onClick={handleExerciseNext}
                    >
                      {attempted + 1 >= 3
                        ? "Finish topic →"
                        : "Next exercise →"}
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
