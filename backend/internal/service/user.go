package service

import (
	"errors"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/Arif14377/exam-koda-phase3/internal/repository"
	"github.com/google/uuid"
)

type UserService struct {
	userRepo *repository.UserRepo
}

func NewUserService(userRepo *repository.UserRepo) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (u *UserService) GetUserProfile(userId uuid.UUID) (*models.UserProfile, error) {
	if userId == uuid.Nil {
		return nil, errors.New("User ID cannot be empty.")
	}

	profile, err := u.userRepo.GetUserProfile(userId)
	if err != nil {
		log.Printf("Failed to get user profile from database.")
		return nil, err
	}

	return profile, nil
}

func (u *UserService) UpdateUserProfile(userId uuid.UUID, fullName, occupation, userImage string) (*models.UserProfile, error) {
	if userId == uuid.Nil {
		return nil, errors.New("User ID cannot be empty.")
	}

	err := u.userRepo.UpdateUserProfile(userId, fullName, occupation, userImage)
	if err != nil {
		log.Printf("Failed to update user profile in database.")
		return nil, err
	}

	profile, err := u.userRepo.GetUserProfile(userId)
	if err != nil {
		log.Printf("Failed to get user profile after update.")
		return nil, err
	}

	return profile, nil
}
