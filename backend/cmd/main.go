package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Arif14377/exam-koda-phase3/internal/di"
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

	auth := router.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
	}

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
