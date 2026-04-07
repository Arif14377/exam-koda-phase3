package di

import (
	"context"
	"log"
	"os"

	"github.com/Arif14377/exam-koda-phase3/internal/handler"
	"github.com/Arif14377/exam-koda-phase3/internal/repository"
	"github.com/Arif14377/exam-koda-phase3/internal/service"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Container struct {
	db *pgxpool.Pool

	authRepo    *repository.AuthRepo
	authService *service.AuthService
	authHandler *handler.AuthHandler

	userRepo *repository.UserRepo
}

func NewContainer() *Container {
	// koneksi db
	config, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URI"))
	if err != nil {
		log.Printf("Failed to parse database URL: \n%v", err)
		os.Exit(1)
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Printf("Failed to connect to database pool: \n%v", err)
		os.Exit(1)
	}

	container := Container{
		db: pool,
	}

	container.InitDependencies()

	return &container
}

func (c *Container) InitDependencies() {
	c.userRepo = repository.NewUserRepository(c.db)
	c.authRepo = repository.NewAuthRepository(c.db)
	c.authService = service.NewAuthService(c.authRepo, c.userRepo)
	c.authHandler = handler.NewAuthHandler(c.authService)
}

func (c *Container) AuthHandler() *handler.AuthHandler {
	return c.authHandler
}
