package memory

import (
	"fmt"
	"sync"
	"mathforge/internals/models"
)

type ProgressStore struct {
	mu       sync.RWMutex
	progress map[string]*models.TopicProgress // "userID:topicID" → progress
	streaks  map[string]*models.UserStreak    // userID → streak
	daily    map[string]*models.DailyReward   // "userID:date" → reward
}

func NewProgressStore() *ProgressStore {
	return &ProgressStore{
		progress: make(map[string]*models.TopicProgress),
		streaks:  make(map[string]*models.UserStreak),
		daily:    make(map[string]*models.DailyReward),
	}
}

func progressKey(userID, topicID string) string {
	return userID + ":" + topicID
}

func (s *ProgressStore) GetProgress(userID, topicID string) (*models.TopicProgress, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	p, ok := s.progress[progressKey(userID, topicID)]
	if !ok {
		return nil, fmt.Errorf("no progress found")
	}
	return p, nil
}

func (s *ProgressStore) GetAllProgress(userID string) ([]models.TopicProgress, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var result []models.TopicProgress
	for _, p := range s.progress {
		if p.UserID == userID {
			result = append(result, *p)
		}
	}
	return result, nil
}

func (s *ProgressStore) SaveProgress(p *models.TopicProgress) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.progress[progressKey(p.UserID, p.TopicID)] = p
	return nil
}

func (s *ProgressStore) GetStreak(userID string) (*models.UserStreak, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	streak, ok := s.streaks[userID]
	if !ok {
		// Return a fresh streak rather than an error
		return &models.UserStreak{UserID: userID, Current: 0, Longest: 0}, nil
	}
	return streak, nil
}

func (s *ProgressStore) SaveStreak(streak *models.UserStreak) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.streaks[streak.UserID] = streak
	return nil
}

func (s *ProgressStore) GetDailyReward(userID, date string) (*models.DailyReward, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	key := userID + ":" + date
	r, ok := s.daily[key]
	if !ok {
		return nil, fmt.Errorf("no daily reward for %s on %s", userID, date)
	}
	return r, nil
}

func (s *ProgressStore) SaveDailyReward(r *models.DailyReward) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.daily[r.UserID+":"+r.Date] = r
	return nil
}