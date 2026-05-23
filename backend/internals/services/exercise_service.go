package services

import (
	"fmt"
	"mathforge/internals/models"
	"mathforge/internals/store"
)

type ExerciseService struct {
	subjectRepo  store.SubjectRepository
	progressRepo store.ProgressRepository
	pathSvc      *LearningPathService
}

func NewExerciseService(
	s store.SubjectRepository,
	p store.ProgressRepository,
	path *LearningPathService,
) *ExerciseService {
	return &ExerciseService{
		subjectRepo:  s,
		progressRepo: p,
		pathSvc:      path,
	}
}

// NextForTopic returns the best next exercise for this user + topic.
func (s *ExerciseService) NextForTopic(
	userID, topicID string,
) (*models.Exercise, MasteryBand, error) {
	exercises, err := s.subjectRepo.FindExercisesByTopicID(topicID)
	if err != nil {
		return nil, MasteryNovice, fmt.Errorf("loading exercises: %w", err)
	}
	band := s.pathSvc.MasteryFor(userID, topicID)
	next := s.pathSvc.NextExercise(userID, topicID, exercises)
	if next == nil {
		return nil, band, fmt.Errorf("no exercises found for topic %q", topicID)
	}
	return next, band, nil
}

// Submit scores one exercise answer and persists the result.
func (s *ExerciseService) Submit(
	userID, exerciseID, userAnswer string,
) (*models.ExerciseResult, error) {
	ex, err := s.subjectRepo.FindExerciseByID(exerciseID)
	if err != nil {
		return nil, fmt.Errorf("exercise not found: %w", err)
	}
	correct := userAnswer == ex.Answer
	xp := 0
	if correct {
		xp = ex.XPReward
	}
	return &models.ExerciseResult{
		Correct:       correct,
		XPEarned:      xp,
		Explanation:   ex.Explanation,
		CorrectAnswer: ex.Answer,
	}, nil
}

// Recommended returns topics sorted by what the user needs most.
func (s *ExerciseService) Recommended(
	userID, subjectID string,
) ([]models.Topic, error) {
	return s.pathSvc.RecommendedTopics(userID, subjectID)
}