package repository

import (
	"context"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthRepo struct {
	db *pgxpool.Pool
}

func NewAuthRepository(db *pgxpool.Pool) *AuthRepo {
	return &AuthRepo{
		db: db,
	}
}

// Register
func (a *AuthRepo) Register(user *models.AuthUser) error {
	sqlQuery := "INSERT INTO users(email, password) VALUES($1, $2)"
	_, err := a.db.Exec(context.Background(), sqlQuery, user.Email, user.Password)
	if err != nil {
		log.Printf("Error while registering user: \n%v", err)
		return err
	}
	return nil
}

// Login
func (a *AuthRepo) Login(email string, password string) error {
	return nil
}
