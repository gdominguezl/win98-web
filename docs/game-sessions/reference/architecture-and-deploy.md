# Architecture and deploy

How the CT October game fits together across the two repos.

## Pieces

| Piece | Repo | Where |
|---|---|---|
| Desktop + game UI | `win98-web` (this repo) | `src/apps/improving-ct-october/` (app, timer, `api.js` client, `stations/`), `src/apps/y2k-patch/` |
| CT API | `MSN-working-clone` (sibling checkout, `../MSN-working-clone`) | `server/ctOctober.js` — an Express router mounted under `/ct` |
| Database | same | PostgreSQL; tables in `server/schema.sql` (`ct_teams`, `ct_sessions`, `ct_office_settings`) |
| Reverse proxy | same | `nginx.conf` — the `web` service routes `/ct` (and the other API prefixes) to `api`, and `/win98-web/` to the `win98` service |

### Client → API

`src/apps/improving-ct-october/api.js` calls `GET/POST /ct/...` on the
configured base (`VITE_CT_API_URL`, or same origin when unset). Tokens are
JWTs signed by the API, kept in `sessionStorage` per tab (`ct-october-token`,
`ct-october-role`, `ct-october-office`). Roles: `ct-team` and `ct-admin`.

### Endpoints (`server/ctOctober.js`)

- Public/team: `GET /ct/teams?office=`, `POST /ct/team/login`,
  `POST /ct/team/start`, `GET /ct/session`, `POST /ct/finish` (the patch-code
  check happens **here**, server-side, per office).
- Admin: `POST /ct/admin/login`, `GET|PUT /ct/admin/patch-code`,
  `GET|POST /ct/admin/teams`, `PATCH|DELETE /ct/admin/teams/:id`,
  `GET /ct/admin/board`, `POST /ct/admin/teams/:id/reset`, `POST /ct/admin/reset`.

### Data model

- `ct_teams` — per `company_id`/`event_id`/`office`, seeded with Team 1–10 per
  office on first use.
- `ct_sessions` — `started_at`/`finished_at` per team; `elapsedMs` caps at
  60 minutes (`LIMIT_MS`); a finished-after-overtime run is still recorded
  (the client reports it as not on time).
- `ct_office_settings` — **per-office patch code** seeded from
  `Y2K_PATCH_CODE` with `is_default = TRUE`; the admin's PUT flips it to a
  custom code, and the server rejects a new code equal to the default.

### Environment variables (names only — values are secrets)

| Var | Repo | Meaning |
|---|---|---|
| `CT_ADMIN_PASSWORD_ARGENTINA` / `CT_ADMIN_PASSWORD_CHILE` | MSN `server/.env` | Office admin sign-in passwords for the Admin view |
| `Y2K_PATCH_CODE` | MSN `server/.env` | Shared **default** patch code seeded into each office until an admin saves a custom one |
| `VITE_Y2K_PATCH_CODE` | win98-web build | Legacy client-side fallback code read by `src/apps/y2k-patch/code.js` (the authoritative check is the server's `/ct/finish`) |
| `VITE_CT_API_URL` | win98-web dev | API base for the CT client; unset = same origin (production) |
| `JWT_SECRET`, `COMPANY_ID`, `EVENT_ID`, `DATABASE_*` | MSN `server/.env` | Token signing and the company/event scope every query is filtered by |

## Local testing

In `../MSN-working-clone`:

```bash
bun run db:local        # local PostgreSQL via scripts/local-db.sh
bun run server:local    # API on :3309 (CORS_ORIGIN=http://localhost:5179)
```

Then in this repo:

```bash
VITE_CT_API_URL=http://localhost:3309 bun run dev
```

(Use the matching `CORS_ORIGIN` for your port — the script defaults to
`:5179`, so either point dev there or restart the API with your port.)
The e2e suite covers all of this with a mocked API (`e2e/ct-mock.js`), so a
local API is only needed for manual checks.

## Deploy on EC2

From the MSN repo README (`README.md`, "Win98 hosting"):

```bash
git pull                                   # MSN repo (API + nginx)
git -C ../win98-web pull                   # this repo
git -C ../win98-web rev-parse --short HEAD # record the deployed commit
docker compose build win98                 # build explicitly first
docker compose up -d --build               # recreates api, web and win98
scripts/win98-routing/verify.sh http://localhost
```

- Order matters: pull MSN first so `api` and `web` (nginx) are current —
  nginx must route `/ct` to `api` (`nginx.conf` `location ~ ^/(…|ct)(/|$)`),
  then rebuild `win98` so the served desktop has the new stations.
- `win98` has no published port; the only entry is `web`. If it is down,
  `/win98-web/` returns 502 but MSN keeps working.
- Users must hard-refresh after a deploy (the desktop is a precached SPA);
  station code is fetched lazily per office.
- Rollback: revert the change, `docker compose up -d web`, then
  `docker compose rm -sf win98` if needed.

## Resetting between teams

- Per team: Admin view > **Restart** on that team's board row — clears its
  session, removes its station artifacts; the team signs in and starts over.
- Per group: **Reset all** — clears every session in the office (names and
  keywords stay). Run this between groups so each group sees a clean board.
- Patch code: the office keeps the last saved code until the admin saves a
  new one — rotate it between events.
- The desktop itself is shared: sessionStorage is per-tab, so a fresh tab
  always starts clue-free, and station leftovers self-clean at boot.
