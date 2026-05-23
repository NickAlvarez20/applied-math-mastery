export interface Career {
  title: string;
  avgSalaryUSD: number;
  salaryBoostUSD: number;
  demand: "high" | "very high" | "extreme";
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  topicCount: number;
  careers: Career[];
}

export interface Pitfall {
  description: string;
  whyCommon: string;
  fixStrategy: string;
  affectedPct: number;
}

export interface RealWorldExample {
  domain: string;
  example: string;
}

export interface Concept {
  title: string;
  explanation: string;
  visualType: "graph" | "simulation" | "drag" | "quiz";
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  concepts: Concept[];
  pitfalls: Pitfall[];
  realWorld: RealWorldExample[];
  exerciseIds: string[];
}
