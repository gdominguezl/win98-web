# Tasks

Depends on `add-ct-october-api` being deployed, or on Playwright routing `/ct` for these tests.

## 1. Client and countdown

- [x] 1.1 Add `src/apps/improving-ct-october/api.js` and `timer.js` as described in `design.md`. Verify the timer module exports a start function and does not touch the DOM until a team token exists.

## 2. Window and patch

- [x] 2.1 Add `e2e/improving_ct_october.spec.js` that routes `**/ct/**` and covers the scenarios in `specs/apps/improving-ct-october/spec.md`. Update `e2e/y2k_patch.spec.js` so a correct code, a reset team, a missing session, and a code past 60 minutes go through the routed finish call. Verify both files exist. Do not launch the browser yet.
- [x] 2.2 Add `improving-ct-october-app.js`, its CSS, and the `Improving CT October.lnk.json` shortcut in `src/system/zenfs-init.js`. Use `ICONS.computer`. Import the timer from `src/main.js`. Point Y2K Patch submit at `POST /ct/finish`. Run `bun run build:registry` and keep only the new block in `src/config/app-registry.js`. Verify with `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" bun x playwright test e2e/improving_ct_october.spec.js e2e/y2k_patch.spec.js`.

## 3. Docs

- [x] 3.1 Add `src/apps/improving-ct-october/README.md` with a `## Screenshot` section and `screenshot.png`, and one row in `src/apps/README.md`. Verify the heading is present.

## 4. Validation

- [x] 4.1 Run `bun run build`, then the Playwright command from 2.2, then `graphify update .` from `win98-web`. Verify the build and both specs pass.
- [x] 4.2 Run `bun run dev` against a local API or the routed page, start a team, confirm the countdown, submit a wrong patch code and then the real one, and open the admin board on the other theme. Verify the console has no new errors.
- [x] 4.3 Commit as Gustavo only, with no `Co-authored-by` trailer. Message: `feat(ct): add the Improving CT October window and server-backed patch`. Verify `git log -1` shows that author and no co-author line.

## Workflow follow-up

- Ship the win98-web image after the API routes answer on the EC2 host.
