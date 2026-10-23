# Proposal

## Why

The Y2K Patch window can accept a code, but nobody can start a timed office session or see which team finished. Crews and admins need one vintage app, Improving CT October, and a clock on the desktop. The session itself is stored by the API change `add-ct-october-api`.

## What Changes

- Add the Improving CT October app on the desktop and under Start > Programs.
- A crew member picks Argentina or Chile, picks a team, types that team's keyword, and presses Start. The desktop then shows a retro countdown.
- An admin picks an office, types that office's password, and manages teams, the board, the podium, and a reset.
- The countdown is driven by the server clock. It freezes when the server says the patch was accepted. At 00:00 it shows Game over, and a later correct code still counts.
- The Y2K Patch window sends the code to the server. The success animation plays only after the server accepts it.

## Capabilities

### New Capabilities

- `apps/improving-ct-october`: The crew login, the admin panel, and the desktop countdown.

### Modified Capabilities

- `apps/y2k-patch`: A correct code is accepted by the server. A missing or reset session does not play the success animation.

## Impact

- **Layers**: a new app, one boot import in `src/main.js` that mounts the countdown, and a change to the Y2K Patch submit path. No `public/os-gui` change and no new database in this repo.
- **Files**: `src/apps/improving-ct-october/` (app, client, timer, CSS, README, screenshot), `src/main.js`, `src/system/zenfs-init.js` (one shortcut), `src/apps/y2k-patch/y2k-patch-app.js`, `src/config/app-registry.js`, `src/apps/README.md`, `e2e/improving_ct_october.spec.js`, `e2e/y2k_patch.spec.js`. Icon is the existing `ICONS.computer`.
- **Blast radius**: `graphify affected` on the Y2K app stays inside that app and the registry. `main.js` only imports `os-init` today. The new import runs after boot and adds a node only when a team token exists.
- **API**: same origin `/ct` in production. Local dev sets `VITE_CT_API_URL` to the API origin. This change does not deploy until `add-ct-october-api` is on the host.
- **Persistence**: the team or admin token is in `sessionStorage` for this tab. The clock and the finish time stay on the server.

## Non-goals

- The API, the tables, and the EC2 compose change. Those are `add-ct-october-api`.
- Live updates without the admin pressing Refresh.
- Hiding this app until a session exists. It is how a session starts.
