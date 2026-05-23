package memory

import (
	"fmt"
	"sync"
	"mathforge/internals/models"
)

type AchievementStore struct {
	mu           sync.RWMutex
	defs         []models.AchievementDef
	userBadges   map[string][]models.UserAchievement // userID → []earned
}

func NewAchievementStore() *AchievementStore {
	return &AchievementStore{
		defs:       seedAchievementDefs(),
		userBadges: make(map[string][]models.UserAchievement),
	}
}

func (s *AchievementStore) GetAllDefs() ([]models.AchievementDef, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.defs, nil
}

func (s *AchievementStore) GetUserAchievements(userID string) ([]models.UserAchievement, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.userBadges[userID], nil
}

func (s *AchievementStore) GrantAchievement(ua *models.UserAchievement) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.userBadges[ua.UserID] = append(s.userBadges[ua.UserID], *ua)
	return nil
}

func (s *AchievementStore) HasAchievement(userID, achievementID string) (bool, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, ua := range s.userBadges[userID] {
		if ua.AchievementID == achievementID {
			return true, nil
		}
	}
	return false, nil
}

// seedAchievementDefs pre-loads all badge definitions at startup.
func seedAchievementDefs() []models.AchievementDef {
	return []models.AchievementDef{
		{
			ID: "first_topic", Title: "First Steps",
			Description: "Complete your first topic",
			Icon: "🎯", Rarity: models.RarityCommon,
			RequiredTopics: 1,
		},
		{
			ID: "streak_7", Title: "Week Warrior",
			Description: "Maintain a 7-day streak",
			Icon: "🔥", Rarity: models.RarityRare,
			RequiredStreak: 7,
		},
		{
			ID: "xp_1000", Title: "Knowledge Seeker",
			Description: "Earn 1000 XP",
			Icon: "⭐", Rarity: models.RarityRare,
			RequiredXP: 1000,
		},
		{
			ID: "xp_5000", Title: "Math Adept",
			Description: "Earn 5000 XP",
			Icon: "💎", Rarity: models.RarityEpic,
			RequiredXP: 5000,
		},
		{
			ID: "streak_30", Title: "Unstoppable",
			Description: "Maintain a 30-day streak",
			Icon: "🏆", Rarity: models.RarityLegendary,
			RequiredStreak: 30,
		},
		{
			ID: "topics_10", Title: "Subject Master",
			Description: "Complete 10 topics",
			Icon: "📚", Rarity: models.RarityEpic,
			RequiredTopics: 10,
		},
	}
}

// Ensure AchievementStore satisfies the interface at compile time
var _ interface {
	GetAllDefs() ([]models.AchievementDef, error)
	GetUserAchievements(string) ([]models.UserAchievement, error)
	GrantAchievement(*models.UserAchievement) error
	HasAchievement(string, string) (bool, error)
} = (*AchievementStore)(nil)

// Suppress unused import
var _ = fmt.Sprintf