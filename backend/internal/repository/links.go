package repository

import (
	"context"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
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

func (l *LinksRepo) GetUserLinks(userId uuid.UUID) ([]models.GetLinks, error) {
	querySql := "SELECT original_url, slug FROM links WHERE user_id = $1"
	rows, err := l.db.Query(context.Background(), querySql, userId)
	if err != nil {
		log.Printf("Failed to execute query: \n%v.", err)
		return nil, err
	}
	defer rows.Close()

	links, err := pgx.CollectRows(rows, pgx.RowToStructByNameLax[models.GetLinks])
	if err != nil {
		log.Printf("Failed to collect rows: \n%v.", err)
		return nil, err
	}

	return links, nil
}

func (l *LinksRepo) DeleteUserLinks(userId uuid.UUID, linkId int) error {
	querySql := "UPDATE links SET is_deleted = true WHERE user_id = $1 AND id = $2"
	_, err := l.db.Exec(context.Background(), querySql, userId, linkId)
	if err != nil {
		log.Printf("Failed to execute query: \n%v.", err)
		return err
	}

	return nil
}