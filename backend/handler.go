package handler

import (
	"net/http"

	"github.com/gofiber/adaptor/v2"
	"mathforge/bootstrap"
)

// Handler is the Vercel serverless entrypoint (see vercel.json routes).
func Handler(w http.ResponseWriter, r *http.Request) {
	adaptor.FiberApp(bootstrap.App()).ServeHTTP(w, r)
}
