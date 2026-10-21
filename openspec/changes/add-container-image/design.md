# Design

## Context

See proposal.md for motivation. Facts that shape the approach:

- `vite.config.js` sets `base: "/win98-web/"`. The source also hardcodes the prefix (`src/system/os-init.js` reads `window.location.pathname` for profiles and redirects to `BASE_URL + "404.html"`; `src/apps/paint/*` use absolute `/win98-web/apps/paint/...` URLs). The prefix is not configurable without editing those files.
- `bun run build` runs `build:registry` and then `vite build`. Output is `dist/` (~140 MB, because `public/` is ~97 MB of games, screensavers, songs and apps). `dist/` contains `sw.js`, `registerSW.js`, `manifest.webmanifest` and hashed `assets/` from `vite-plugin-pwa` (`registerType: "autoUpdate"`).
- Profile deep links: `os-init.js` treats the first path segment after `/win98-web/` as a profile name (`src/config/profiles.js`, currently `resume`). Unknown names redirect to `404.html`. GitHub Pages has no SPA fallback, so this relies on the app being served at those paths.
- Bun is the required package manager (`bun.lock`). npm is not used.
- The MSN stack already uses `nginx:stable-alpine` for its web image, and MSN's nginx has no compression enabled.

## Goals / Non-Goals

**Goals:**
- A single image that serves the site exactly as GitHub Pages does at `/win98-web/`, plus the small behaviors a real web server needs (health check, gzip, cache headers).
- The image works standalone (`docker run -p 8080:80`) and behind a path-routing reverse proxy without prefix rewriting.

**Non-Goals:**
- Registry publishing, image signing, multi-arch builds.
- TLS inside the container. TLS is terminated upstream.
- Tuning `public/` asset size or lazy-loading.

## Decisions

**1. The container owns the `/win98-web/` prefix.** Files are copied to `/usr/share/nginx/html/win98-web/` and nginx serves that prefix. The reverse proxy forwards the URI unchanged.
- Why: no `proxy_pass` prefix stripping, so redirects, `Location` headers and the service worker URL are identical in dev, GitHub Pages and production. The image can be tested standalone with the same URLs.
- Alternative: serve from the root of the container and strip `/win98-web/` in the proxy. Rejected: extra rewrite logic in the proxy and a different URL layout between environments.

**2. Multi-stage build: `oven/bun:1` then `nginx:stable-alpine`.**
- Build stage: copy `package.json` and `bun.lock` first, run `bun install --frozen-lockfile`, then copy the source and run `bun run build`. Layer caching keeps dependency installs fast.
- Runtime stage: copy `dist/` into the nginx html dir and `nginx.conf` to `conf.d/default.conf`.
- Alternative: build `dist/` on the host and `COPY` it. Rejected: it depends on the developer machine and breaks reproducibility.

**3. nginx behavior (all in `nginx.conf`, no `if` except one safe rewrite).**
- `location = /win98-web { return 301 /win98-web/; }` with `absolute_redirect off;` so the `Location` header is `/win98-web/` and never contains the container host or port.
- `location /win98-web/ { try_files $uri $uri/index.html @app_fallback; }`. Using `$uri/index.html` instead of `$uri/` avoids a `403` for directories without an index (for example `public/azay.rahmad/`).
- `location @app_fallback`: if the URI matches `^/win98-web/[^/.]+/?$`, rewrite internally to `/win98-web/index.html`; otherwise `return 404`.
- `error_page 404 /win98-web/404.html;` so missing files show the existing Blue Screen page with a real `404` status. The `404.html` path is not in the extensionless fallback, so there is no loop.
- Cache: exact or regex locations for `*.html`, `sw.js`, `registerSW.js`, `manifest.webmanifest` set `Cache-Control: no-cache`; `location ^~ /win98-web/assets/` sets `public, max-age=31536000, immutable`. Other `public/` files (games, songs, images) keep nginx's default `ETag` and `Last-Modified` revalidation.
- `gzip on` with `gzip_types` for JS, CSS, JSON, SVG, manifest and WASM, plus `gzip_vary on`. Media (PNG, MP3, MIDI, ZIP) is not listed on purpose.
- `location = /healthz { access_log off; return 200 "ok\n"; }`.
- Anything outside `/win98-web/` and `/healthz` returns the default `404`.

**4. Compose and routing are not in this change.** This change only produces the image. MSN-working-clone owns the compose service and proxy block (`serve-win98-under-path`).

**5. Build on the host for now.** The MSN deploy builds images on the EC2 host with `docker compose`, so the Dockerfile must work with plain `docker build`. A registry-based flow is a follow-up.

## Risks / Trade-offs

- **[Risk] Vite 7 build with ~97 MB of public assets can exceed memory on a small EC2 instance.** → Mitigation: document the measured peak memory in README, recommend 4 GB RAM or swap, and keep the option to build the image elsewhere and load it with `docker save | docker load`.
- **[Risk] Fallback rewrite could mask real 404s for single-segment paths such as `/win98-web/foo`.** → Mitigation: that is intended (the app redirects unknown profiles to `404.html`); anything with a dot or a deeper path still returns a real `404`. Covered by spec scenarios.
- **[Risk] Service worker serves a stale shell after a deploy.** → Mitigation: `sw.js`, `registerSW.js`, the manifest and HTML are `no-cache`; the PWA uses `autoUpdate`.
- **[Risk] Users already on the GitHub Pages origin lose their ZenFS (IndexedDB) and localStorage state on the new origin.** → Accepted for an internal project. Called out in the proposal.
- **[Trade-off] Duplicated nginx knowledge.** Cache and compression rules exist in the MSN nginx too. Accepted: the image stays self-contained and the proxy stays a plain pass-through.

## Open Questions

- Does `/win98-web/resume` boot the `resume` profile today on GitHub Pages? The fallback makes it work in the container regardless, but confirm the intended behavior while verifying task 3.2.
