package repository

import (
	"context"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
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
