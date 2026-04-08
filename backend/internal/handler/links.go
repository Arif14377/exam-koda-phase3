package handler

import (
	"log"
	"net/http"
	"strconv"

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

	// Panggil service
	slug, err := l.linkService.CreateShortLink(data)
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
		Results: gin.H{
			"slug": slug,
		},
	})
}

func (l *LinkHandler) GetUserLinks(c *gin.Context) {
	// ambil user_id dari context, jika kosong kembalikan 401
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

	// Panggil service
	links, err := l.linkService.GetUserLinks(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Something wrong",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Successfully get links.",
		Results: links,
	})
}

func (l *LinkHandler) DeleteUserLinks(c *gin.Context) {
	// ambil user_id dari context, jika kosong kembalikan 401
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

	// ambil link_id dari URL parameter
	linkIdString := c.Param("id")
	if linkIdString == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Message: "Link ID is required",
		})
		return
	}

	linkId, err := strconv.Atoi(linkIdString)
	if err != nil || linkId <= 0 {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Message: "Invalid Link ID",
		})
		return
	}

	// Panggil service
	err = l.linkService.DeleteUserLinks(userId, linkId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response{
			Success: false,
			Message: "Something wrong",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response{
		Success: true,
		Message: "Link deleted successfully.",
	})
}

func (l *LinkHandler) RedirectURL(c *gin.Context) {
	// ambil slug dari URL parameter
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, models.Response{
			Success: false,
			Message: "Slug is required",
		})
		return
	}

	// Panggil service
	originalURL, err := l.linkService.GetLinkBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, models.Response{
			Success: false,
			Message: "Link not found",
		})
		return
	}

	// Redirect ke original URL
	c.Redirect(http.StatusMovedPermanently, originalURL)
}
