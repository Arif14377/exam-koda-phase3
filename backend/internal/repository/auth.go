package repository

import (
	"context"
	"errors"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/matthewhartstonge/argon2"
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
func (a *AuthRepo) Register(user models.AuthUser) error {
	sqlQuery := "INSERT INTO users(email, password_hash) VALUES($1, $2)"
	_, err := a.db.Exec(context.Background(), sqlQuery, user.Email, user.Password)
	if err != nil {
		log.Printf("Error while registering user: \n%v", err)
		return err
	}
	return nil
}

// Login
func (a *AuthRepo) Login(user models.AuthUser) (*models.UserLogin, error) {
	// dapatkan data user dengan email di database
	sqlQuery := "SELECT id, email, password_hash FROM users WHERE email = $1"
	rows, err := a.db.Query(context.Background(), sqlQuery, user.Email)
	if err != nil {
		log.Printf("Failed to get rows data: \n%v", err)
		return &models.UserLogin{}, err
	}
	defer rows.Close()

	userLogin, err := pgx.CollectOneRow(rows, pgx.RowToStructByNameLax[models.UserLogin])
	if err != nil {
		log.Printf("User not found: \n%v", err)
		return &models.UserLogin{}, err
	}

	// cek password hash
	pwdOk, err := argon2.VerifyEncoded([]byte(user.Password), []byte(userLogin.Password))
	if !pwdOk {
		if err == nil {
			err = errors.New("password not match")
		}
		log.Printf("Password not match: \n%v", err)
		return &models.UserLogin{}, err
	}

	// kembalikan UserLogin (id dan email) + nil
	return &userLogin, nil
}
