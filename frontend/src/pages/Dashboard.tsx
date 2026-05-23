import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProgressStore } from "@/store/progressStore";
import { useSubjectStore } from "@/store/subjectStore";
import { subjectsAPI } from "@/api/subjects.api";
import { progressAPI } from "@/api/progress.api";
import { formatXP, formatDate } from "@/utils/formatters";
import { xpProgressPercent, xpToNextLevel } from "@/utils/xp";
import DailyChallenge from '@/components/gamification/DailyChallenge'
import XPBar from "@/components/gamification/XPBar";
import SkeletonCard from "@/components/shared/SkeletonCard";
import "@/styles/pages/dashboard.css";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { xp, level, streak, topicMap, achievements } = useProgressStore();
  const { subjects, setSubjects } = useSubjectStore();
  const [streakData, setStreakData] = useState<{
    current: number;
    longest: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const reqs: Promise<any>[] = [
      progressAPI.getStreak().then((r) =>
        setStreakData({
          current: r.data.data.streak, // Maps 'streak' to 'current'
          longest: r.data.data.streak, // Sets 'longest' to the current streak for now
        }),
      ),
    ];
    if (subjects.length === 0) {
      reqs.push(subjectsAPI.list().then((r) => setSubjects(r.data.data)));
    }
    Promise.allSettled(reqs).finally(() => setLoading(false));
  }, []);

  const completedTopics = Object.values(topicMap).filter(
    (t) => t.completed,
  ).length;
  const totalTopics = subjects.reduce(
    (acc, s) => acc + (s.topicIds?.length ?? 0),
    0,
  );
  const overallPct =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="dashboard">
      <div className="container">
        {/* Welcome banner */}
        <div className="dash-welcome">
          <div className="dash-welcome-text">
            <h1 className="dash-title">
              Welcome back, {user?.username ?? "Learner"} 👋
            </h1>
            <p className="dash-subtitle">
              Keep your streak alive and earn XP with today's challenges.
            </p>
          </div>
          <div className="dash-welcome-streak">
            <div className="dash-streak-number">
              🔥 {streakData?.current ?? streak}
            </div>
            <div className="dash-streak-label">day streak</div>
          </div>
        </div>
        // Add this block directly below the dash-welcome section, before
        dash-stats:
        <div style={{ marginBottom: "var(--space-6)" }}>
          <DailyChallenge />
        </div>
        {/* Stats row */}
        <div className="dash-stats">
          <div className="dash-stat-card card">
            <div className="dash-stat-icon">⭐</div>
            <div className="dash-stat-value">{formatXP(xp)}</div>
            <div className="dash-stat-label">Total XP</div>
          </div>
          <div className="dash-stat-card card">
            <div className="dash-stat-icon">🎯</div>
            <div className="dash-stat-value">Level {level}</div>
            <div className="dash-stat-label">
              {xpToNextLevel(xp)} XP to next
            </div>
          </div>
          <div className="dash-stat-card card">
            <div className="dash-stat-icon">📚</div>
            <div className="dash-stat-value">{completedTopics}</div>
            <div className="dash-stat-label">Topics completed</div>
          </div>
          <div className="dash-stat-card card">
            <div className="dash-stat-icon">🏅</div>
            <div className="dash-stat-value">{achievements.length}</div>
            <div className="dash-stat-label">Achievements</div>
          </div>
        </div>
        {/* XP progress */}
        <div className="dash-section">
          <h2 className="dash-section-title">Level progress</h2>
          <div className="card">
            <XPBar />
          </div>
        </div>
        {/* Overall progress */}
        <div className="dash-section">
          <h2 className="dash-section-title">Overall curriculum progress</h2>
          <div className="card">
            <div className="dash-overall-header">
              <span className="dash-overall-pct">{overallPct}% complete</span>
              <span className="dash-overall-count">
                {completedTopics} / {totalTopics} topics
              </span>
            </div>
            <div className="dash-overall-track">
              <div
                className="dash-overall-fill"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>
        {/* Subject progress */}
        <div className="dash-section">
          <h2 className="dash-section-title">Progress by subject</h2>
          {loading ? (
            <div className="dash-subject-grid">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} height={100} />
              ))}
            </div>
          ) : (
            <div className="dash-subject-grid">
              {subjects.map((s) => {
                const topicsDone =
                  s.topicIds?.filter((id) => topicMap[id]?.completed).length ??
                  0;
                const total = s.topicIds?.length ?? 0;
                const pct =
                  total > 0 ? Math.round((topicsDone / total) * 100) : 0;
                return (
                  <Link
                    key={s.id}
                    to={`/subjects/${s.id}`}
                    className="dash-subject-card card card-hover"
                  >
                    <div className="dash-subject-top">
                      <span className="dash-subject-icon">{s.icon}</span>
                      <div>
                        <div className="dash-subject-name">{s.name}</div>
                        <div className="dash-subject-count">
                          {topicsDone}/{total} topics
                        </div>
                      </div>
                      <span className="dash-subject-pct">{pct}%</span>
                    </div>
                    <div className="dash-subject-track">
                      <div
                        className="dash-subject-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {/* Recent achievements */}
        {achievements.length > 0 && (
          <div className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Recent achievements</h2>
              <Link to="/achievements" className="btn btn-ghost btn-sm">
                View all →
              </Link>
            </div>
            <div className="dash-achievements">
              {achievements
                .slice(-3)
                .reverse()
                .map((a) => (
                  <div key={a.id} className="dash-achievement-item card">
                    <span className="dash-achievement-icon">{a.icon}</span>
                    <div>
                      <div className="dash-achievement-title">{a.title}</div>
                      <div className="dash-achievement-date">
                        Unlocked {formatDate(a.unlockedAt)}
                      </div>
                    </div>
                    <span
                      className={`badge badge-${a.rarity === "epic" ? "rare" : "primary"}`}
                    >
                      {a.rarity}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
