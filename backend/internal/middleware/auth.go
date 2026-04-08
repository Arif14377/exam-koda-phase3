package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/Arif14377/exam-koda-phase3/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip authorization untuk OPTIONS request (preflight CORS)
		if c.Request.Method == "OPTIONS" {
			c.Next()
			return
		}

		// ambil token dari header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, models.Response{
				Success: false,
				Message: "Authorization required.",
			})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, models.Response{
				Success: false,
				Message: "invalid token format.",
			})
			c.Abort()
			return
		}

		// validasi token
		tokenString := parts[1]
		secret := os.Getenv("JWT_SECRET")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, models.Response{
				Success: false,
				Message: "Token is invalid or expired.",
			})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, models.Response{
				Success: false,
				Message: "Failed to process claims token.",
			})
			c.Abort()
			return
		}

		userId := ""
		if val, exists := claims["id"]; exists {
			userId = val.(string)
		}

		// next
		c.Set("userId", userId)
		c.Set("userEmail", claims["email"])
		c.Next()

	}
}
