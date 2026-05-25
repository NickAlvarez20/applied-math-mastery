import { useEffect, useState } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import { subjectsAPI } from "@/api/subjects.api";
import { formatSalary } from "@/utils/formatters";
import type { Career } from "@/types/subject.types";
import "@/styles/pages/career-explorer.css";

interface CareerWithSubject extends Career {
  subject: string;
  subjectIcon: string;
}

const demandColor: Record<string, string> = {
  high: "success",
  "very high": "info",
  extreme: "badge-rare",
};

export default function CareerExplorer() {
  const { subjects, setSubjects } = useSubjectStore();
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<"salary" | "boost">("boost");

  useEffect(() => {
    if (subjects.length > 0) return;
    subjectsAPI.list().then((res) => setSubjects(res.data.data));
  }, []);

  const allCareers: CareerWithSubject[] = subjects.flatMap((s) =>
    (s.careers ?? []).map((c) => ({
      ...c,
      subject: s.name,
      subjectIcon: s.icon,
    })),
  );

  const filtered = allCareers
    .filter(
      (c) =>
        filter === "" ||
        c.title.toLowerCase().includes(filter.toLowerCase()) ||
        c.subject.toLowerCase().includes(filter.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === "salary"
        ? b.avgSalaryUSD - a.avgSalaryUSD
        : b.salaryBoostUSD - a.salaryBoostUSD,
    );

  return (
    <div className="career-explorer">
      <div className="container">
        <div className="explorer-header">
          <h1 className="explorer-title">Math career explorer</h1>
          <p className="explorer-subtitle">
            See exactly which math skills unlock which careers and the earnings
            premium mastery brings.
          </p>
        </div>

        {/* Controls */}
        <div className="explorer-controls">
          <input
            className="form-input explorer-search"
            style={{ paddingLeft: "40px" }}
            type="text"
            placeholder="Search careers or subjects…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="explorer-sort">
            <span className="explorer-sort-label">Sort by</span>
            <button
              className={`btn btn-sm ${sortBy === "boost" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSortBy("boost")}
            >
              Earnings boost
            </button>
            <button
              className={`btn btn-sm ${sortBy === "salary" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSortBy("salary")}
            >
              Base salary
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="careers-grid">
          {filtered.map((c, i) => (
            <div
              key={`${c.subject}-${c.title}-${i}`}
              className="career-card card card-hover"
            >
              <div className="career-card-top">
                <span className="career-subject-tag">
                  {c.subjectIcon} {c.subject}
                </span>
                <span
                  className={`badge badge-${demandColor[c.demand] ?? "primary"}`}
                >
                  {c.demand} demand
                </span>
              </div>
              <h3 className="career-title">{c.title}</h3>
              <div className="career-salaries">
                <div className="career-salary-item">
                  <span className="career-salary-label">Average salary</span>
                  <span className="career-salary-value">
                    {formatSalary(c.avgSalaryUSD)}
                  </span>
                </div>
                <div className="career-salary-divider" />
                <div className="career-salary-item career-salary-item--boost">
                  <span className="career-salary-label">Mastery boost</span>
                  <span className="career-salary-value career-salary-boost">
                    +{formatSalary(c.salaryBoostUSD)}
                  </span>
                </div>
              </div>
              <div className="career-boost-bar-track">
                <div
                  className="career-boost-bar-fill"
                  style={{
                    width: `${Math.min(100, (c.salaryBoostUSD / c.avgSalaryUSD) * 100 * 2)}%`,
                  }}
                />
              </div>
              <p className="career-boost-caption">
                Potential{" "}
                {((c.salaryBoostUSD / c.avgSalaryUSD) * 100).toFixed(0)}% salary
                increase from mastery
              </p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="explorer-empty">
            <p>No careers match "{filter}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
