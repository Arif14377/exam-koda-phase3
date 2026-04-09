package models

import (
	"time"

	"github.com/google/uuid"
)

type RequestLinks struct {
	UserId      uuid.UUID `json:"user_id"`
	OriginalURL string    `json:"original_url"`
	Slug        string    `json:"slug"`
}

type GetLinks struct {
	ID          int       `json:"id" db:"id"`
	OriginalURL string    `json:"original_url"`
	Slug        string    `json:"slug"`
	CreatedAt   time.Time `json:"created_at"`
}

type DeleteLinks struct {
	LinkId int `json:"link_id"`
}

type RedirectLinks struct {
	OriginalURL string `db:"original_url"`
}
