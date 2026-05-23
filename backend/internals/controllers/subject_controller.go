package controllers

import (
	"github.com/gofiber/fiber/v2"
	"mathforge/internals/services"
)

type SubjectController struct {
	svc *services.SubjectService
}

func NewSubjectController(svc *services.SubjectService) *SubjectController {
	return &SubjectController{svc: svc}
}

func (ctrl *SubjectController) ListSubjects(c *fiber.Ctx) error {
	subjects, err := ctrl.svc.ListAll()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "could not load subjects"})
	}
	return c.JSON(fiber.Map{"data": subjects, "count": len(subjects)})
}

func (ctrl *SubjectController) GetSubject(c *fiber.Ctx) error {
	sub, err := ctrl.svc.GetByID(c.Params("id"))
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": sub})
}

func (ctrl *SubjectController) ListTopics(c *fiber.Ctx) error {
	topics, err := ctrl.svc.GetTopics(c.Params("id"))
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": topics, "count": len(topics)})
}

func (ctrl *SubjectController) GetTopic(c *fiber.Ctx) error {
	topic, err := ctrl.svc.GetTopic(c.Params("topicId"))
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": topic})
}