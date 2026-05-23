package models

import "time"

type Rarity string

const (
	RarityCommon    Rarity = "common"
	RarityRare      Rarity = "rare"
	RarityEpic      Rarity = "epic"
	RarityLegendary Rarity = "legendary"
)

type AchievementDef struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Rarity      Rarity `json:"rarity"`
	// Trigger conditions
	RequiredXP      int `json:"requiredXP,omitempty"`
	RequiredStreak  int `json:"requiredStreak,omitempty"`
	RequiredTopics  int `json:"requiredTopics,omitempty"`
}

type UserAchievement struct {
	UserID        string    `json:"userId"`
	AchievementID string    `json:"achievementId"`
	UnlockedAt    time.Time `json:"unlockedAt"`
}

// AchievementView merges definition + unlock time for API responses.
type AchievementView struct {
	AchievementDef
	UnlockedAt time.Time `json:"unlockedAt"`
}