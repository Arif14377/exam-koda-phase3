package repository

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type LinksRepo struct {
	db    *pgxpool.Pool
	cache *redis.Client
}

func NewLinksRepository(db *pgxpool.Pool, cache *redis.Client) *LinksRepo {
	return &LinksRepo{
		db:    db,
		cache: cache,
	}
}

func (l *LinksRepo) CreateShortLink(data models.RequestLinks) (string, error) {
	querySql := "INSERT INTO links (user_id, original_url, slug) VALUES ($1, $2, $3) ON CONFLICT (user_id, original_url) DO UPDATE SET slug = EXCLUDED.slug, is_deleted = false"
	_, err := l.db.Exec(context.Background(), querySql, data.UserId, data.OriginalURL, data.Slug)
	if err != nil {
		log.Printf("Failed to execute query: \n%v.", err)
		return "", err
	}

	l.invalidateUserLinksCache(data.UserId)
	return data.Slug, nil
}

func (l *LinksRepo) GetUserLinks(userId uuid.UUID) ([]models.GetLinks, error) {
	cacheKey := l.userLinksCacheKey(userId)
	if l.cache != nil {
		cached, err := l.cache.Get(context.Background(), cacheKey).Result()
		if err == nil && cached != "" {
			var links []models.GetLinks
			if err := json.Unmarshal([]byte(cached), &links); err == nil {
				return links, nil
			}
		}
	}

	querySql := "SELECT id, original_url, slug, created_at FROM links WHERE user_id = $1 AND is_deleted = false"
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

	if l.cache != nil {
		if payload, err := json.Marshal(links); err == nil {
			_ = l.cache.Set(context.Background(), cacheKey, payload, 5*time.Minute).Err()
		}
	}

	return links, nil
}

func (l *LinksRepo) DeleteUserLinks(userId uuid.UUID, linkId int) error {
	querySql := "UPDATE links SET is_deleted = true WHERE user_id = $1 AND id = $2"
	commandTag, err := l.db.Exec(context.Background(), querySql, userId, linkId)
	if err != nil {
		log.Printf("Failed to execute query: \n%v.", err)
		return err
	}

	if commandTag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}

	l.invalidateUserLinksCache(userId)
	return nil
}

func (l *LinksRepo) GetLinkBySlug(slug string) (string, error) {
	querySql := "SELECT original_url FROM links WHERE slug = $1 AND is_deleted = false"
	rows, err := l.db.Query(context.Background(), querySql, slug)
	if err != nil {
		log.Printf("Failed to get rows data: \n%v", err)
		return "", err
	}

	result, err := pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[models.RedirectLinks])
	if err != nil {
		log.Printf("Failed to query link by slug: \n%v.", err)
		return "", err
	}

	return result.OriginalURL, nil
}

func (l *LinksRepo) userLinksCacheKey(userId uuid.UUID) string {
	return "user_links:" + userId.String()
}

func (l *LinksRepo) invalidateUserLinksCache(userId uuid.UUID) {
	if l.cache == nil {
		return
	}
	_ = l.cache.Del(context.Background(), l.userLinksCacheKey(userId)).Err()
}
