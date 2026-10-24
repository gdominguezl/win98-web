# Tasks

Baseline: before editing, run `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" bun x playwright test e2e/improving_ct_october.spec.js e2e/y2k_patch.spec.js e2e/msn_messenger.spec.js e2e/fotolog.spec.js e2e/winamp.spec.js e2e/msn_app_links.spec.js` on the current tree and keep the result (known failing: the classic Webamp case in `winamp.spec.js`, which needs unpkg.com and archive.org).

## 1. Failing e2e spec (RED)

- [x] 1.1 Add `e2e/ct_stations.spec.js` with the cases of design decision 8 (idle, apply, other office untouched, remove on finish, restart and new game, idempotent rejoin, stale cleanup, failure isolation, old tab without office). Use `e2e/ct-mock.js` and the real ZenFS; register the fake stations through `page.evaluate` importing `engine.js`. Run it and confirm it fails because the engine does not exist.

## 2. Client plumbing

- [x] 2.1 In `src/apps/improving-ct-october/api.js`: `ct-october-office` key, `saveSession(token, role, office)`, `getOffice()`, `clearSession()` also clears it, and both `saveSession` and `clearSession` dispatch `window` event `ct-october-auth`. Keep existing behavior for callers that pass no office.
- [x] 2.2 In `src/apps/improving-ct-october/improving-ct-october-app.js`: `_start()` passes the form's office to `saveSession`; the admin login keeps calling it without office.

## 3. Engine

- [x] 3.1 Create `src/apps/improving-ct-october/stations/engine.js` per design decisions 1 to 5 and 7: `desiredOffice()`, serialized `reconcile()`, marker `/C:/.ct_stations.json`, per-page `activated` set, boot cleanup, error isolation, `registerStation(office, entry)` and `startCtStations()`. No new comments.
- [x] 3.2 Create `src/apps/improving-ct-october/stations/registry.js` with the (initially empty) office lists and the single place where stations are listed.
- [x] 3.3 In `src/main.js` import and call `startCtStations()` after `startCtTimer()`.

## 4. Docs

- [x] 4.1 Add the "Stations" section to `src/apps/improving-ct-october/README.md` (contract, registry, idempotence, cleanup, how to add one).

## 5. Verification

- [x] 5.1 Run `bun x playwright test e2e/ct_stations.spec.js` and confirm it passes (GREEN).
- [x] 5.2 Re-run the baseline specs and confirm no previously passing case now fails (MSN, Fotolog, Winamp, shortcut interception, CT window and Y2K Patch unchanged).
- [x] 5.3 Manual idle check: open the desktop with no CT session and confirm in DevTools that `/C:/.ct_stations.json` does not exist and there are no console errors from the engine.

## 6. Final validation

- [x] 6.1 Run `bun run build` (restore the unrelated `report-a-bug` category if `build:registry` strips it; no registry diff is expected), then `graphify update .`.
- [x] 6.2 Commit as Gustavo only, with no `Co-authored-by` trailer. Message: `feat(ct): add the station engine for office clues`. Verify `git log -1` shows that author and no co-author line.
