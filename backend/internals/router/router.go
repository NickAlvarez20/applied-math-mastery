package router

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"mathforge/internals/controllers"
	"mathforge/internals/middleware"
)

func Setup(
	app          *fiber.App,
	authCtrl     *controllers.AuthController,
	subjectCtrl  *controllers.SubjectController,
	progressCtrl *controllers.ProgressController,
	exerciseCtrl *controllers.ExerciseController,
	leaderCtrl   *controllers.LeaderboardController,
) {
	api := app.Group("/api/v1")

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "app": "MathForge"})
	})

	// Auth (stricter rate limit on credential endpoints)
	auth := api.Group("/auth")
	auth.Post("/register", middleware.StrictRateLimit(8, time.Minute), authCtrl.Register)
	auth.Post("/login", middleware.StrictRateLimit(12, time.Minute), authCtrl.Login)
	auth.Post("/refresh",  authCtrl.RefreshToken)
	auth.Delete("/logout", middleware.RequireAuth, authCtrl.Logout)

	// Subjects (public) — register with and without trailing slash
	api.Get("/subjects", subjectCtrl.ListSubjects)
	subjects := api.Group("/subjects")
	subjects.Get("/",                subjectCtrl.ListSubjects)
	subjects.Get("/topics/:topicId", subjectCtrl.GetTopic)
	subjects.Get("/:id",             subjectCtrl.GetSubject)
	subjects.Get("/:id/topics",      subjectCtrl.ListTopics)

	// Progress (protected)
	progress := api.Group("/progress", middleware.RequireAuth)
	progress.Get("/me",           progressCtrl.GetMyProgress)
	progress.Post("/submit",      progressCtrl.SubmitAnswer)
	progress.Get("/streak",       progressCtrl.GetStreak)
	progress.Post("/daily-claim", progressCtrl.ClaimDailyReward)

	// Exercises (protected)
	exercises := api.Group("/exercises", middleware.RequireAuth)
	exercises.Get("/next/:topicId",            exerciseCtrl.GetNextExercise)
	exercises.Get("/recommended/:subjectId",   exerciseCtrl.GetRecommended)
	exercises.Post("/submit",                  exerciseCtrl.SubmitExercise)
	exercises.Get("/history",                  exerciseCtrl.GetHistory)

	// Achievements (protected)
	api.Get("/achievements", middleware.RequireAuth, progressCtrl.GetAchievements)

	// Leaderboard (public)
	leaderboard := api.Group("/leaderboard")
	leaderboard.Get("/global", leaderCtrl.GlobalBoard)
	leaderboard.Get("/weekly", leaderCtrl.WeeklyBoard)
	leaderboard.Get("/me",     middleware.RequireAuth, leaderCtrl.MyRank)
}