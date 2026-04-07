package models

import "github.com/google/uuid"

type RequestLinks struct {
	UserId      uuid.UUID `json:"user_id"`
	OriginalURL string    `json:"original_url"`
	Slug        string    `json:"slug"`
}
