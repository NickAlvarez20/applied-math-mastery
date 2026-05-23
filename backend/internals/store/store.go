package store

import "mathforge/internals/models"

// UserRepository defines all user data operations.
type UserRepository interface {
	Create(user *models.User) error
	FindByID(id string) (*models.User, error)
	FindByEmail(email string) (*models.User, error)
	Update(user *models.User) error
	Delete(id string) error
}

// SubjectRepository defines content read operations.
type SubjectRepository interface {
	FindAll() ([]models.Subject, error)
	FindByID(id string) (*models.Subject, error)
	FindTopicsBySubjectID(subjectID string) ([]models.Topic, error)
	FindTopicByID(topicID string) (*models.Topic, error)
	FindExercisesByTopicID(topicID string) ([]models.Exercise, error)
	FindExerciseByID(id string) (*models.Exercise, error)
}

// ProgressRepository defines learning progress operations.
type ProgressRepository interface {
	GetProgress(userID, topicID string) (*models.TopicProgress, error)
	GetAllProgress(userID string) ([]models.TopicProgress, error)
	SaveProgress(p *models.TopicProgress) error
	GetStreak(userID string) (*models.UserStreak, error)
	SaveStreak(s *models.UserStreak) error
	GetDailyReward(userID, date string) (*models.DailyReward, error)
	SaveDailyReward(r *models.DailyReward) error
}

// AchievementRepository defines badge operations.
type AchievementRepository interface {
	GetAllDefs() ([]models.AchievementDef, error)
	GetUserAchievements(userID string) ([]models.UserAchievement, error)
	GrantAchievement(ua *models.UserAchievement) error
	HasAchievement(userID, achievementID string) (bool, error)
}

// LeaderboardRepository defines ranking operations.
type LeaderboardRepository interface {
	GetGlobal(limit int) ([]models.LeaderboardEntry, error)
	GetWeekly(limit int) ([]models.LeaderboardEntry, error)
	UpsertEntry(entry *models.LeaderboardEntry) error
	GetRank(userID string) (*models.LeaderboardEntry, error)
}