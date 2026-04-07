package handler

import (
	"log"
	"net/http"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/Arif14377/exam-koda-phase3/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type LinkHandler struct {
	linkService *service.LinkService
}

func NewLinkHandler(linkService *service.LinkService) *LinkHandler {
	return &LinkHandler{
		linkService: linkService,
	}
}

func (l *LinkHandler) CreateShortLink(c *gin.Context) {
	// ambil user_id dari context, jika kosong kembalikan 404
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
			Message: "Something wrong.",
		})
		return
	}

	// ambil OriginalURL dan Slug dari body
	var data models.RequestLinks
	err = c.ShouldBindJSON(&data)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Message: "Invalid request",
		})
		return
	}

	data.UserId = userId

	// Panggil repository
	err = l.linkService.CreateShortLink(data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Something wrong",
		})
		return
	}

	c.JSON(http.StatusCreated, models.Response{
		Success: true,
		Message: "Short link created.",
	})
}
