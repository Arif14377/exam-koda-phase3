package service

import (
	"errors"
	"fmt"
	"log"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/Arif14377/exam-koda-phase3/internal/repository"
	"github.com/Arif14377/exam-koda-phase3/internal/utils"
	"github.com/google/uuid"
)

type LinkService struct {
	linkRepo *repository.LinksRepo
}

func NewLinkService(linkRepo *repository.LinksRepo) *LinkService {
	return &LinkService{
		linkRepo: linkRepo,
	}
}

func (l *LinkService) CreateShortLink(data models.RequestLinks) error {
	// jika data.OriginalURL atau data.UserId kosong, kembalikan error
	if data.OriginalURL == "" || data.UserId == uuid.Nil {
		return errors.New("Data cannot be empty.")
	}

	// cek apakah slug kosong? jika kosong, generate slug acak + panggil repository
	if data.Slug == "" {
		randomLinks, err := utils.GenerateRandomLinks(6)
		if err != nil {
			log.Printf("Failed to generate random short links.")
			return err
		}

		data.Slug = randomLinks
		err = l.linkRepo.CreateShortLink(data)
		if err != nil {
			log.Printf("Failed to save slug into database.")
			return err
		}
	}

	// slug ada isinya, cek apakah slug < 3 || slug > 50, jika ya kembalikan error.
	if len(data.Slug) < 3 || len(data.Slug) > 50 {
		return errors.New("Url slug length must be greater than 2 or less than 51.")
	}

	// Cek apakah mengandung kata pada slug custom reserved
	wordReserverd := utils.WordReserved(data.Slug)
	if wordReserverd {
		return fmt.Errorf("The word %s has been reserved", data.Slug)
	}

	// panggil repository
	err := l.linkRepo.CreateShortLink(data)
	if err != nil {
		return err
	}
	return nil
}

func (l *LinkService) GetUserLinks(userId uuid.UUID) ([]models.GetLinks, error) {
	// Validasi userId tidak boleh kosong
	if userId == uuid.Nil {
		return nil, errors.New("User ID cannot be empty.")
	}

	// Panggil repository untuk get user links
	links, err := l.linkRepo.GetUserLinks(userId)
	if err != nil {
		log.Printf("Failed to get user links from database.")
		return nil, err
	}

	return links, nil
}

func (l *LinkService) DeleteUserLinks(userId uuid.UUID, originalURL string) error {
	// Validasi userId dan originalURL tidak boleh kosong
	if userId == uuid.Nil || originalURL == "" {
		return errors.New("User ID and Original URL cannot be empty.")
	}

	// Panggil repository untuk delete user link
	err := l.linkRepo.DeleteUserLinks(userId, originalURL)
	if err != nil {
		log.Printf("Failed to delete user link from database.")
		return err
	}

	return nil
}
