package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gofiber/adaptor/v2"
	"mathforge/bootstrap"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	handler := adaptor.FiberApp(bootstrap.App())
	log.Printf("MathForge backend listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
