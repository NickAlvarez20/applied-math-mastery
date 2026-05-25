package jsonstore

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"mathforge/internals/models"
	"os"
	"path/filepath"
	"sync"
)

type SubjectStore struct {
	mu        sync.RWMutex
	subjects  map[string]*models.Subject
	topics    map[string]*models.Topic
	exercises map[string]*models.Exercise
}

func NewSubjectStore(dataPath string) *SubjectStore {
	return NewSubjectStoreFromFS(os.DirFS(dataPath), ".")
}

func NewSubjectStoreFromFS(fsys fs.FS, root string) *SubjectStore {
	s := &SubjectStore{
		subjects:  make(map[string]*models.Subject),
		topics:    make(map[string]*models.Topic),
		exercises: make(map[string]*models.Exercise),
	}
	if err := s.loadFromFS(fsys, root); err != nil {
		fmt.Printf("warning: could not load seed data: %v\n", err)
	}
	return s
}

func (s *SubjectStore) loadFromFS(fsys fs.FS, root string) error {
	subjectFile := filepath.Join(root, "subjects.json")
	if err := s.loadSubjectsFromFS(fsys, subjectFile); err != nil {
		return err
	}

	topicEntries, _ := fs.Glob(fsys, filepath.Join(root, "topics_*.json"))
	for _, f := range topicEntries {
		if err := s.loadTopicsFromFS(fsys, f); err != nil {
			return fmt.Errorf("loading %s: %w", f, err)
		}
	}

	exerciseFile := filepath.Join(root, "exercises.json")
	if err := s.loadExercisesFromFS(fsys, exerciseFile); err != nil {
		fmt.Printf("warning: could not load exercises: %v\n", err)
	}
	return nil
}

func (s *SubjectStore) loadSubjectsFromFS(fsys fs.FS, path string) error {
	data, err := fs.ReadFile(fsys, filepath.ToSlash(path))
	if err != nil {
		return fmt.Errorf("reading subjects.json: %w", err)
	}
	var subjects []models.Subject
	if err := json.Unmarshal(data, &subjects); err != nil {
		return fmt.Errorf("parsing subjects.json: %w", err)
	}
	for i := range subjects {
		s.subjects[subjects[i].ID] = &subjects[i]
	}
	return nil
}

func (s *SubjectStore) loadTopicsFromFS(fsys fs.FS, path string) error {
	data, err := fs.ReadFile(fsys, filepath.ToSlash(path))
	if err != nil {
		return fmt.Errorf("reading %s: %w", path, err)
	}
	var topics []models.Topic
	if err := json.Unmarshal(data, &topics); err != nil {
		return fmt.Errorf("parsing %s: %w", path, err)
	}
	for i := range topics {
		s.topics[topics[i].ID] = &topics[i]
	}
	return nil
}

func (s *SubjectStore) loadExercisesFromFS(fsys fs.FS, path string) error {
	data, err := fs.ReadFile(fsys, filepath.ToSlash(path))
	if err != nil {
		return fmt.Errorf("reading exercises.json: %w", err)
	}
	var exercises []models.Exercise
	if err := json.Unmarshal(data, &exercises); err != nil {
		return fmt.Errorf("parsing exercises.json: %w", err)
	}
	for i := range exercises {
		s.exercises[exercises[i].ID] = &exercises[i]
	}
	return nil
}

// Loaded returns whether seed content was read successfully.
func (s *SubjectStore) Loaded() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return len(s.subjects) > 0
}

func (s *SubjectStore) FindAll() ([]models.Subject, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	result := make([]models.Subject, 0, len(s.subjects))
	for _, sub := range s.subjects {
		result = append(result, *sub)
	}
	return result, nil
}

func (s *SubjectStore) FindByID(id string) (*models.Subject, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sub, ok := s.subjects[id]
	if !ok {
		return nil, fmt.Errorf("subject %q not found", id)
	}
	return sub, nil
}

func (s *SubjectStore) FindTopicsBySubjectID(subjectID string) ([]models.Topic, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var result []models.Topic
	for _, t := range s.topics {
		if t.SubjectID == subjectID {
			result = append(result, *t)
		}
	}
	return result, nil
}

func (s *SubjectStore) FindTopicByID(topicID string) (*models.Topic, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	t, ok := s.topics[topicID]
	if !ok {
		return nil, fmt.Errorf("topic %q not found", topicID)
	}
	return t, nil
}

func (s *SubjectStore) FindExercisesByTopicID(topicID string) ([]models.Exercise, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var result []models.Exercise
	for _, e := range s.exercises {
		if e.TopicID == topicID {
			result = append(result, *e)
		}
	}
	return result, nil
}

func (s *SubjectStore) FindExerciseByID(id string) (*models.Exercise, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	e, ok := s.exercises[id]
	if !ok {
		return nil, fmt.Errorf("exercise %q not found", id)
	}
	return e, nil
}
