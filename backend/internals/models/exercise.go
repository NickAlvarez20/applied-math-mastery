package models

type ExerciseType string

const (
	ExerciseTypeMultipleChoice ExerciseType = "multiple_choice"
	ExerciseTypeDragDrop       ExerciseType = "drag_drop"
	ExerciseTypeGraphChallenge ExerciseType = "graph_challenge"
	ExerciseTypeProofBuilder   ExerciseType = "proof_builder"
)

type Exercise struct {
	ID          string       `json:"id"`
	TopicID     string       `json:"topicId"`
	Type        ExerciseType `json:"type"`
	Question    string       `json:"question"`
	Options     []string     `json:"options,omitempty"`
	Answer      string       `json:"answer"`   // correct answer key
	Explanation string       `json:"explanation"`
	Difficulty  int          `json:"difficulty"` // 1–5
	XPReward    int          `json:"xpReward"`
	Hint        string       `json:"hint,omitempty"`
}

type ExerciseSubmission struct {
	ExerciseID string `json:"exerciseId"`
	UserAnswer string `json:"userAnswer"`
	TimeTaken  int    `json:"timeTaken"` // seconds
}

type ExerciseResult struct {
	Correct     bool   `json:"correct"`
	XPEarned    int    `json:"xpEarned"`
	Explanation string `json:"explanation"`
	CorrectAnswer string `json:"correctAnswer"`
}