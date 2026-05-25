package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

// NormalizeAPIPrefix rewrites /v1/* → /api/v1/* when Vercel strips the /api routePrefix.
func NormalizeAPIPrefix() fiber.Handler {
	return func(c *fiber.Ctx) error {
		path := c.Path()
		if strings.HasPrefix(path, "/v1/") || path == "/v1" {
			c.Path("/api" + path)
		}
		return c.Next()
	}
}
