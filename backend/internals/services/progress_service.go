package services

import (
	"time"
	"mathforge/internals/models"
	"mathforge/internals/store"
)

type ProgressService struct {
	repo       store.ProgressRepository
	leaderRepo store.LeaderboardRepository
	userRepo   store.UserRepository
}

func NewProgressService(
	r store.ProgressRepository,
	l store.LeaderboardRepository,
	u store.UserRepository,
) *ProgressService {
	return &ProgressService{repo: r, leaderRepo: l, userRepo: u}
}

func (s *ProgressService) GetAll(userID string) ([]models.TopicProgress, error) {
	return s.repo.GetAllProgress(userID)
}

// Submit records a completed exercise, updates XP, and refreshes the streak.
func (s *ProgressService) Submit(userID, topicID string, score, xp int) error {
	now := time.Now()

	// Update topic progress
	existing, _ := s.repo.GetProgress(userID, topicID)
	best := score
	attempts := 1
	if existing != nil {
		if existing.BestScore > best {
			best = existing.BestScore
		}
		attempts = existing.Attempts + 1
	}
	completed := score >= 70 // pass threshold
	var completedAt *time.Time
	if completed {
		completedAt = &now
	}
	if err := s.repo.SaveProgress(&models.TopicProgress{
		UserID:      userID,
		TopicID:     topicID,
		Completed:   completed,
		BestScore:   best,
		Attempts:    attempts,
		CompletedAt: completedAt,
	}); err != nil {
		return err
	}

	// Update streak
	streak, _ := s.repo.GetStreak(userID)
	if streak == nil {
		streak = &models.UserStreak{UserID: userID}
	}
	today := now.Format("2006-01-02")
	lastActive := streak.LastActive.Format("2006-01-02")
	yesterday := now.AddDate(0, 0, -1).Format("2006-01-02")

	if lastActive == today {
		// Already active today, no change to streak count
	} else if lastActive == yesterday {
		streak.Current++
	} else {
		streak.Current = 1 // reset
	}
	if streak.Current > streak.Longest {
		streak.Longest = streak.Current
	}
	streak.LastActive = now
	s.repo.SaveStreak(streak)

	// Update leaderboard
	username := "Learner"
	if user, err := s.userRepo.FindByID(userID); err == nil && user.Username != "" {
		username = user.Username
	}
	totalXP := xp
	if existing, err := s.leaderRepo.GetRank(userID); err == nil {
		totalXP = existing.XP + xp
	}
	s.leaderRepo.UpsertEntry(&models.LeaderboardEntry{
		UserID:   userID,
		Username: username,
		XP:       totalXP,
		Level:    xpLevel(totalXP),
		Streak:   streak.Current,
	})
	return nil
}

func (s *ProgressService) GetStreak(userID string) (*models.UserStreak, error) {
	return s.repo.GetStreak(userID)
}

func (s *ProgressService) ClaimDaily(userID string) (int, error) {
	today := time.Now().Format("2006-01-02")
	existing, _ := s.repo.GetDailyReward(userID, today)
	if existing != nil && existing.Claimed {
		return 0, nil // already claimed today
	}
	xp := 25
	now := time.Now()
	s.repo.SaveDailyReward(&models.DailyReward{
		UserID:    userID,
		Date:      today,
		XPAwarded: xp,
		Claimed:   true,
		ClaimedAt: &now,
	})
	return xp, nil
}

func xpLevel(xp int) int {
	if xp < 500 {
		return 1
	}
	return 1 + xp/500
}