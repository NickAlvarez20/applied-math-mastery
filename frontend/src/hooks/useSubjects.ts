import { useEffect } from "react";
import { useSubjectStore } from "@/store/subjectStore";
import { subjectsAPI } from "@/api/subjects.api";

// Fetches and caches subjects. Safe to call from multiple components —
// the store check prevents duplicate requests.
export function useSubjects() {
  const { subjects, status, setSubjects, setStatus, setError } =
    useSubjectStore();

  useEffect(() => {
    if (subjects.length > 0 || status === "loading") return;
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

  return { subjects, status };
}
