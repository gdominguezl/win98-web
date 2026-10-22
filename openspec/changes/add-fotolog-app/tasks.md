# Tasks

Baseline first: before touching code, run `bun run test` once on the unmodified tree and record passing and failing spec names. The earlier baselines (about 21 passing, 23 failing, for example `desktop_component.spec.js:28` and `webamp_launch`) were never confirmed on a clean tree; new work is judged against the recorded list, not against "all green".

## 1. Failing e2e spec (RED)

- [ ] 1.1 Record the baseline (list of passing and failing specs) in the PR description or a test-results note.
- [ ] 1.2 Add `e2e/fotolog.spec.js` modeled on `e2e/msn_messenger.spec.js` (1440x900 viewport; `page.route` stub for `url.pathname === '/fotolog'`; boot with `page.goto('/win98-web/')` and wait for `#boot-screen` hidden). Cases: (a) desktop icon `Fotolog.lnk.json`; (b) double click opens `.window[data-app-id="fotolog"]` titled "Fotolog" with `iframe[title="Fotolog"]` whose src resolves to `/fotolog`, a taskbar button, 1024x768, not maximized; (c) Start, Programs entry launches it; (d) Enter launches it; (e) second launch gives one window; (f) minimized then relaunched restores without reloading the frame; (g) close removes window and taskbar button; (h) returning user: delete the shortcut through `window.fs`, reload, icon is back; (i) iframe computed background is white. Run it and confirm it fails because the app does not exist.

## 2. Shared helper and icon (config and shared)

- [ ] 2.1 Create `src/shared/utils/msn-frame.js` with `msnUrl(path)` and `createMsnFrameWindow(app, { path, title })` as in design decision 1, moving the window and iframe construction out of `msn-messenger-app.js` verbatim.
- [ ] 2.2 Rasterize `MSN-working-clone/public/assets/fotolog/favicon.svg` to `src/assets/icons/fotolog-16.png` and `fotolog-32.png`; add `ICONS.fotolog = { 16, 32 }` to `src/config/icons.js` using `new URL(..., import.meta.url).href`.

## 3. Apps

- [ ] 3.1 Refactor `src/apps/msn-messenger/msn-messenger-app.js` to call `createMsnFrameWindow` with path `/` (config literal unchanged). Run `bun x playwright test e2e/msn_messenger.spec.js` and confirm 7 of 7 pass unchanged.
- [ ] 3.2 Create `src/apps/fotolog/fotolog-app.js` extending `IFrameApplication` with the config literal from design decision 3 (plain object, no semicolons) and `_createWindow` using the helper with path `/fotolog`; `_onLaunch` focuses the window.
- [ ] 3.3 Run `bun run build:registry`; commit only the new `fotolog` block of `src/config/app-registry.js` and keep unrelated drift (for example `report-a-bug`) out of the commit.

## 4. System

- [ ] 4.1 Add `{ name: "Fotolog.lnk.json", appId: "fotolog" }` to `defaultShortcuts` in `src/system/zenfs-init.js` (one array entry, no logic).

## 5. Docs

- [ ] 5.1 Create `src/apps/fotolog/README.md` (Purpose, Key Features, How to Use, Development with `VITE_MSN_URL`, `## Screenshot`) and `screenshot.png`.
- [ ] 5.2 Add the Fotolog row to `src/apps/README.md` next to MSN Messenger.

## 6. Verification

- [ ] 6.1 Run `bun x playwright test e2e/fotolog.spec.js e2e/msn_messenger.spec.js` and confirm all pass (GREEN).
- [ ] 6.2 Manual check: `bun run dev` with MSN on `npm run dev:local` and `VITE_MSN_URL=http://localhost:5179`; open Fotolog signed out and signed in, resize, maximize, minimize, relaunch; look at the default theme and one other; check the console for errors. Also try 1280x720 and record how far the window overflows.
- [ ] 6.3 Stack check: serve through the MSN verification stack (`scripts/win98-routing`, port 8081, `/win98`) and confirm `/fotolog` loads in the window.
- [ ] 6.4 After deploy (operator step): open `https://<domain>/win98`, launch Fotolog signed in and signed out, record the result.

## 7. Final validation

- [ ] 7.1 Run `bun run build` and confirm it succeeds and the registry diff is only the new block.
- [ ] 7.2 Run `bun run test` and compare with the baseline from 1.1: the two specs pass and no previously passing spec fails (re-check `desktop_component.spec.js` and `desktop_extension.spec.js` because `zenfs-init.js` changed).
- [ ] 7.3 Run `graphify update .`.
- [ ] 7.4 Commit all changes with the Conventional Commit message `feat(fotolog): add Fotolog desktop shortcut and iframe app`.
