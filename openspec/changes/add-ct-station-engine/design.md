# Design

## Context

Read first (`graphify query` on the CT app plus the files):

- `timer.js` polls `GET /ct/session` every 5 seconds for a `ct-team` token (`teamToken()` = `getRole() === "team" && getToken()`), calls `publish(session)` which dispatches `window` event `ct-october-session` with `{ session }` (status `ready`, `running` or `finished`), and `stopLoops()` when the token disappears. `refreshCtTimer()` polls immediately; it is called after Start and after a patch is accepted.
- `improving-ct-october-app.js` `_start()` logs the team in (`office` comes from the form), calls `saveSession(token, "team")`, `teamStart()`, then `refreshCtTimer()`. "Start a new game" calls `clearSession()`. An admin restart or reset makes the next poll return `ready`.
- `api.js` keeps `TOKEN_KEY` and `ROLE_KEY` in `sessionStorage` (per tab) and exposes `saveSession`, `clearSession`, `getRole`, `getToken`.
- `src/main.js` runs `initializeOS()` then `startCtTimer()`.
- ZenFS is shared by all tabs of the origin and persists in IndexedDB; `/C:/.shortcuts_migrated` and `/C:/.winamp_msn_migrated` are existing precedents for hidden marker files at the drive root.

## Goals / Non-Goals

**Goals:** one mechanism that applies per-office stations while a team is running and removes them afterwards; adding a station is one small module plus one registry line; no effect on anyone without a CT session.

**Non-Goals:** see proposal.

## Decisions

**1. Desired state is derived, not event-driven.** `desiredOffice()` returns the team's office when `getRole() === "team"`, a token exists, `getOffice()` is `argentina` or `chile`, and the latest session snapshot has `status === "running"`; otherwise `null`. The engine calls `reconcile()` on `ct-october-session`, on `ct-october-auth` and once at boot. Deriving the target from state means a missed event cannot leave stations behind for long (the next poll corrects it).
- Alternative: hook directly into `_start()` and `_newGame()`. Rejected: an admin restart on another computer reaches the team's machine only through the poll, so the poll must drive removal anyway.

**2. Reconcile algorithm (serialized through a promise chain so two events never interleave).**
```
desired = desiredOffice()
marker = read /C:/.ct_stations.json (or null)
if (!desired) { if (marker) removeAll(marker); activated.clear(); return }
if (marker && marker.office !== desired) { removeAll(marker); activated.clear() }
for id of registry[desired]: if (!activated.has(id)) { manifest = await apply(id); save marker; activated.add(id) }
```
- `activated` is an in-memory set per page load. After a reload with the same running session, the first reconcile re-runs `apply` once (idempotent), so in-memory effects of a station (for example a help override) come back; the marker alone would say "already applied" and skip it.
- `apply` must be idempotent: fixed ids and paths, create-if-missing, overwrite-with-same-content. Applying twice leaves exactly one copy.

**3. Station contract and registry.**
```js
export default { id: "recycle-clue", apply: async (ctx) => manifest, remove: async (ctx, manifest) => {} };
```
- `ctx = { fs, office }` (ZenFS `fs` from `@zenfs/core`). Stations import what else they need themselves.
- `registry.js` declares `{ argentina: [load...], chile: [load...] }` where each entry is `{ id, load: () => import("./<file>.js") }`, so station code and assets are fetched only when a session of that office starts. The engine exposes `registerStation(office, entry)` (what `registry.js` calls for each real entry) and tests can use it too.
- An unknown id in the marker (for example a station removed in a later release) is skipped with a `console.warn`; the marker entry is dropped.

**4. Persistence.** Marker `/C:/.ct_stations.json`: `{ "office": "argentina", "stations": { "<id>": <manifest> } }`, rewritten after each successful `apply` and deleted after `removeAll` finishes. Manifests are plain JSON describing what the station created (paths, ids). Removal uses the manifest, never guesses.
- Boot cleanup: at engine start, if the marker exists and this tab has no team session, `removeAll` runs, so a computer used by a previous team does not keep their clues. If this tab has a team session the engine waits for the first snapshot (the timer's first poll) before deciding.

**5. Failure isolation.** Each `apply` and `remove` runs inside its own `try/catch`; a failure logs `console.warn` with the station id and continues with the next station. The engine never throws into the timer, the CT window or any app, and never blocks on the network.

**6. Office awareness.** `saveSession(token, role, office)` also stores `ct-october-office` when given; `clearSession()` removes it; both dispatch `window` event `ct-october-auth`. `_start()` passes the office from the form. A new `getOffice()` reads it. Admin sessions pass no office, so they never trigger stations.

**7. Start-up wiring.** `src/main.js` calls `startCtStations()` after `startCtTimer()`. `startCtStations()` registers the listeners, runs the boot cleanup and returns immediately.

**8. Tests (Playwright, written first)** in `e2e/ct_stations.spec.js` using `e2e/ct-mock.js` and the real ZenFS (no mocks of ZenFS or `window.System`). The spec imports `/win98-web/src/apps/improving-ct-october/stations/engine.js` through `page.evaluate` and registers a small fake station that writes `/C:/CT_TEST/probe.txt` for an office, to test the engine without the real stations:
- Idle: with no CT session, no marker and no `/C:/CT_TEST` exist, and registering the fake station changes nothing.
- Apply on start: after a team of that office starts (status running) the probe exists and the marker lists it.
- Another office is untouched: a team of the other office gets no probe.
- Remove on finish: after the patch is accepted (status finished) the probe and the marker are gone.
- Remove on restart: the mock's restart makes the poll return ready, the probe and marker are gone.
- Remove on Start a new game.
- Idempotent rejoin: reload with the same running session; the probe exists once and `apply` ran again once for the new page.
- Stale cleanup: with a marker and probe in ZenFS and no token, a reload removes both.
- Failure isolation: a second fake station that throws does not stop the first and the timer still renders.
- No old office: a tab with a token but no stored office applies nothing.
- Existing specs: `improving_ct_october.spec.js`, `y2k_patch.spec.js`, `msn_messenger.spec.js`, `fotolog.spec.js`, `winamp.spec.js` and `msn_app_links.spec.js` still pass (same known baseline failures only).

**9. Docs.** README of the CT window: a "Stations" section describing the contract and how to add one in a few lines.

## Risks / Trade-offs

- **[Risk] A station left behind after a closed browser.** → Mitigation: boot cleanup and the marker; at worst the clue stays until the next desktop load on that computer.
- **[Risk] Two tabs of the same browser with different teams.** → Accepted: ZenFS is shared. One team per computer is the event setup.
- **[Risk] A player deletes a clue.** → Accepted; an admin restart and a new start re-applies it (apply is idempotent).
- **[Risk] Reload during removal.** → Mitigation: removal is idempotent (missing items are ignored) and the marker is deleted last, so the next boot finishes the cleanup.
- **[Risk] Poll delay.** The poll runs every 5 seconds, so removal after finish or restart can lag by up to 5 seconds. Accepted. Finishing through Y2K Patch polls immediately.
- **[Trade-off] Derived state needs the office stored per tab.** Tabs that logged in before this release get no stations; acceptable for a fresh event.

## Open Questions

Defaults used because the user did not answer these before the plan was written; each is one line to change:
- Stations are removed as soon as the session stops running (finished, restarted, reset, new game) and stale ones are cleaned at boot when the tab has no team session. If the clues should stay visible after finishing, only remove them on restart or "Start a new game".
- One team per computer is assumed.
