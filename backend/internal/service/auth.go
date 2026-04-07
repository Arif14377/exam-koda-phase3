package service

import (
	"fmt"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/Arif14377/exam-koda-phase3/internal/repository"
	"github.com/matthewhartstonge/argon2"
)

type AuthService struct {
	authRepo *repository.AuthRepo
	userRepo *repository.UserRepo
}

func NewAuthService(authRepo *repository.AuthRepo) *AuthService {
	return &AuthService{
		authRepo: authRepo,
	}
}

// Register
func (a *AuthService) Register(user *models.AuthUser) error {
	// Get user by email
	isRegistered := a.userRepo.GetUserByEmail(user.Email)
	if isRegistered {
		err := fmt.Errorf("Email is already registered.")
		return err
	}

	// hashing password
	argon := argon2.DefaultConfig()
	encoded, err := argon.HashEncoded([]byte(user.Password))
	if err != nil {
		log.Printf("Failed to hashing password: \n%v", err)
		return err
	}

	user.Password = string(encoded)

	// simpan ke database
	err = a.authRepo.Register(user)
	if err != nil {
		return err
	}

	return nil
}
