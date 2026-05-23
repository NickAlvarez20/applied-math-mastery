package services

import (
	"math"
	"sort"
	"mathforge/internals/models"
	"mathforge/internals/store"
)

// MasteryBand classifies how well a user knows a topic.
type MasteryBand string

const (
	MasteryNovice      MasteryBand = "novice"       // < 40%
	MasteryDeveloping  MasteryBand = "developing"   // 40–69%
	MasteryProficient  MasteryBand = "proficient"   // 70–89%
	MasteryMastered    MasteryBand = "mastered"     // 90–100%
)

type LearningPathService struct {
	progressRepo store.ProgressRepository
	subjectRepo  store.SubjectRepository
}

func NewLearningPathService(
	p store.ProgressRepository,
	s store.SubjectRepository,
) *LearningPathService {
	return &LearningPathService{progressRepo: p, subjectRepo: s}
}

// MasteryFor returns the mastery band for one topic.
func (s *LearningPathService) MasteryFor(userID, topicID string) MasteryBand {
	p, err := s.progressRepo.GetProgress(userID, topicID)
	if err != nil || p == nil {
		return MasteryNovice
	}
	return bandFromScore(p.BestScore)
}

// NextExercise picks the best exercise for this user right now.
// Strategy: prefer exercises at the difficulty one step above
// current mastery to keep the user in the "flow zone".
func (s *LearningPathService) NextExercise(
	userID, topicID string,
	exercises []models.Exercise,
) *models.Exercise {
	if len(exercises) == 0 {
		return nil
	}

	band     := s.MasteryFor(userID, topicID)
	target   := targetDifficulty(band)

	// Score each exercise: prefer target difficulty, then adjacent
	type scored struct {
		ex    models.Exercise
		score float64
	}
	candidates := make([]scored, len(exercises))
	for i, ex := range exercises {
		diff := math.Abs(float64(ex.Difficulty - target))
		// Higher score = more preferred
		candidates[i] = scored{ex: ex, score: 10 - diff*3}
	}
	sort.Slice(candidates, func(i, j int) bool {
		return candidates[i].score > candidates[j].score
	})
	result := candidates[0].ex
	return &result
}

// RecommendedTopics returns topics ordered by what the user should
// study next — prioritises low mastery in the current subject.
func (s *LearningPathService) RecommendedTopics(
	userID, subjectID string,
) ([]models.Topic, error) {
	topics, err := s.subjectRepo.FindTopicsBySubjectID(subjectID)
	if err != nil {
		return nil, err
	}
	type ranked struct {
		topic models.Topic
		score int
	}
	ranks := make([]ranked, len(topics))
	for i, t := range topics {
		p, _ := s.progressRepo.GetProgress(userID, t.ID)
		score := 0
		if p == nil {
			score = 100 // never attempted — highest priority
		} else if !p.Completed {
			score = 80
		} else {
			// Completed — priority inversely proportional to best score
			score = 100 - p.BestScore
		}
		ranks[i] = ranked{topic: t, score: score}
	}
	sort.Slice(ranks, func(i, j int) bool {
		return ranks[i].score > ranks[j].score
	})
	result := make([]models.Topic, len(ranks))
	for i, r := range ranks {
		result[i] = r.topic
	}
	return result, nil
}

func bandFromScore(score int) MasteryBand {
	switch {
	case score >= 90:
		return MasteryMastered
	case score >= 70:
		return MasteryProficient
	case score >= 40:
		return MasteryDeveloping
	default:
		return MasteryNovice
	}
}

func targetDifficulty(band MasteryBand) int {
	switch band {
	case MasteryNovice:
		return 1
	case MasteryDeveloping:
		return 2
	case MasteryProficient:
		return 3
	case MasteryMastered:
		return 5
	default:
		return 1
	}
}