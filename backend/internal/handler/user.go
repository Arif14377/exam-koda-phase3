package handler

import (
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/Arif14377/exam-koda-phase3/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

func (u *UserHandler) GetProfile(c *gin.Context) {
	userIdString := c.GetString("userId")
	if userIdString == "" {
		log.Printf("Empty user ID in context")
		c.JSON(http.StatusUnauthorized, models.Response{
			Success: false,
			Message: "Unauthorized access.",
		})
		return
	}

	userId, err := uuid.Parse(userIdString)
	if err != nil {
		log.Printf("Failed to parse string into uuid: \n%v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Failed to parse uuid from string into uuid type.",
		})
		return
	}

	profile, err := u.userService.GetUserProfile(userId)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, models.Response{
				Success: false,
				Message: "User not found.",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Failed to get user profile.",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully get profile.",
		Results: profile,
	})
}

func (u *UserHandler) UpdateProfile(c *gin.Context) {
	userIdString := c.GetString("userId")
	if userIdString == "" {
		log.Printf("Empty user ID in context")
		c.JSON(http.StatusUnauthorized, models.Response{
			Success: false,
			Message: "Unauthorized access.",
		})
		return
	}

	userId, err := uuid.Parse(userIdString)
	if err != nil {
		log.Printf("Failed to parse string into uuid: \n%v", err)
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Failed to parse uuid from string into uuid type.",
		})
		return
	}

	fullName := strings.TrimSpace(c.PostForm("full_name"))
	occupation := strings.TrimSpace(c.PostForm("occupation"))
	userImagePath := ""

	file, err := c.FormFile("user_image")
	if err == nil {
		const maxImageSize = 2 * 1024 * 1024
		if file.Size > maxImageSize {
			c.JSON(http.StatusBadRequest, models.Response{
				Success: false,
				Message: "Profile image size must be 2MB or less.",
			})
			return
		}

		uploadDir := "uploads"
		if err := os.MkdirAll(uploadDir, 0755); err != nil {
			log.Printf("Failed to create upload dir: \n%v", err)
			c.JSON(http.StatusInternalServerError, models.Response{
				Success: false,
				Message: "Failed to save profile image.",
			})
			return
		}

		ext := strings.ToLower(filepath.Ext(file.Filename))
		fileName := uuid.NewString() + ext
		dst := filepath.Join(uploadDir, fileName)

		if err := c.SaveUploadedFile(file, dst); err != nil {
			log.Printf("Failed to save uploaded file: \n%v", err)
			c.JSON(http.StatusInternalServerError, models.Response{
				Success: false,
				Message: "Failed to save profile image.",
			})
			return
		}

		userImagePath = "/uploads/" + fileName
	} else if !errors.Is(err, http.ErrMissingFile) {
		log.Printf("Failed to read uploaded file: \n%v", err)
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Message: "Invalid profile image.",
		})
		return
	}

	profile, err := u.userService.UpdateUserProfile(userId, fullName, occupation, userImagePath)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.JSON(http.StatusNotFound, models.Response{
				Success: false,
				Message: "User not found.",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Failed to update profile.",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Profile updated successfully.",
		Results: profile,
	})
}
