package data

import "embed"

// Seed content bundled into the binary for Vercel serverless (no reliance on cwd).
//
//go:embed subjects.json exercises.json topics_*.json
var FS embed.FS
