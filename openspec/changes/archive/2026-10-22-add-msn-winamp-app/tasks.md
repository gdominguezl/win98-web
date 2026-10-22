# Tasks

Prerequisite: `add-fotolog-app` is implemented (the shared helper `src/shared/utils/msn-frame.js` exists). Baseline: use the recorded list from that change, or record a new one with `bun run test` on a clean tree before editing. `webamp_launch` is known to fail in the baseline.

## 1. Failing e2e specs (RED)

- [x] 1.1 Add `e2e/winamp.spec.js` (1440x900 viewport; `page.route` stub for `url.pathname === '/winamp'`; boot and wait for `#boot-screen` hidden) with the cases of design decision 9: icon, launch by double click and Enter, Start, Programs lists "Winamp" and not "Winamp Classic", 640x480 not maximized, singleton, close, classic still launches with `launchApp("webamp")`, and the migration cases (old shortcuts rewritten in place and position kept, marker created, StartUp shortcut untouched, invalid JSON skipped, already-migrated profile not touched). Seed with `window.fs` before reload. Run it and confirm it fails.
- [x] 1.2 Update `e2e/webamp_launch.spec.js` to launch classic through `window.System.launchApp("webamp")` instead of the desktop icon, keeping the `#webamp-container` and `#webamp` assertions. Run it and record whether it passes or fails against the baseline.

## 2. App (iframe) and archive of classic

- [x] 2.1 Create `src/apps/winamp/winamp-app.js` extending `IFrameApplication` with the config literal of design decision 2 (plain object, no semicolons) and `_createWindow` using `createMsnFrameWindow(this, { path: "/winamp", title: "Winamp" })`; `_onLaunch` focuses the window.
- [x] 2.2 Edit only the config literal in `src/apps/webamp/webamp-app.js`: `title: "Winamp Classic"` and remove `category: ""`.
- [x] 2.3 Run `bun run build:registry`; commit only the new `winamp` block and the changed `webamp` block of `src/config/app-registry.js`, and keep unrelated drift (for example `report-a-bug`) out.

## 3. System

- [x] 3.1 In `src/system/zenfs-init.js`, change the `Winamp.lnk.json` default shortcut to `appId: "winamp"`.
- [x] 3.2 Add `migrateWinampShortcuts()` (design decision 5) and call it before the `defaultShortcuts` loop and before `refreshPrograms`, guarded by `/C:/.winamp_msn_migrated`. Confirm with the e2e cases that order, position preservation and error tolerance hold.
- [x] 3.3 In `src/apps/agent/agent.js`, change the Winamp tour step `appId` to `winamp`.

## 4. Docs

- [x] 4.1 Create `src/apps/winamp/README.md` (with `## Screenshot`) and `screenshot.png`.
- [x] 4.2 Add an "Archived backup" note and restore steps to `src/apps/webamp/README.md`; update `src/apps/README.md` (add Winamp, mark Webamp as "Winamp Classic, archived").

## 5. Verification

- [x] 5.1 Run `bun x playwright test e2e/winamp.spec.js e2e/webamp_launch.spec.js e2e/fotolog.spec.js e2e/msn_messenger.spec.js` and compare with the baseline.
- [x] 5.2 Re-run `e2e/desktop_component.spec.js` and `e2e/desktop_extension.spec.js` (`zenfs-init.js` changed) and compare with the baseline.

## 6. Manual verification

- [x] 6.1 Run `bun run dev` with MSN on `npm run dev:local` and `VITE_MSN_URL=http://localhost:5179`; check the migration with a profile that has the old shortcuts (existing IndexedDB), Start menu, and the console for errors.
- [x] 6.2 Open Winamp at 640x480 signed in, play a track, resize and maximize; report how the layout looks at 640x480 (mobile layout, scrolling) and at 960x640, so the user can decide the final size.
- [x] 6.3 After deploy (operator step): open `https://<domain>/win98`, check the Winamp icon (returning browser and a fresh one) and playback, and record the result. — verified by the user on the deployed host (`/win98`), which covers the same-origin check against the real MSN

## 7. Final validation

- [x] 7.1 Run `bun run build` and confirm the registry diff is only the intended blocks.
- [x] 7.2 Run `bun run test` and compare with the baseline: nothing that passed now fails.
- [x] 7.3 Run `graphify update .`.
- [x] 7.4 Commit all changes with the Conventional Commit message `feat(winamp): open the MSN Winamp from the desktop and archive classic Webamp`.
