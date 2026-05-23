package services

import (
	"fmt"
	"time"
	"crypto/rand"
	"encoding/hex"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"mathforge/internals/models"
	"mathforge/internals/store"
)

type Claims struct {
	UserID string      `json:"userId"`
	Role   models.Role `json:"role"`
	jwt.RegisteredClaims
}

type AuthService struct {
	users     store.UserRepository
	jwtSecret []byte
}

func NewAuthService(users store.UserRepository, secret string) *AuthService {
	return &AuthService{users: users, jwtSecret: []byte(secret)}
}

func (s *AuthService) Register(username, email, password string) (*models.SafeUser, string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", fmt.Errorf("hashing password: %w", err)
	}
	id, _ := generateID()
	user := &models.User{
		ID:           id,
		Username:     username,
		Email:        email,
		PasswordHash: string(hash),
		Role:         models.RoleStudent,
		CreatedAt:    time.Now(),
	}
	if err := s.users.Create(user); err != nil {
		return nil, "", err
	}
	token, err := s.issueToken(user)
	if err != nil {
		return nil, "", err
	}
	safe := user.ToSafe()
	return &safe, token, nil
}

func (s *AuthService) Login(email, password string) (*models.SafeUser, string, error) {
	user, err := s.users.FindByEmail(email)
	if err != nil {
		return nil, "", fmt.Errorf("invalid credentials")
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, "", fmt.Errorf("invalid credentials")
	}
	token, err := s.issueToken(user)
	if err != nil {
		return nil, "", err
	}
	safe := user.ToSafe()
	return &safe, token, nil
}

func (s *AuthService) ValidateToken(tokenStr string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return s.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	return claims, nil
}

func (s *AuthService) issueToken(user *models.User) (string, error) {
	claims := Claims{
		UserID: user.ID,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.jwtSecret)
}

func generateID() (string, error) {
	b := make([]byte, 8)
	rand.Read(b)
	return hex.EncodeToString(b), nil
}