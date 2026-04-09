package models

import (
	"time"

	"github.com/google/uuid"
)

type Users struct {
	Id         uuid.UUID `json:"id"`
	Email      string    `json:"email"`
	Password   string    `json:"password"`
	Created_At time.Time `json:"created_at"`
}

// DTO
type AuthUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterUser struct {
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
}

type UserEmail struct {
	Email string `json:"string"`
}

type UserLogin struct {
	Id       uuid.UUID `json:"id"`
	Email    string    `json:"email"`
	Password string    `json:"password" db:"password_hash"`
}

type UserSession struct {
	Id    uuid.UUID `json:"id"`
	Email string    `json:"email"`
}

type UserProfile struct {
	Id          uuid.UUID `json:"id" db:"id"`
	FullName    string    `json:"full_name"`
	Occupation  string    `json:"occupation"`
	BadgePro    bool      `json:"badge_pro"`
	Email       string    `json:"email"`
	CreatedAt   time.Time `json:"created_at"`
	UserImage   string    `json:"user_image"`
	ActiveLinks int       `json:"active_links"`
}
