# Pdidi App — Agents guide

Two-package monorepo (no workspace tool). Each sub-project has its own `package.json`, scripts, and `.env`.

## Project structure

- `pdidi-backend/` — Express 5 + Sequelize 6 + MySQL 8 (CommonJS, port **3000**)
- `pdidi-frontend/` — Vite 7 + React 19 + TypeScript 5.8 + Tailwind v4 + shadcn/ui (ESM, port **5173**)

## Commands

All commands must be run from the respective sub-project directory.

| Package | Command | What |
|---|---|---|
| backend | `npm run dev` | nodemon (with `-L` flag) |
| backend | `npm start` | production start |
| backend | `npm run migrate` | Sequelize migrations |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | `tsc -b && vite build` |
| frontend | `npm run lint` | ESLint |
| frontend | `npm run preview` | Vite preview |

## Docker

```bash
docker compose up --build
```

Starts MySQL 8 (`db`), backend (`server` on :3000), and frontend (`frontend` on :5173). Backend Dockerfile runs `npm run migrate && npm run dev` on startup.

## Key conventions

- **Username format:** `XX##-#` (e.g., `GS25-1`, `EV25-1`). Enforced by regex `^[A-Z]{2}\d{2}-\d+$` on both login and register.
- **Auth flow:** Login requires only a username (no password). Admin access requires a separate `/api/auth/validate-admin` step that returns a JWT (stored in httpOnly cookie `adminToken` plus response body). Token expires in 24h.
- **Admin middleware:** Routes with `authenticate` + `isAdmin` middleware need the JWT (via `Authorization: Bearer <token>` header or the `adminToken` cookie).
- **CORS:** Backend accepts requests from `ORIGIN_URL` env var (default `http://localhost:5173`), with credentials.
- **Swagger:** Available at `/api-docs` only when `NODE_ENV=development`.
- **Frontend env:** `VITE_API_URL` (e.g., `http://localhost:3000/api`), `BASE_URL` (used in prod build for base path `/catering/`).
- **Path alias:** `@/` maps to `src/` in both Vite and TypeScript configs.
- **shadcn/ui style:** `radix-nova`; components live in `@/components/ui`.
- **User session:** Stored in `sessionStorage` via zustand persist middleware.
- **Font:** Geist Variable (`@fontsource-variable/geist`).

## Testing

No test suites configured. Backend test script is a placeholder. Frontend has no test script.

## Deployment

- `.cpanel.yml` copies `pdidi-backend/` to `/home/dregissi/catering-backend` and touches a restart file.
- `compose.yaml` is the primary local dev / containerized deployment method.
