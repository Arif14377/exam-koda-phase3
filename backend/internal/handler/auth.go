package handler

import (
	"log"
	"net/http"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/Arif14377/exam-koda-phase3/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	user := models.AuthUser{}
	err := c.ShouldBindJSON(&user)
	if err != nil {
		log.Printf("Invalid input: \n%v", err)
		c.JSON(http.StatusUnauthorized, models.Response{
			Success: false,
			Message: "Unauthorized",
		})
		return
	}

	err = h.authService.Register(user)
	if err != nil {
		log.Printf("Failed to register: \n%v", err)
		c.JSON(http.StatusUnauthorized, models.Response{
			Success: false,
			Message: "Incorrect email or password",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Registration successful.",
	})
}
