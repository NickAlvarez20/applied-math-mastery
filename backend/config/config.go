package config

import (
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
	// Local dev only — Vercel injects env vars at runtime
	if os.Getenv("VERCEL") == "" {
		_ = godotenv.Load("../.env")
		_ = godotenv.Load(".env")
	}
	instance = &Config{
		Port:           getEnv("PORT", "4000"),
		JWTSecret:      getEnv("JWT_SECRET", "change-me"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "http://localhost:5173"),
		DataPath:       getEnv("DATA_PATH", defaultDataPath()),
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

func defaultDataPath() string {
	if _, err := os.Stat("./data"); err == nil {
		return "./data"
	}
	return "data"
}