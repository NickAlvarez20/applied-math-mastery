import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSubjectStore } from "@/store/subjectStore";
import { subjectsAPI } from "@/api/subjects.api";
import { formatSalary, difficultyLabel } from "@/utils/formatters";
import SkeletonCard from "@/components/shared/SkeletonCard";
import type { Subject, Topic } from "@/types/subject.types";
import "@/styles/pages/subject-hub.css";

export default function SubjectHub() {
  const { subjectId } = useParams<{ subjectId?: string }>();
  const { subjects, status, setSubjects, setStatus, setError } =
    useSubjectStore();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  useEffect(() => {
    if (subjects.length > 0) return;
    setStatus("loading");
    subjectsAPI
      .list()
      .then((res) => {
        setSubjects(res.data.data);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    if (!subjectId) {
      setTopics([]);
      return;
    }
    setTopicsLoading(true);
    subjectsAPI
      .getTopics(subjectId)
      .then((res) => setTopics(res.data.data))
      .catch(() => setTopics([]))
      .finally(() => setTopicsLoading(false));
  }, [subjectId]);

  const selectedSubject = subjectId
    ? subjects.find((s) => s.id === subjectId)
    : null;

  return (
    <div className="subject-hub">
      <div className="container">
        {subjectId && selectedSubject ? (
          <>
            <div className="hub-header" style={{ textAlign: "left" }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate("/subjects")}
                style={{ marginBottom: "var(--space-4)" }}
              >
                ← All subjects
              </button>
              <h1 className="hub-title">
                {selectedSubject.icon} {selectedSubject.name}
              </h1>
              <p className="hub-subtitle" style={{ margin: 0 }}>
                {selectedSubject.description}
              </p>
            </div>

            {topicsLoading && (
              <div className="topics-list">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} height={72} lines={1} />
                ))}
              </div>
            )}

            {!topicsLoading && topics.length === 0 && (
              <p className="hub-error">No topics found for this subject.</p>
            )}

            {!topicsLoading && topics.length > 0 && (
              <div className="topics-list">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    to={`/topics/${topic.id}`}
                    className="topic-row card card-hover"
                  >
                    <span className="topic-row-title">{topic.name}</span>
                    <span className="topic-row-meta">
                      <span className="badge badge-primary">
                        {difficultyLabel(topic.difficulty)}
                      </span>
                      <span className="badge badge-xp">
                        {topic.exerciseIds.length} exercises
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="hub-header">
              <h1 className="hub-title">Choose your subject</h1>
              <p className="hub-subtitle">
                Each subject shows real-world applications and the careers
                mastery unlocks.
              </p>
            </div>

            {status === "loading" && (
              <div className="subjects-grid">
                {[1, 2, 3, 4].map((i) => (
                  <SkeletonCard key={i} height={240} />
                ))}
              </div>
            )}

            {status === "error" && (
              <div className="hub-error">
                Could not load subjects — is the backend running?
              </div>
            )}

            {(status === "success" || subjects.length > 0) && (
              <div className="subjects-grid">
                {subjects.map((s) => (
                  <SubjectCard
                    key={s.id}
                    subject={s}
                    onClick={() => navigate(`/subjects/${s.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  onClick,
}: {
  subject: Subject;
  onClick: () => void;
}) {
  const topCareer = subject.careers?.[0];
  const maxBoost = Math.max(
    ...(subject.careers?.map((c) => c.salaryBoostUSD) ?? [0]),
  );

  return (
    <div
      className="subject-card card card-hover"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="subject-card-top">
        <div className="subject-icon">{subject.icon}</div>
        <div className="subject-info">
          <h2 className="subject-name">{subject.name}</h2>
          <p className="subject-desc">{subject.description}</p>
        </div>
      </div>

      {/* Career impact teaser */}
      {topCareer && (
        <div className="subject-career-teaser">
          <span className="career-teaser-label">Top career</span>
          <span className="career-teaser-role">{topCareer.title}</span>
          <span className="career-teaser-salary">
            {formatSalary(topCareer.avgSalaryUSD)}/yr
          </span>
        </div>
      )}
      {/* was subject.topicIds / if bug happens its right here */}
      <div className="subject-footer">
        <span className="badge badge-primary">
          {subject.topicCount ?? subject.topicIds?.length ?? 0} topics 
        </span>
        <span className="badge badge-xp">
          Up to +{formatSalary(maxBoost)} earnings boost
        </span>
      </div>

      {/* Demand indicators */}
      <div className="subject-careers">
        {subject.careers?.slice(0, 3).map((c) => (
          <span key={c.title} className="subject-career-pill">
            {c.title}
          </span>
        ))}
      </div>
    </div>
  );
}
