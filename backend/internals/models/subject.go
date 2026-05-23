package models

type Subject struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Slug        string    `json:"slug"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	TopicIDs    []string  `json:"topicIds"`
	Careers     []Career  `json:"careers"`
}

type Career struct {
	Title          string `json:"title"`
	AvgSalaryUSD   int    `json:"avgSalaryUSD"`
	SalaryBoostUSD int    `json:"salaryBoostUSD"`
	Demand         string `json:"demand"` // "high" | "very high" | "extreme"
}

type Topic struct {
	ID          string           `json:"id"`
	SubjectID   string           `json:"subjectId"`
	Name        string           `json:"name"`
	Difficulty  int              `json:"difficulty"` // 1–5
	Concepts    []Concept        `json:"concepts"`
	Pitfalls    []Pitfall        `json:"pitfalls"`
	RealWorld   []RealWorldExample `json:"realWorld"`
	ExerciseIDs []string         `json:"exerciseIds"`
}

type Concept struct {
	Title       string `json:"title"`
	Explanation string `json:"explanation"`
	VisualType  string `json:"visualType"` // "graph" | "simulation" | "drag" | "quiz"
}

type Pitfall struct {
	Description string `json:"description"`
	WhyCommon   string `json:"whyCommon"`
	FixStrategy string `json:"fixStrategy"`
	AffectedPct int    `json:"affectedPct"`
}

type RealWorldExample struct {
	Domain  string `json:"domain"`
	Example string `json:"example"`
}