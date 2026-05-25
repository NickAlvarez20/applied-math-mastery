package middleware

import (
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
)

type window struct {
	mu       sync.Mutex
	requests []time.Time
}

var (
	windows   = map[string]*window{}
	windowsMu sync.Mutex
)

func clientIP(c *fiber.Ctx) string {
	if xff := c.Get("X-Forwarded-For"); xff != "" {
		return strings.TrimSpace(strings.Split(xff, ",")[0])
	}
	if xri := c.Get("X-Real-IP"); xri != "" {
		return strings.TrimSpace(xri)
	}
	return c.IP()
}

func rateLimitHandler(bucket string, limit int, duration time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		key := bucket + ":" + clientIP(c)
		windowsMu.Lock()
		w, ok := windows[key]
		if !ok {
			w = &window{}
			windows[key] = w
		}
		windowsMu.Unlock()

		w.mu.Lock()
		defer w.mu.Unlock()
		now := time.Now()
		cutoff := now.Add(-duration)
		valid := w.requests[:0]
		for _, t := range w.requests {
			if t.After(cutoff) {
				valid = append(valid, t)
			}
		}
		w.requests = valid
		if len(w.requests) >= limit {
			return c.Status(fiber.StatusTooManyRequests).JSON(fiber.Map{
				"error": "rate limit exceeded",
			})
		}
		w.requests = append(w.requests, now)
		return c.Next()
	}
}

// RateLimit applies a per-IP sliding window (in-memory; per serverless instance).
func RateLimit(limit int, duration time.Duration) fiber.Handler {
	return rateLimitHandler("global", limit, duration)
}

// StrictRateLimit is for sensitive routes (login, register).
func StrictRateLimit(limit int, duration time.Duration) fiber.Handler {
	return rateLimitHandler("auth", limit, duration)
}
