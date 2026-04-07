package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Arif14377/exam-koda-phase3/internal/di"
	"github.com/Arif14377/exam-koda-phase3/internal/middleware"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	router := gin.Default()

	err := godotenv.Load()
	if err != nil {
		log.Printf(".env file not found. Using environment variable: \n%v", err)
	}

	container := di.NewContainer()

	authHandler := container.AuthHandler()
	linksHandler := container.LinksHandler()

	api := router.Group("/api")
	{
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)
	}

	links := router.Group("/api/links")
	links.Use(middleware.AuthMiddleware())
	{
		links.POST("", linksHandler.CreateShortLink)
		links.GET("/", linksHandler.GetUserLinks)
		links.DELETE("/:id", linksHandler.GetUserLinks)
	}

	router.GET("/:slug", linksHandler.RedirectURL)

	// router.GET("/ping", func(c *gin.Context) {
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"success": true,
	// 		"message": "Pong",
	// 	})
	// })

	err = router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
	if err != nil {
		log.Printf("failed to start server: \n%v", err)
		return
	}
}
