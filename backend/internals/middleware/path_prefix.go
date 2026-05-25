package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

// NormalizeAPIPrefix maps service-internal paths to /api/v1 routes.
// Public /api/v1/* is rewritten to /_/backend/v1/*; Vercel strips the /_/backend prefix.
func NormalizeAPIPrefix() fiber.Handler {
	return func(c *fiber.Ctx) error {
		path := c.Path()

		if strings.HasPrefix(path, "/_/backend") {
			path = strings.TrimPrefix(path, "/_/backend")
			if path == "" {
				path = "/"
			}
		}

		if strings.HasPrefix(path, "/v1/") || path == "/v1" {
			path = "/api" + path
		}

		if path != c.Path() {
			c.Path(path)
		}
		return c.Next()
	}
}
