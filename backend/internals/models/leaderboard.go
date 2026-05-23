package models

type LeaderboardEntry struct {
	Rank     int    `json:"rank"`
	UserID   string `json:"userId"`
	Username string `json:"username"`
	XP       int    `json:"xp"`
	Level    int    `json:"level"`
	Streak   int    `json:"streak"`
}

type LeaderboardType string

const (
	LeaderboardGlobal LeaderboardType = "global"
	LeaderboardWeekly LeaderboardType = "weekly"
)