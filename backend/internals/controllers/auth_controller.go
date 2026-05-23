package controllers

import (
	"github.com/gofiber/fiber/v2"
	"mathforge/internals/services"
)

type AuthController struct {
	svc *services.AuthService
}

func NewAuthController(svc *services.AuthService) *AuthController {
	return &AuthController{svc: svc}
}

func (ctrl *AuthController) Register(c *fiber.Ctx) error {
	var body struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	if body.Username == "" || body.Email == "" || body.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "all fields required"})
	}
	user, token, err := ctrl.svc.Register(body.Username, body.Email, body.Password)
	if err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"data":  user,
		"token": token,
	})
}

func (ctrl *AuthController) Login(c *fiber.Ctx) error {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request body"})
	}
	user, token, err := ctrl.svc.Login(body.Email, body.Password)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "invalid credentials"})
	}
	return c.JSON(fiber.Map{"data": user, "token": token})
}

func (ctrl *AuthController) Logout(c *fiber.Ctx) error {
	// With stateless JWT, logout is handled client-side.
	// In production you'd maintain a token blacklist here.
	return c.JSON(fiber.Map{"message": "logged out"})
}

func (ctrl *AuthController) RefreshToken(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{"message": "refresh not yet implemented"})
}