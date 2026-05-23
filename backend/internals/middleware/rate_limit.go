package middleware

import (
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

func RateLimit(limit int, duration time.Duration) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ip := c.IP()
		windowsMu.Lock()
		w, ok := windows[ip]
		if !ok {
			w = &window{}
			windows[ip] = w
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