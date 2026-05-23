package main

import (
    "log"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
    app := fiber.New()

    app.Use(cors.New(cors.Config{
        AllowOrigins: "http://localhost:5173",
        AllowHeaders: "Origin, Content-Type, Authorization",
    }))

    // Health check — confirms the server is running
    app.Get("/api/v1/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"status": "ok", "app": "MathForge"})
    })

    log.Fatal(app.Listen(":4000"))
}