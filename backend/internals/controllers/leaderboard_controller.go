package controllers

import (
	"github.com/gofiber/fiber/v2"
	"mathforge/internals/services"
)

type LeaderboardController struct {
	svc *services.LeaderboardService
}

func NewLeaderboardController(svc *services.LeaderboardService) *LeaderboardController {
	return &LeaderboardController{svc: svc}
}

func (ctrl *LeaderboardController) GlobalBoard(c *fiber.Ctx) error {
	entries, err := ctrl.svc.GetGlobal(100)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": entries})
}

func (ctrl *LeaderboardController) WeeklyBoard(c *fiber.Ctx) error {
	entries, err := ctrl.svc.GetWeekly(100)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": entries})
}

func (ctrl *LeaderboardController) MyRank(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	entry, err := ctrl.svc.GetRank(userID)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not ranked yet"})
	}
	return c.JSON(fiber.Map{"data": entry})
}