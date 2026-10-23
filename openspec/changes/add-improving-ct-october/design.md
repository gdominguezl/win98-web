# Design

## Context

See proposal.md for why. Apply `add-ct-october-api` first. This repo stays a static client. The countdown and the patch window call `/ct` on the same origin in production, or `VITE_CT_API_URL` in local dev.

## Goals / Non-Goals

**Goals:** One vintage window for crew and admin, one desktop countdown, and a patch submit that waits for the server.

**Non-Goals:** See proposal. Also: no edit to `public/os-gui`, `application.js`, or `local-storage.js`.

## Decisions

**1. App id `improving-ct-october`.** Config literal uses `ICONS.computer`, `category: ""`, `width: 440`, `height: 380`, `resizable: false`, `isSingleton: true`. Desktop shortcut `Improving CT October.lnk.json` in `defaultShortcuts`. No iframe.

**2. Client `src/apps/improving-ct-october/api.js`.** Every call goes through this file. The base is `import.meta.env.VITE_CT_API_URL` or `''`. Tokens live in `sessionStorage`: `ct-october-token` and `ct-october-role` (`team` or `admin`). A 401 clears them.

**3. Crew flow.** Office, then a team list from `GET /ct/teams`, then a keyword field. Enter and Start both call login and then start. A wrong keyword shows a sunken error and leaves the field editable. A running or finished session replaces the form with a one-line status.

**4. Admin flow.** Office, then a password field. After login the window shows three stacked sections: teams (name, keyword, Save, Delete, and a create row), the board with a Refresh button, and Reset. The podium is the finished rows of the board, already ordered by the server. Refresh is a button, not a timer. Reset reads `runningCount` first. If it is above zero, the confirm text says someone is still playing. Confirm calls `POST /ct/admin/reset`.

**5. Countdown.** `src/apps/improving-ct-october/timer.js` is imported from `src/main.js` after `initializeOS()`. If the role is `team` and a token exists, it polls `GET /ct/session` every 5 seconds and draws one panel on the right side of `#desktop-area`, above the taskbar. The panel uses the button-face grays and a sunken time field. It counts down from 60:00 using `startedAt` and `serverNow`, and ticks locally between polls. At 00:00 it shows Game over. When `status` is `finished` it freezes and hides Game over. Closing the app window does not remove the panel. A new tab has no token, so it has no panel.

**6. Y2K Patch.** Submit no longer calls `codesMatch`. It posts the typed code to `POST /ct/finish` with the team token. Status 200 runs the existing overlay and sets `y2k-patch-applied`. Status 409 `team_reset` shows "Sorry, your team has been reset. Please contact the admin or start a new session." No token shows "Start a session in Improving CT October first." A wrong code still shows the error in the window. `code.js` remains the local normalizer only if the finish request wants to send the trimmed code. The server decides.

**7. Tests.** Playwright routes `**/ct/**`. It does not boot the API. Cover the crew start, a wrong keyword, the countdown, Game over at a start time 61 minutes ago, an admin refresh and podium, the reset warning, and the Y2K cases in `e2e/y2k_patch.spec.js` (success, reset, and no session). Update the old Y2K spec so it no longer expects a local-only accept.

## Risks / Trade-offs

- **[Risk] The existing Y2K spec accepts a code with no server.** → This change updates that spec and its e2e in the same task as the submit path.
- **[Risk] `build:registry` drops `report-a-bug`'s `category`.** → Keep only the new registry block.
- **[Trade-off] The countdown can be 5 seconds behind a reset or a finish.** The next poll corrects it. The patch window updates as soon as finish returns.

## Migration Plan

Ship the API change first, with the same `Y2K_PATCH_CODE` the desktop used to bake in. Then ship this image. Locally, run the MSN API and set `VITE_CT_API_URL`. Rollback of this image restores the local-only patch check. Session rows on the server stay.
