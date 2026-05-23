import { create } from "zustand";
import type { Subject, Topic } from "@/types/subject.types";
import type { RequestStatus } from "@/types/api.types";

interface SubjectState {
  subjects: Subject[];
  currentSubject: Subject | null;
  currentTopic: Topic | null;
  status: RequestStatus;
  error: string | null;

  setSubjects: (s: Subject[]) => void;
  setCurrentSubject: (s: Subject | null) => void;
  setCurrentTopic: (t: Topic | null) => void;
  setStatus: (s: RequestStatus) => void;
  setError: (e: string | null) => void;
}

export const useSubjectStore = create<SubjectState>()((set) => ({
  subjects: [],
  currentSubject: null,
  currentTopic: null,
  status: "idle",
  error: null,

  setSubjects: (subjects) => set({ subjects }),
  setCurrentSubject: (s) => set({ currentSubject: s }),
  setCurrentTopic: (t) => set({ currentTopic: t }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
}));
