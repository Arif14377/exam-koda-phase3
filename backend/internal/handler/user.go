package handler

import (
	"errors"
	"log"
	"net/http"

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
