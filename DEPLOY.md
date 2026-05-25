# Deploy MathForge on Vercel

## Requirements

- Project **Framework Preset**: **Services**
- `experimentalServices` in root `vercel.json`
- Deploy from repo root

## Routing

| Service | `routePrefix` | Client calls |
|---------|---------------|--------------|
| frontend (Vite) | `/` | UI |
| backend (Go) | `/_/backend` | `/_/backend/v1/...` |

Do **not** call `/api/v1/...` in production — that path is not owned by the Go service and Vercel serves `index.html` (POST → 405).

The frontend uses `src/api/paths.ts` (`VITE_API_PREFIX=/_/backend` in `.env.production`).

## Environment variables (Vercel dashboard)

| Variable | Example |
|----------|---------|
| `JWT_SECRET` | long random string |
| `ALLOWED_ORIGINS` | `https://appliedmathmastery.vercel.app` |

## Verify after deploy

- `GET https://your-app.vercel.app/_/backend/v1/health` → JSON
- `GET https://your-app.vercel.app/_/backend/v1/subjects` → JSON with subjects
- Sign-up in the app (network tab should show `POST .../_/backend/v1/auth/register`)

## Local dev

```bash
cd backend && go run .
cd frontend && npm run dev
```

Uses `/api/v1/...` via Vite proxy (see `vite.config.ts`).
