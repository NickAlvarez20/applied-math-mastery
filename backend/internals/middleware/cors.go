package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CORS(allowedOrigins string) fiber.Handler {
	allowed := parseOrigins(allowedOrigins)

	return cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			if origin == "" {
				return true
			}
			for _, o := range allowed {
				if o == origin {
					return true
				}
			}
			// Vercel preview + production deployments
			if strings.HasSuffix(origin, ".vercel.app") {
				return true
			}
			return false
		},
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS,PATCH",
		AllowHeaders: "Origin,Content-Type,Authorization",
	})
}

func parseOrigins(raw string) []string {
	var out []string
	for _, part := range strings.Split(raw, ",") {
		if o := strings.TrimSpace(part); o != "" {
			out = append(out, o)
		}
	}
	return out
}
