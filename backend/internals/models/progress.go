package models

import "time"

type TopicProgress struct {
	UserID      string    `json:"userId"`
	TopicID     string    `json:"topicId"`
	Completed   bool      `json:"completed"`
	BestScore   int       `json:"bestScore"`   // 0–100
	Attempts    int       `json:"attempts"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`
}

type UserStreak struct {
	UserID     string    `json:"userId"`
	Current    int       `json:"current"`
	Longest    int       `json:"longest"`
	LastActive time.Time `json:"lastActive"`
}

type DailyReward struct {
	UserID    string    `json:"userId"`
	Date      string    `json:"date"`      // "2024-01-15"
	XPAwarded int       `json:"xpAwarded"`
	Claimed   bool      `json:"claimed"`
	ClaimedAt *time.Time `json:"claimedAt,omitempty"`
}