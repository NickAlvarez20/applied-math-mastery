package services

import (
	"fmt"
	"mathforge/internals/models"
	"mathforge/internals/store"
)

type SubjectService struct {
	repo store.SubjectRepository
}

func NewSubjectService(r store.SubjectRepository) *SubjectService {
	return &SubjectService{repo: r}
}

func (s *SubjectService) ListAll() ([]models.Subject, error) {
	return s.repo.FindAll()
}

func (s *SubjectService) GetByID(id string) (*models.Subject, error) {
	sub, err := s.repo.FindByID(id)
	if err != nil {
		return nil, fmt.Errorf("subject not found")
	}
	return sub, nil
}

func (s *SubjectService) GetTopics(subjectID string) ([]models.Topic, error) {
	return s.repo.FindTopicsBySubjectID(subjectID)
}

func (s *SubjectService) GetTopic(topicID string) (*models.Topic, error) {
	t, err := s.repo.FindTopicByID(topicID)
	if err != nil {
		return nil, fmt.Errorf("topic not found")
	}
	return t, nil
}