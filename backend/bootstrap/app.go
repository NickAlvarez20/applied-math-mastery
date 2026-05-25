package bootstrap

import (
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	appdata "mathforge/data"
	"mathforge/config"
	"mathforge/internals/controllers"
	"mathforge/internals/middleware"
	"mathforge/internals/router"
	"mathforge/internals/services"
	jsonstore "mathforge/internals/store/json"
	memstore "mathforge/internals/store/memory"
)

var (
	once sync.Once
	app  *fiber.App
)

// App returns a singleton Fiber app (reused across warm serverless invocations).
func App() *fiber.App {
	once.Do(func() {
		app = build()
	})
	return app
}

func build() *fiber.App {
	cfg := config.Load()

	subjectRepo := jsonstore.NewSubjectStoreFromFS(appdata.FS, ".")
	if !subjectRepo.Loaded() {
		subjectRepo = jsonstore.NewSubjectStore(cfg.DataPath)
	}
	userRepo := memstore.NewUserStore()
	progressRepo := memstore.NewProgressStore()
	leaderRepo := memstore.NewLeaderboardStore()

	authSvc := services.NewAuthService(userRepo, cfg.JWTSecret)
	subjectSvc := services.NewSubjectService(subjectRepo)
	progressSvc := services.NewProgressService(progressRepo, leaderRepo, userRepo)
	leaderSvc := services.NewLeaderboardService(leaderRepo)
	pathSvc := services.NewLearningPathService(progressRepo, subjectRepo)
	exerciseSvc := services.NewExerciseService(subjectRepo, progressRepo, pathSvc)

	authCtrl := controllers.NewAuthController(authSvc)
	subjectCtrl := controllers.NewSubjectController(subjectSvc)
	progressCtrl := controllers.NewProgressController(progressSvc)
	exerciseCtrl := controllers.NewExerciseController(exerciseSvc)
	leaderCtrl := controllers.NewLeaderboardController(leaderSvc)

	f := fiber.New(fiber.Config{
		ProxyHeader:             fiber.HeaderXForwardedFor,
		EnableTrustedProxyCheck: true,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusInternalServerError).JSON(
				fiber.Map{"error": err.Error()},
			)
		},
	})

	f.Use(middleware.NormalizeAPIPrefix())
	f.Use(middleware.Logger())
	f.Use(middleware.CORS(cfg.AllowedOrigins))
	// Global limit — in-memory per instance; resets on cold start (no external store).
	f.Use(middleware.RateLimit(60, time.Minute))

	router.Setup(f, authCtrl, subjectCtrl, progressCtrl, exerciseCtrl, leaderCtrl)
	return f
}
