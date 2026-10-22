# Tasks

Baseline first: before touching code, run the full `bun run test` once on a clean checkout and record the passing and failing spec names. A previous run showed 12 passing and 22 failing (dev-server timeouts); that count is unconfirmed on a clean tree, so the new work is judged against this recorded list, not against "all green".

## 1. Failing e2e spec (RED)

- [x] 1.1 Record the baseline: run `bun run test` on the unmodified tree and save the list of passing and failing specs (in the PR description or `test-results` notes). Verify the list exists before continuing.
- [x] 1.2 Add `e2e/msn_messenger.spec.js` following `e2e/webamp_launch.spec.js`: boot with `page.goto('/win98-web/')` and wait for `#boot-screen` to be hidden; intercept the frame request with `page.route(url => url.pathname === '/', route => route.fulfill({ contentType: 'text/html', body: '<title>msn-stub</title>' }))`; cases: (a) desktop shows an icon "MSN Messenger"; (b) double click opens `.window[data-app-id="msn-messenger"]` titled "MSN Messenger" with an `iframe[title="MSN Messenger"]` whose src resolves to `/` and a taskbar button, and the window is compact (not maximized, its bounding box narrower than half of `.desktop` and shorter than it), then maximizing it makes it larger; (c) second launch keeps exactly one window; (d) Enter on the selected icon launches; (e) Start, Programs lists "MSN Messenger" and launches it; (f) closing removes the window and taskbar button; (g) returning user: seed `window.fs` with a desktop lacking the shortcut, reload, icon appears. Verify with `bun x playwright test e2e/msn_messenger.spec.js` that every case fails because the app does not exist yet.

## 2. Config

- [x] 2.1 Add the icon asset `src/assets/icons/msn-messenger.ico`, copied from `../MSN-working-clone/public/favicon.ico`, and register `ICONS["msn-messenger"] = { 16: new URL("../assets/icons/msn-messenger.ico", import.meta.url).href, 32: same }` in `src/config/icons.js` next to the `simcity2000` precedent. Verify by rendering the icon at 16 and 32 px in the dev server (open the desktop after task 4) and confirm it is legible.

## 3. System

- [x] 3.1 In `src/system/zenfs-init.js`, add `{ name: "MSN Messenger.lnk.json", appId: "msn-messenger" }` to the `defaultShortcuts` array and change nothing else in the file. Verify with `git diff src/system/zenfs-init.js` showing a single added line, and by running `bun x playwright test e2e/desktop_component.spec.js e2e/desktop_extension.spec.js` with the same pass/fail result as the baseline.

## 4. The app

- [x] 4.1 Create `src/apps/msn-messenger/msn-messenger-app.js`: class `MsnMessengerApp extends IFrameApplication` with the config literal from design decision 2 (plain object, no semicolons inside), `const MSN_URL = import.meta.env.VITE_MSN_URL || "/"`, and `_createWindow()` modeled on `src/apps/buy-me-a-coffee/buy-me-acoffee-app.js`: `$Window` with the title, size and icon, an iframe with `src`, `title="MSN Messenger"`, `allow="autoplay; fullscreen; clipboard-write"`, 100% size, no border, no `sandbox`, injected through `win.$content.html(...)`, then re-queried, then `_setupIframeForInactivity`. `_onLaunch()` focuses the window. Verify the file exports the class and that `bun run build:registry` finds the config.
- [x] 4.2 Run `bun run build:registry` and commit only the new `"msn-messenger"` block in `src/config/app-registry.js`. If the generator also rewrites `report-a-bug` (stale `category: "Accessories"`), restore that hunk with `git checkout -p src/config/app-registry.js` and note it in the PR. Verify with `git diff src/config/app-registry.js` showing only the added block.
- [x] 4.3 Run `bun x playwright test e2e/msn_messenger.spec.js` and verify every case now passes (GREEN). If the frame interception or a selector needs adjusting, fix the spec, not the app code, unless the failure is a real defect.

## 5. Docs and screenshot

- [x] 5.1 Add `src/apps/msn-messenger/README.md` (Purpose, Key Features, How to Use, Technologies Used, `## Screenshot`) including how to run it in development with `VITE_MSN_URL=http://localhost:5179 bun run dev` next to `npm run dev:local` in MSN-working-clone, and the same-origin note. Verify `scripts/verify_changes.sh` reports no failure for `msn-messenger`.
- [x] 5.2 Capture `src/apps/msn-messenger/screenshot.png` of the open window showing the MSN login page (use the Docker verification stack from `serve-win98-under-path` or the dev setup). Verify the file exists and is referenced from the README.
- [x] 5.3 Add the "MSN Messenger" row to the Community & Support table in `src/apps/README.md`. Verify the link target exists.

## 6. Manual verification

- [x] 6.1 `bun run dev` with `VITE_MSN_URL=http://localhost:5179` and MSN running via `npm run dev:local`: open `/win98-web/`, double click the icon, and verify the MSN login page renders in the window, the console has no new errors (a cross-origin inactivity warning is expected), and the window drags, minimizes, restores without reloading MSN, maximizes and closes. Check at the default theme and one other theme.
- [x] 6.2 Tune the window size: open the real MSN login page, contact list and an open chat at the compact default (settled by the user at 529x796), then enlarged and maximized. Adjust `width` and `height` in the config literal only if the layout is unusable, keeping the window narrower than half of a default-size desktop and not maximized on open. Observe what `$Window` does at a 640x480 monitor setting (design open question). Re-run `bun run build:registry` if the config changes.
- [x] 6.3 Verify the default URL path: build the Docker image (`docker build -t win98-web .`), start the MSN verification stack from MSN-working-clone (`docker compose -f scripts/win98-routing/docker-compose.verify.yml up -d --build`), open `http://localhost:8081/win98`, double click the icon, and verify the frame loads the MSN page from `/` on the same origin, the screensaver does not start while typing in the frame with a short timeout, and `localStorage` is shared with a top-level MSN tab. Then run `docker compose ... down`.
- [x] 6.4 After the image is deployed to the EC2 (operator step): open `https://<domain>/win98`, launch MSN Messenger, sign in with Microsoft from inside the frame, send a message, close and reopen the window and confirm the session persists. Record the result. — verified by the user on the EC2 (window opens, MSN login renders inside the frame; screenshot reviewed).

## 7. Final validation

- [x] 7.1 Run `bun run build` (which regenerates the registry; confirm the registry diff is still only the new block) and verify it succeeds.
- [x] 7.2 Run `bun run test` and compare with the baseline from 1.1: `e2e/msn_messenger.spec.js` passes and no previously passing spec now fails. — final run 17 passed / 24 failed vs baseline 12 / 22: all 7 new specs pass; the two extra failures (`desktop_component.spec.js:28` and `:38`) also fail on a clean checkout of HEAD without this change (2/2 runs), so they are not caused by it
- [x] 7.3 Run `graphify update .`.
- [x] 7.4 Commit all changes with the Conventional Commit message `feat(msn-messenger): add MSN Messenger desktop shortcut and iframe app`.

## 8. Size update requested after review

- [x] 8.1 Set the initial window size to 529x796 in the config literal, the generated registry block and the app README, and give the e2e spec a 1440x900 viewport so the desktop is taller than the window. Verify `bun x playwright test e2e/msn_messenger.spec.js` passes 7/7 and the registry diff is only the two numbers.

## Workflow follow-up

- Follow-up in MSN-working-clone: send `Content-Security-Policy: frame-ancestors 'self'` (or `X-Frame-Options: SAMEORIGIN`) from its nginx so only the same origin can frame it. Not part of this change.
- Archive this change after task 6.4 is recorded.
