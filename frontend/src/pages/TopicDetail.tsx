import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { subjectsAPI } from "@/api/subjects.api";
import { difficultyLabel } from "@/utils/formatters";
import SkeletonCard from "@/components/shared/SkeletonCard";
import type { Topic } from "@/types/subject.types";
import "@/styles/pages/topic-detail.css";

const difficultyColor = [
  "",
  "success",
  "info",
  "warning",
  "accent",
  "danger",
] as const;

export default function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"concepts" | "pitfalls" | "realworld">(
    "concepts",
  );

  useEffect(() => {
    if (!topicId) return;
    setLoading(true);
    subjectsAPI
      .getTopic(topicId)
      .then((res) => setTopic(res.data.data))
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading)
    return (
      <div className="container" style={{ paddingTop: "var(--space-10)" }}>
        <SkeletonCard height={400} lines={6} />
      </div>
    );

  if (!topic)
    return (
      <div
        className="container"
        style={{ paddingTop: "var(--space-10)", textAlign: "center" }}
      >
        <h2>Topic not found</h2>
      </div>
    );

  return (
    <div className="topic-detail">
      <div className="container">
        {/* Header */}
        <div className="topic-hero">
          <button
            className="topic-back btn btn-ghost btn-sm"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <div className="topic-hero-content">
            <div className="topic-meta">
              <span
                className={`badge badge-${difficultyColor[topic.difficulty]}`}
              >
                {difficultyLabel(topic.difficulty)}
              </span>
              <span className="badge badge-primary">
                {topic.exerciseIds.length} exercises
              </span>
            </div>
            <h1 className="topic-title">{topic.name}</h1>
            <p className="topic-subtitle">
              {topic.realWorld[0]?.example ?? "A core mathematical concept."}
            </p>
          </div>
          {user && (
            <button
              className="btn btn-primary btn-lg topic-forge-btn"
              onClick={() => navigate(`/topics/${topicId}/forge`)}
            >
              ⚡ Enter Forge Mode
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="topic-tabs">
          {(["concepts", "pitfalls", "realworld"] as const).map((t) => (
            <button
              key={t}
              className={`topic-tab ${tab === t ? "topic-tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "concepts" && "🧠 Concepts"}
              {t === "pitfalls" && "⚠️ Pitfalls"}
              {t === "realworld" && "🌍 Real world"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="topic-content">
          {tab === "concepts" && (
            <div className="concepts-list">
              {topic.concepts.map((c, i) => (
                <div key={i} className="concept-card card">
                  <div className="concept-header">
                    <div className="concept-number">{i + 1}</div>
                    <h3 className="concept-title">{c.title}</h3>
                    <span className="badge badge-primary">{c.visualType}</span>
                  </div>
                  <p className="concept-explanation">{c.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "pitfalls" && (
            <div className="pitfalls-list">
              {topic.pitfalls.map((p, i) => (
                <div key={i} className="pitfall-detail-card card">
                  <div className="pitfall-detail-header">
                    <span className="pitfall-detail-warning">
                      ⚠️ Common mistake
                    </span>
                    <span className="pitfall-detail-pct">
                      {p.affectedPct}% of students
                    </span>
                  </div>
                  <h3 className="pitfall-detail-title">{p.description}</h3>
                  <div className="pitfall-detail-sections">
                    <div className="pitfall-section">
                      <span className="pitfall-section-label">
                        Why it happens
                      </span>
                      <p>{p.whyCommon}</p>
                    </div>
                    <div className="pitfall-section pitfall-section--fix">
                      <span className="pitfall-section-label">The fix</span>
                      <p>{p.fixStrategy}</p>
                    </div>
                  </div>
                  <div
                    className="pitfall-bar-track"
                    style={{ marginTop: "var(--space-3)" }}
                  >
                    <div
                      className="pitfall-bar-fill"
                      style={{ width: `${p.affectedPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "realworld" && (
            <div className="realworld-grid">
              {topic.realWorld.map((r, i) => (
                <div key={i} className="realworld-card card">
                  <div className="realworld-domain">{r.domain}</div>
                  <p className="realworld-example">{r.example}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="topic-cta">
          {user ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(`/topics/${topicId}/forge`)}
            >
              ⚡ Start Forge Mode — learn this topic now
            </button>
          ) : (
            <div className="topic-cta-locked">
              <p>
                Sign up free to access Forge Mode exercises and track your
                progress.
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/")}>
                Create free account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
