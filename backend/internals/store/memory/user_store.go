package memory

import (
	"fmt"
	"sync"
	"mathforge/internals/models"
)

type UserStore struct {
	mu    sync.RWMutex
	users map[string]*models.User      // id → user
	emails map[string]*models.User     // email → user (fast lookup)
}

func NewUserStore() *UserStore {
	return &UserStore{
		users:  make(map[string]*models.User),
		emails: make(map[string]*models.User),
	}
}

func (s *UserStore) Create(u *models.User) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, exists := s.emails[u.Email]; exists {
		return fmt.Errorf("email already registered")
	}
	s.users[u.ID] = u
	s.emails[u.Email] = u
	return nil
}

func (s *UserStore) FindByID(id string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	u, ok := s.users[id]
	if !ok {
		return nil, fmt.Errorf("user %q not found", id)
	}
	return u, nil
}

func (s *UserStore) FindByEmail(email string) (*models.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	u, ok := s.emails[email]
	if !ok {
		return nil, fmt.Errorf("user with email %q not found", email)
	}
	return u, nil
}

func (s *UserStore) Update(u *models.User) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.users[u.ID]; !ok {
		return fmt.Errorf("user %q not found", u.ID)
	}
	s.users[u.ID] = u
	s.emails[u.Email] = u
	return nil
}

func (s *UserStore) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	u, ok := s.users[id]
	if !ok {
		return fmt.Errorf("user %q not found", id)
	}
	delete(s.emails, u.Email)
	delete(s.users, id)
	return nil
}