package models

import "time"

type Role string

const (
	RoleStudent Role = "student"
	RoleAdmin   Role = "admin"
)

type User struct {
	ID           string    `json:"id"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // never serialised to JSON
	AvatarURL    string    `json:"avatarUrl,omitempty"`
	Role         Role      `json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
}

// SafeUser is what we return to the client — no password hash.
type SafeUser struct {
	ID        string    `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	AvatarURL string    `json:"avatarUrl,omitempty"`
	Role      Role      `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
}

func (u *User) ToSafe() SafeUser {
	return SafeUser{
		ID:        u.ID,
		Username:  u.Username,
		Email:     u.Email,
		AvatarURL: u.AvatarURL,
		Role:      u.Role,
		CreatedAt: u.CreatedAt,
	}
}