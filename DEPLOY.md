# Deploy MathForge on Vercel

## Requirements

- Project **Framework Preset**: **Services** (required when using `experimentalServices` in `vercel.json`)
- Deploy from the **repo root**

## Architecture

| Service | Mount | Public URLs |
|---------|-------|-------------|
| `frontend` (Vite) | `/` | App UI, SPA routes |
| `backend` (Go) | `/_/backend` (internal) | `/api/*` via rewrite |

Public API: `/api/v1/...` → rewritten to `/_/backend/v1/...` → Go Fiber app.

## Environment variables

| Variable | Example |
|----------|---------|
| `JWT_SECRET` | long random string |
| `ALLOWED_ORIGINS` | `https://appliedmathmastery.vercel.app` |

## After deploy, verify

- `GET /api/v1/health` → JSON `{"status":"ok",...}` (not the React 404 page)
- `GET /api/v1/subjects` → JSON with subject list
- `POST /api/v1/auth/register` → 201, not 405

## Local development

```bash
cd backend && go run .
cd frontend && npm run dev
```

API at `http://localhost:4000/api/v1/...` (Vite proxies `/api` in dev).
