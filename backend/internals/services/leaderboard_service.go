package services

import (
	"mathforge/internals/models"
	"mathforge/internals/store"
)

type LeaderboardService struct {
	repo store.LeaderboardRepository
}

func NewLeaderboardService(r store.LeaderboardRepository) *LeaderboardService {
	return &LeaderboardService{repo: r}
}

func (s *LeaderboardService) GetGlobal(limit int) ([]models.LeaderboardEntry, error) {
	return s.repo.GetGlobal(limit)
}

func (s *LeaderboardService) GetWeekly(limit int) ([]models.LeaderboardEntry, error) {
	return s.repo.GetWeekly(limit)
}

func (s *LeaderboardService) GetRank(userID string) (*models.LeaderboardEntry, error) {
	return s.repo.GetRank(userID)
}