package controllers

import (
	"github.com/gofiber/fiber/v2"
	"mathforge/internals/services"
)

type ExerciseController struct {
	svc *services.ExerciseService
}

func NewExerciseController(svc *services.ExerciseService) *ExerciseController {
	return &ExerciseController{svc: svc}
}

// GetNextExercise returns the adaptive next exercise for a topic.
// GET /api/v1/exercises/next/:topicId
func (ctrl *ExerciseController) GetNextExercise(c *fiber.Ctx) error {
	userID  := c.Locals("userID").(string)
	topicID := c.Params("topicId")

	exercise, band, err := ctrl.svc.NextForTopic(userID, topicID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{
		"data":    exercise,
		"mastery": band,
	})
}

// SubmitExercise scores a submitted answer.
// POST /api/v1/exercises/submit
func (ctrl *ExerciseController) SubmitExercise(c *fiber.Ctx) error {
	var body struct {
		ExerciseID string `json:"exerciseId"`
		UserAnswer string `json:"userAnswer"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid request body",
		})
	}
	result, err := ctrl.svc.Submit(
		c.Locals("userID").(string),
		body.ExerciseID,
		body.UserAnswer,
	)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{"data": result})
}

// GetRecommended returns topics sorted by adaptive priority.
// GET /api/v1/exercises/recommended/:subjectId
func (ctrl *ExerciseController) GetRecommended(c *fiber.Ctx) error {
	topics, err := ctrl.svc.Recommended(
		c.Locals("userID").(string),
		c.Params("subjectId"),
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(fiber.Map{"data": topics, "count": len(topics)})
}

// GetHistory is a stub — extend once persistent history is added.
// GET /api/v1/exercises/history
func (ctrl *ExerciseController) GetHistory(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"data": []any{}})
}