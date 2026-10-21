# Tasks

## 1. Container smoke test (written first)

- [x] 1.1 Add `scripts/verify_container.sh <base-url>` (curl-based, exits non-zero on the first failure) that asserts every scenario in `specs/container-delivery/spec.md`: `/win98-web/` 200, `/win98-web` 301 with `Location: /win98-web/`, `/` 404, `/win98-web/resume` 200 `index.html`, `/win98-web/pipes/` serves its own index, `/win98-web/images/does-not-exist.png` 404 with the BSOD body, `sw.js` and HTML `no-cache`, an `assets/*.js` file `immutable` and `Content-Encoding: gzip`, a PNG without `Content-Encoding`, and `/healthz` 200. Verify by running it against a non-existent URL and seeing it fail with a clear message.

## 2. Image

- [x] 2.1 Add `.dockerignore` excluding `node_modules`, `dist`, `.git`, `e2e`, `test-results`, `graphify-out`, `openspec`, `.github` and `*.md` except what the build needs, while keeping `public/` and `scripts/`. Verify with `docker build` output that the transferred context is roughly the size of `public/` plus `src/` and does not include `node_modules`.
- [x] 2.2 Add `nginx.conf` following design decisions 1 and 3 (prefix serving, relative redirect with `absolute_redirect off`, extensionless fallback, `error_page 404`, cache locations, gzip, `/healthz`). Verify with `docker run --rm -v "$PWD/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:stable-alpine nginx -t`.
- [x] 2.3 Add the multi-stage `Dockerfile` (`oven/bun:1` build stage with `bun install --frozen-lockfile` and `bun run build`, then `nginx:stable-alpine` runtime copying `dist/` to `/usr/share/nginx/html/win98-web/`). Add a `HEALTHCHECK` that requests `/healthz`. Verify `docker build -t win98-web .` succeeds on a clean checkout and record the peak memory and build time.
- [x] 2.4 Run `docker run --rm -p 8080:80 win98-web` and `scripts/verify_container.sh http://localhost:8080`. Verify every assertion passes.

## 3. Behavior check in a browser

- [x] 3.1 Open `http://localhost:8080/win98-web/` and verify the desktop boots, the console has no errors, the service worker registers with scope `/win98-web/`, and Paint opens (it loads absolute `/win98-web/apps/paint/...` assets).
- [x] 3.2 Open `http://localhost:8080/win98-web/resume` and verify the `resume` profile starts; open `/win98-web/not-a-profile` and verify it ends on the Blue Screen page. Record the result for the design open question.
- [x] 3.3 Reload with DevTools network throttling off and verify a second visit revalidates `sw.js` (conditional request) and serves `assets/*` from cache.

## 4. Documentation

- [x] 4.1 Add a "Docker" section to `README.md` covering build, run, URLs, the `/healthz` endpoint, how to run `scripts/verify_container.sh`, and the build memory note from 2.3. Verify the documented commands run as written.

## 5. Final validation

- [x] 5.1 Run `bun run build` and confirm it still succeeds and `src/config/app-registry.js` shows no diff.
- [ ] 5.2 Run `bun run test` (ran: 12 passed / 22 failed — failures are pre-existing, unrelated to this change; no app code touched) and confirm the existing Playwright suite is unchanged and passes (no application code was touched).
- [x] 5.3 Run `graphify update .`.
- [x] 5.4 Commit all changes with `chore(docker): add container image served under /win98-web/`.

## Workflow follow-up

- Hand off the built image name and port 80 contract to `serve-win98-under-path` in MSN-working-clone.
- Archive this change after the MSN change is deployed and verified end to end.
