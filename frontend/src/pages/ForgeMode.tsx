import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgressStore } from "@/store/progressStore";
import { useUIStore } from "@/store/uiStore";
import { subjectsAPI } from "@/api/subjects.api";
import { progressAPI } from "@/api/progress.api";
import { xpForDifficulty } from "@/utils/xp";
import XPBar from "@/components/gamification/XPBar";
import type { Topic } from "@/types/subject.types";
import "@/styles/pages/forge-mode.css";

type QuizState = "question" | "correct" | "wrong" | "complete";

// Sample exercises rendered until the backend exercise endpoint is wired
const sampleQuestions = (topic: Topic) => [
  {
    id: "q1",
    question: `Which of the following best describes a key concept in ${topic.name}?`,
    options: [
      topic.concepts[0]?.title ?? "Option A",
      "A completely unrelated concept",
      "An intentionally wrong answer",
      topic.concepts[1]?.title ?? "Option D",
    ],
    answer: "0",
    explanation:
      topic.concepts[0]?.explanation ??
      "The first concept is the correct answer.",
    xpReward: xpForDifficulty(topic.difficulty as 1),
  },
  {
    id: "q2",
    question: `What is the most common mistake students make when learning ${topic.name}?`,
    options: [
      topic.pitfalls[0]?.description ?? "Skipping practice",
      "Practising too much",
      "Reading the textbook",
      "Asking for help",
    ],
    answer: "0",
    explanation:
      topic.pitfalls[0]?.fixStrategy ?? "This is the most common pitfall.",
    xpReward: xpForDifficulty(topic.difficulty as 1),
  },
];

export default function ForgeMode() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { addXP, markTopicDone } = useProgressStore();
  const { addToast } = useUIStore();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [quizState, setQuizState] = useState<QuizState>("question");
  const [totalXP, setTotalXP] = useState(0);
  const [score, setScore] = useState(0); // correct count

  useEffect(() => {
    if (!topicId) return;
    subjectsAPI
      .getTopic(topicId)
      .then((res) => setTopic(res.data.data))
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading || !topic)
    return (
      <div className="forge-loading">
        <div className="forge-loading-spinner" />
        <p>Loading Forge Mode…</p>
      </div>
    );

  const questions = sampleQuestions(topic);
  const current = questions[qIndex];
  const isLast = qIndex === questions.length - 1;

  function handleSelect(idx: number) {
    if (quizState !== "question") return;
    setSelected(idx);
    const correct = String(idx) === current.answer;
    if (correct) {
      setQuizState("correct");
      setScore((s) => s + 1);
      addXP(current.xpReward);
      setTotalXP((t) => t + current.xpReward);
    } else {
      setQuizState("wrong");
    }
  }

  function handleNext() {
    if (isLast) {
      const finalScore = Math.round(
        ((score + (quizState === "correct" ? 0 : 0)) / questions.length) * 100,
      );
      markTopicDone(topicId!, finalScore);
      progressAPI.submitAnswer(topicId!, finalScore, totalXP).catch(() => {});
      addToast(`Topic complete! +${totalXP} XP earned`, "success");
      setQuizState("complete");
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
      setQuizState("question");
    }
  }

  if (quizState === "complete") {
    return (
      <div className="forge-complete">
        <div className="forge-complete-card">
          <div className="forge-complete-icon">🏆</div>
          <h1>Topic complete!</h1>
          <p className="forge-complete-subtitle">
            You earned <strong>{totalXP} XP</strong> on {topic.name}
          </p>
          <div className="forge-complete-stats">
            <div className="forge-stat">
              <span className="forge-stat-value">
                {score}/{questions.length}
              </span>
              <span className="forge-stat-label">Correct</span>
            </div>
            <div className="forge-stat">
              <span className="forge-stat-value">+{totalXP}</span>
              <span className="forge-stat-label">XP earned</span>
            </div>
          </div>
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

  return (
    <div className="forge-mode">
      {/* Header */}
      <div className="forge-header">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(`/topics/${topicId}`)}
        >
          ✕ Exit
        </button>
        <div className="forge-progress-dots">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`forge-dot ${i < qIndex ? "forge-dot--done" : i === qIndex ? "forge-dot--active" : ""}`}
            />
          ))}
        </div>
        <div className="forge-xp-counter">+{totalXP} XP</div>
      </div>

      {/* XP bar */}
      <div className="forge-xpbar">
        <XPBar />
      </div>

      {/* Question card */}
      <div className="forge-body">
        <div className="forge-card">
          <div className="forge-q-meta">
            Question {qIndex + 1} of {questions.length}
          </div>
          <h2 className="forge-question">{current.question}</h2>

          <div className="forge-options">
            {current.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = String(i) === current.answer;
              let cls = "forge-option";
              if (quizState !== "question") {
                if (isCorrect) cls += " forge-option--correct";
                else if (isSelected) cls += " forge-option--wrong";
                else cls += " forge-option--dim";
              }
              if (isSelected && quizState === "question")
                cls += " forge-option--selected";
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => handleSelect(i)}
                  disabled={quizState !== "question"}
                >
                  <span className="forge-option-letter">
                    {["A", "B", "C", "D"][i]}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {quizState !== "question" && (
            <div className={`forge-feedback forge-feedback--${quizState}`}>
              <div className="forge-feedback-icon">
                {quizState === "correct" ? "✅" : "❌"}
              </div>
              <div>
                <div className="forge-feedback-title">
                  {quizState === "correct"
                    ? `Correct! +${current.xpReward} XP`
                    : "Not quite"}
                </div>
                <p className="forge-feedback-explanation">
                  {current.explanation}
                </p>
              </div>
            </div>
          )}

          {quizState !== "question" && (
            <button
              className="btn btn-primary forge-next-btn"
              onClick={handleNext}
            >
              {isLast ? "Finish topic →" : "Next question →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
