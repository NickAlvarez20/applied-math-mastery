package memory

import (
	"fmt"
	"sort"
	"sync"
	"mathforge/internals/models"
)

type LeaderboardStore struct {
	mu      sync.RWMutex
	global  map[string]*models.LeaderboardEntry // userID → entry
	weekly  map[string]*models.LeaderboardEntry
}

func NewLeaderboardStore() *LeaderboardStore {
	return &LeaderboardStore{
		global: make(map[string]*models.LeaderboardEntry),
		weekly: make(map[string]*models.LeaderboardEntry),
	}
}

func (s *LeaderboardStore) UpsertEntry(entry *models.LeaderboardEntry) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.global[entry.UserID] = entry
	s.weekly[entry.UserID] = entry
	return nil
}

func (s *LeaderboardStore) GetGlobal(limit int) ([]models.LeaderboardEntry, error) {
	return s.getSorted(s.global, limit)
}

func (s *LeaderboardStore) GetWeekly(limit int) ([]models.LeaderboardEntry, error) {
	return s.getSorted(s.weekly, limit)
}

func (s *LeaderboardStore) GetRank(userID string) (*models.LeaderboardEntry, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	e, ok := s.global[userID]
	if !ok {
		return nil, fmt.Errorf("user not on leaderboard")
	}
	return e, nil
}

func (s *LeaderboardStore) getSorted(
	m map[string]*models.LeaderboardEntry, limit int,
) ([]models.LeaderboardEntry, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	entries := make([]models.LeaderboardEntry, 0, len(m))
	for _, e := range m {
		entries = append(entries, *e)
	}
	sort.Slice(entries, func(i, j int) bool {
		return entries[i].XP > entries[j].XP
	})
	if limit > 0 && len(entries) > limit {
		entries = entries[:limit]
	}
	for i := range entries {
		entries[i].Rank = i + 1
	}
	return entries, nil
}