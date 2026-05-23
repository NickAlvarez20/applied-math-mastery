package controllers

import (
	"github.com/gofiber/fiber/v2"
	"mathforge/internals/services"
)

type ProgressController struct {
	svc *services.ProgressService
}

func NewProgressController(svc *services.ProgressService) *ProgressController {
	return &ProgressController{svc: svc}
}

func (ctrl *ProgressController) GetMyProgress(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	progress, err := ctrl.svc.GetAll(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "could not load progress"})
	}
	return c.JSON(fiber.Map{"data": progress})
}

func (ctrl *ProgressController) SubmitAnswer(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	var body struct {
		TopicID string `json:"topicId"`
		Score   int    `json:"score"`
		XP      int    `json:"xp"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid body"})
	}
	if err := ctrl.svc.Submit(userID, body.TopicID, body.Score, body.XP); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"message": "progress saved", "xpEarned": body.XP})
}

func (ctrl *ProgressController) GetStreak(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	streak, err := ctrl.svc.GetStreak(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": streak})
}

func (ctrl *ProgressController) ClaimDailyReward(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	xp, err := ctrl.svc.ClaimDaily(userID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"xpAwarded": xp})
}

func (ctrl *ProgressController) GetAchievements(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"data": []any{}})
}