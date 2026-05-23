package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	JWTSecret      string
	AllowedOrigins string
	DataPath       string
}

var instance *Config

// Load reads .env once and caches the result.
func Load() *Config {
	if instance != nil {
		return instance
	}
	// Only load .env in development — production uses real env vars
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("no .env file found, reading from environment")
	}
	instance = &Config{
		Port:           getEnv("PORT", "4000"),
		JWTSecret:      getEnv("JWT_SECRET", "change-me"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:5173"),
		DataPath:       getEnv("DATA_PATH", "./data"),
	}
	return instance
}

// Get returns the cached config — call Load() first.
func Get() *Config {
	if instance == nil {
		return Load()
	}
	return instance
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}