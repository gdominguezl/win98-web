# Proposal

## Why

win98-web is a static client-only site that is only published to GitHub Pages. The company wants it served from the same EC2 host and domain as MSN-working-clone (under `/win98-web/`). The MSN stack runs as Docker Compose services behind nginx, so win98-web needs a self-contained container image that serves the production build at the same base path it already uses (`/win98-web/`). Merging the two repositories was rejected: different package managers (Bun vs npm), Vite majors (7 vs 5), ~100 MB of static assets, and an upstream fork whose history we want to keep pulling from.

This change is the first half of the plan. The second half is `serve-win98-under-path` in MSN-working-clone, which adds the compose service and the routing.

## What Changes

- Add a multi-stage `Dockerfile` (Bun build stage, nginx runtime stage) that runs `bun run build` and serves `dist/` under `/win98-web/`.
- Add `nginx.conf` for the image: static serving under `/win98-web/`, cache policy for the PWA files, gzip for text assets, BSOD `404.html` fallback, profile deep links, and a `/healthz` endpoint.
- Add `.dockerignore` so `node_modules`, `dist`, `.git`, `e2e`, `graphify-out` and `openspec` stay out of the build context while `public/` (~97 MB of runtime assets) is kept.
- Document how to build and run the image locally in `README.md`.
- No application code changes. `vite.config.js` already sets `base: "/win98-web/"` and the source hardcodes that prefix, so the base path is kept as is.
- The existing GitHub Pages workflow (`.github/workflows/static.yml`) is untouched.

## Capabilities

### New Capabilities

- `container-delivery`: how the production build is packaged and served as a container (path prefix, fallback behavior, cache and compression policy, health endpoint).

### Modified Capabilities

None.

## Impact

- **Layer affected**: deployment tooling only (repo root). No system, shell, app, shared, config or `public/os-gui` files change.
- **New files**: `Dockerfile`, `nginx.conf`, `.dockerignore`. **Edited**: `README.md` (docs only).
- **Blast radius**: none on `src/`. `graphify affected` is not applicable because no shared module is touched.
- **Persistence impact**: none. No new localStorage keys or ZenFS paths. Note that IndexedDB and localStorage are per-origin, so users already on the GitHub Pages origin will start with fresh state on the company domain.
- **Authenticity impact**: none. The Windows 98 look and behavior are unchanged.
- **Dependencies**: new base images `oven/bun` and `nginx:stable-alpine` (the latter is already used by MSN-working-clone). No new npm packages.
- **Release Please**: the commit uses a `chore(docker)` Conventional Commit so it does not bump the version or edit `CHANGELOG.md`.

## Non-goals

- Merging the repositories or moving win98-web code into MSN-working-clone.
- Changing the base path to `/win98` (it would require editing hardcoded `/win98-web/` paths in `src/` and `public/`). The shorter URL is handled by a redirect in the MSN change.
- CI that builds and pushes the image to a registry (GHCR/ECR). Phase 1 builds on the EC2 host. This can be a follow-up.
- Adding authentication in front of win98-web.
- Changing or replacing the GitHub Pages deployment.
