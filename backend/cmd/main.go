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

	router.Use(middleware.Cors())

	err := godotenv.Load()
	if err != nil {
		log.Printf(".env file not found. Using environment variable: \n%v", err)
	}

	container := di.NewContainer()

	authHandler := container.AuthHandler()
	linkHandler := container.LinkHandler()
	userHandler := container.UserHandler()

	api := router.Group("/api")
	{
		api.POST("/register", authHandler.Register)
		api.POST("/login", authHandler.Login)
	}

	links := router.Group("/api/links")
	links.Use(middleware.AuthMiddleware())
	{
		links.POST("", linkHandler.CreateShortLink)
		links.GET("", linkHandler.GetUserLinks)
		links.DELETE("/:id", linkHandler.DeleteUserLinks)
	}

	profile := router.Group("/api/profile")
	profile.Use(middleware.AuthMiddleware())
	{
		profile.GET("", userHandler.GetProfile)
	}

	router.GET("/:slug", linkHandler.RedirectURL)

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
