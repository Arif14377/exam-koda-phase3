package repository

import (
	"context"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepo struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepo {
	return &UserRepo{
		db: db,
	}
}

func (u *UserRepo) GetUserByEmail(email string) bool {
	sqlQuery := "SELECT email FROM users WHERE email = $1"
	rows, err := u.db.Query(context.Background(), sqlQuery, email)
	if err != nil {
		log.Printf("Failed to get rows data: \n%v", err)
		return false
	}
	defer rows.Close()

	_, err = pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[models.UserEmail])
	if err != nil {
		log.Printf("User not found: \n%v", err)
		return false
	}

	return true
}

func (u *UserRepo) GetUserProfile(userId uuid.UUID) (*models.UserProfile, error) {
	sqlQuery := `
		SELECT
			u.id,
			COALESCE(u.full_name, '') AS full_name,
			COALESCE(u.occupation, '') AS occupation,
			u.badge_pro,
			u.email,
			u.created_at,
			COALESCE(u.user_image, '') AS user_image,
			COALESCE(l.active_links, 0) AS active_links
		FROM users u
		LEFT JOIN (
			SELECT user_id, COUNT(*) AS active_links
			FROM links
			WHERE is_deleted = false
			GROUP BY user_id
		) l ON l.user_id = u.id
		WHERE u.id = $1
	`
	rows, err := u.db.Query(context.Background(), sqlQuery, userId)
	if err != nil {
		log.Printf("Failed to get user profile: \n%v", err)
		return nil, err
	}
	defer rows.Close()

	profile, err := pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[models.UserProfile])
	if err != nil {
		log.Printf("User profile not found: \n%v", err)
		return nil, err
	}

	return &profile, nil
}

func (u *UserRepo) UpdateUserProfile(userId uuid.UUID, fullName, occupation, userImage string) error {
	sqlQuery := `
		UPDATE users
		SET
			full_name = COALESCE(NULLIF($2, ''), full_name),
			occupation = COALESCE(NULLIF($3, ''), occupation),
			user_image = COALESCE(NULLIF($4, ''), user_image)
		WHERE id = $1
	`
	commandTag, err := u.db.Exec(context.Background(), sqlQuery, userId, fullName, occupation, userImage)
	if err != nil {
		log.Printf("Failed to update user profile: \n%v", err)
		return err
	}

	if commandTag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}

	return nil
}
