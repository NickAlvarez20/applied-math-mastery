package main

import (
	"log"
	"time"
	"github.com/gofiber/fiber/v2"
	"mathforge/config"
	"mathforge/internals/controllers"
	"mathforge/internals/middleware"
	"mathforge/internals/router"
	"mathforge/internals/services"
	jsonstore "mathforge/internals/store/json"
	memstore  "mathforge/internals/store/memory"
)

func main() {
	cfg := config.Load()

	// ── Stores ──────────────────────────────────────────────────────────────
	subjectRepo  := jsonstore.NewSubjectStore(cfg.DataPath)
	userRepo     := memstore.NewUserStore()
	progressRepo := memstore.NewProgressStore()
	leaderRepo   := memstore.NewLeaderboardStore()

	// ── Services ─────────────────────────────────────────────────────────────
	authSvc      := services.NewAuthService(userRepo, cfg.JWTSecret)
	subjectSvc   := services.NewSubjectService(subjectRepo)
	progressSvc  := services.NewProgressService(progressRepo, leaderRepo)
	leaderSvc    := services.NewLeaderboardService(leaderRepo)

	// ── Controllers ──────────────────────────────────────────────────────────
	authCtrl     := controllers.NewAuthController(authSvc)
	subjectCtrl  := controllers.NewSubjectController(subjectSvc)
	progressCtrl := controllers.NewProgressController(progressSvc)
	leaderCtrl   := controllers.NewLeaderboardController(leaderSvc)

	// ── App ───────────────────────────────────────────────────────────────────
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusInternalServerError).JSON(
				fiber.Map{"error": err.Error()},
			)
		},
	})

	// Global middleware — order matters
	app.Use(middleware.Logger())
	app.Use(middleware.CORS(cfg.AllowedOrigins))
	app.Use(middleware.RateLimit(100, time.Minute))

	// Routes
	router.Setup(app, authCtrl, subjectCtrl, progressCtrl, leaderCtrl)

	log.Printf("MathForge backend listening on :%s", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}