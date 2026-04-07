package repository

import (
	"context"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LinksRepo struct {
	db *pgxpool.Pool
}

func NewLinksRepository(db *pgxpool.Pool) *LinksRepo {
	return &LinksRepo{
		db: db,
	}
}

func (l *LinksRepo) CreateShortLink(data models.RequestLinks) error {
	querySql := "INSERT INTO links (user_id, original_url, slug) VALUES ($1, $2, $3) ON CONFLICT (user_id, original_url) DO UPDATE SET slug = EXCLUDED.slug"
	_, err := l.db.Exec(context.Background(), querySql, data.UserId, data.OriginalURL, data.Slug)
	if err != nil {
		log.Printf("Failed to execute query: \n%v.", err)
		return err
	}

	return nil
}
