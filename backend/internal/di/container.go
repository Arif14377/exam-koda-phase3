package di

import (
	"context"
	"log"
	"os"

	"github.com/Arif14377/exam-koda-phase3/internal/handler"
	"github.com/Arif14377/exam-koda-phase3/internal/repository"
	"github.com/Arif14377/exam-koda-phase3/internal/service"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type Container struct {
	db *pgxpool.Pool
	redis *redis.Client

	authRepo    *repository.AuthRepo
	authService *service.AuthService
	authHandler *handler.AuthHandler

	userRepo *repository.UserRepo
	userService *service.UserService
	userHandler *handler.UserHandler

	linkRepo    *repository.LinksRepo
	linkService *service.LinkService
	linkHandler *handler.LinkHandler
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
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr != "" {
		c.redis = redis.NewClient(&redis.Options{
			Addr:     redisAddr,
			Password: os.Getenv("REDIS_PASSWORD"),
			DB:       0,
		})
	}

	c.userRepo = repository.NewUserRepository(c.db)
	c.authRepo = repository.NewAuthRepository(c.db)
	c.authService = service.NewAuthService(c.authRepo, c.userRepo)
	c.authHandler = handler.NewAuthHandler(c.authService)

	c.userService = service.NewUserService(c.userRepo)
	c.userHandler = handler.NewUserHandler(c.userService)

	c.linkRepo = repository.NewLinksRepository(c.db, c.redis)
	c.linkService = service.NewLinkService(c.linkRepo)
	c.linkHandler = handler.NewLinkHandler(c.linkService)
}

func (c *Container) AuthHandler() *handler.AuthHandler {
	return c.authHandler
}

func (c *Container) LinkHandler() *handler.LinkHandler {
	return c.linkHandler
}

func (c *Container) UserHandler() *handler.UserHandler {
	return c.userHandler
}
