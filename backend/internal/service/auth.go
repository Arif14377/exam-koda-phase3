package service

import (
	"errors"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/Arif14377/exam-koda-phase3/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"github.com/matthewhartstonge/argon2"
)

type AuthService struct {
	authRepo *repository.AuthRepo
	userRepo *repository.UserRepo
}

func NewAuthService(authRepo *repository.AuthRepo, userRepo *repository.UserRepo) *AuthService {
	return &AuthService{
		authRepo: authRepo,
		userRepo: userRepo,
	}
}

// Register
func (a *AuthService) Register(user models.AuthUser) error {
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

// Login
func (a *AuthService) Login(user models.AuthUser) (*models.UserLogin, string, error) {
	var userLogin *models.UserLogin
	// Cek format email
	if !strings.Contains(user.Email, "@") {
		err := errors.New("Wrong email or password.")
		return nil, "", err
	}

	// Cek email dan password tidak boleh kosong
	if user.Email == "" || user.Password == "" {
		err := errors.New("Wrong email or password.")
		return nil, "", err
	}

	// Cek database
	userLogin, err := a.authRepo.Login(user)
	if err != nil {
		return nil, "", err
	}

	// Buat token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    userLogin.Id.String(),
		"email": userLogin.Email,
		"exp":   time.Now().Add(time.Minute * 15).Unix(),
	})

	secret := os.Getenv("JWT_SECRET")

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Printf("Failed to convert token into string: \n%v", err)
		return nil, "", err
	}

	// Return
	return userLogin, tokenString, nil
}
