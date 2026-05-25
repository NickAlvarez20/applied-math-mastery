# Deploy MathForge on Vercel

## Architecture

- **Frontend**: Vite static app at `/` (`frontend/dist`)
- **Backend**: Go serverless function (`backend/handler.go`) — all `/api/*` routes
- **No database** — users, progress, and leaderboard live in RAM per instance

## Vercel project settings

1. Deploy from the **repo root** (where `vercel.json` lives). Framework preset can stay **Other** or **Vite**; routing is defined in `vercel.json`.
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
