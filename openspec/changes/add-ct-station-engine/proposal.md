# Proposal

## Why

The office game wants "stations": while a team is playing, parts of the Windows 98 system are arranged so the players can find clues by exploring it (a hidden image in the Recycle Bin for Argentina, a folder of files for Chile, later Paint, Minesweeper and more). Each office has its own set, and more will be added in later plans. We need one central, safe mechanism that applies a set of stations when a team starts its session and undoes them when the session stops running, so every future clue is a small module instead of new session plumbing.

## What Changes

- New station engine in `src/apps/improving-ct-october/stations/`: `engine.js` (lifecycle, persistence, error isolation) and `registry.js` (which stations each office gets, loaded on demand).
- The engine reacts to the existing session snapshots (`ct-october-session`, published by the timer on every poll) and to sign-in changes. While a team of an office is **running**, the office's stations are applied. When the session stops running (finished, restarted by an admin, reset, "Start a new game", token gone) they are removed.
- A station is a small module `{ id, apply(ctx), remove(ctx, manifest) }`. `apply` is idempotent and returns a manifest of what it created; `remove` undoes exactly that. The engine stores the manifest in a ZenFS marker file so cleanup works after a reload.
- The client now remembers the team's office: `saveSession(token, role, office)` stores `ct-october-office` in `sessionStorage`, and `saveSession` and `clearSession` publish a `ct-october-auth` event.
- The engine starts from `src/main.js` next to `startCtTimer()`.
- Stale clues are cleaned on desktop boot when a marker exists but this tab has no team session.
- No stations are registered by this change: it is the base. `add-ct-argentina-recycle-clue` and `add-ct-chile-throwback-folder` add the first two.
- No server, MSN, nginx or env change.

## Capabilities

### New Capabilities

- `apps/ct-stations`: when and for whom clue stations are applied and removed, persistence, idempotence and failure isolation.

### Modified Capabilities

None.

## Impact

- **Layers affected**: an app (`improving-ct-october`: `api.js`, `improving-ct-october-app.js`, new `stations/`, `timer.js` untouched) and `src/main.js`. No system, shell, shared or config change in this plan.
- **Concrete files**: `src/apps/improving-ct-october/stations/engine.js`, `src/apps/improving-ct-october/stations/registry.js`, `src/apps/improving-ct-october/api.js`, `src/apps/improving-ct-october/improving-ct-october-app.js`, `src/main.js`, `e2e/ct_stations.spec.js`, `src/apps/improving-ct-october/README.md`.
- **Blast radius** (`graphify affected`): `api.js` is imported by the CT window, the timer and Y2K Patch; the change adds an optional argument and two event dispatches. `main.js` gains one import and one call, and the engine does nothing until a team session exists. MSN Messenger, Fotolog, Winamp, the shortcut interception (`msn-frame.js`) and Y2K Patch are not edited.
- **Persistence impact**: new `sessionStorage` key `ct-october-office` (per tab, like the existing token and role keys). New ZenFS marker `/C:/.ct_stations.json` holding the applied office and station manifests; it exists only while stations are applied. No new localStorage key, no migration. Users who never start a CT session never get any of it.
- **Authenticity impact**: none; stations only place ordinary files in the existing Win98 file system.
- **Rollout and compatibility (EC2)**: the change ships only in the win98-web image. No MSN or API change, no env var, no nginx change. It is compatible with the CT API work tested locally (`add-ct-office-patch-codes`) and with the older API too, because the engine only reads session snapshots that already exist. A tab that logged in before this image (token but no stored office) simply gets no stations. When nobody has a CT session the engine is idle, so the MSN, Fotolog and Winamp windows behave exactly as before; the verification runs their specs unchanged.

## Non-goals

- The stations themselves (Argentina and Chile plans) and future ones (Paint, Minesweeper, ...).
- Server-side configuration, admin editing of stations, or per-team stations.
- Several teams on the same browser profile at once: ZenFS is shared across tabs, so one team per computer is assumed.
- Preventing players from deleting or emptying a clue (for example emptying the Recycle Bin). An admin restart plus a new start re-applies it.
- Hiding the clues from someone inspecting the app code or IndexedDB.
