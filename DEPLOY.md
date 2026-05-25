# Deploy MathForge on Vercel

## Architecture

- **Frontend**: Vite static app at `/`
- **Backend**: Go serverless service at `/api` (in-memory stores; resets on cold start)
- **No database** — users, progress, and leaderboard live in RAM per instance

## Vercel project settings

1. Set the project **Framework Preset** to **Services** (required for `experimentalServices`).
2. Add environment variables:

| Variable | Example | Required |
|----------|---------|----------|
| `JWT_SECRET` | long random string | Yes |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Yes (comma-separated for multiple) |
| `DATA_PATH` | `./data` | Optional (default resolves `data/`) |

3. Deploy from the repo root (where `vercel.json` lives).

## Local development

```bash
# Terminal 1 — API
cd backend && go run .

# Terminal 2 — UI (proxies /api → :4000)
cd frontend && npm run dev
```

## Rate limits (in-memory)

- **Global**: 60 requests / minute / IP
- **Auth** (login/register): 8–12 requests / minute / IP (separate bucket)

Limits apply per serverless instance, not globally across regions.
