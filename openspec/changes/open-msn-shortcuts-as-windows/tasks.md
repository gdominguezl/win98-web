# Tasks

Prerequisites: `add-fotolog-app` and `add-msn-winamp-app` are implemented (the `msn-frame.js` helper and the `fotolog` and `winamp` apps exist). Use the baseline recorded in `add-fotolog-app` task 1.1.

## 1. Failing e2e spec (RED)

- [x] 1.1 Add `e2e/msn_app_links.spec.js` (1440x900 viewport, boot with `page.goto('/win98-web/')` and wait for `#boot-screen` hidden). Stub the three frame URLs (`/`, `/winamp`, `/fotolog`) with HTML that reproduces the MSN contract (`nav.app-shortcuts` with `a.app-shortcuts__link` hrefs `/winamp`, `/fotolog`, `/`, as `AppShortcuts.jsx` renders for each page) plus a navigation counter. Cases from design decision 6: (a) MSN to Winamp; (b) MSN to Fotolog; (c) Winamp to MSN reuses the MSN window; (d) minimized target is restored; (e) Ctrl+click and middle click not intercepted; (f) Enter on a focused button; (g) other links not intercepted; (h) works after an in-frame reload; (i) stub without switcher does not throw. Run it and confirm it fails.

## 2. Shared helper

- [x] 2.1 In `src/shared/utils/msn-frame.js` add the constant map `{ "/": "msn-messenger", "/winamp": "winamp", "/fotolog": "fotolog" }` and `interceptAppShortcuts(iframe)` following design decisions 1 to 4 (capture-phase click on the frame document, reattached on every `load`, `try/catch` with one warning when the document is unreachable, registry check before intercepting).
- [x] 2.2 Call `interceptAppShortcuts(iframe)` from `createMsnFrameWindow` after the live iframe is re-queried. Confirm no per-app change is needed.

## 3. Docs

- [x] 3.1 Add the "Opening other MSN apps" paragraph (including the dependency on the `app-shortcuts__link` class and hrefs) to `src/apps/msn-messenger/README.md`, `src/apps/fotolog/README.md` and `src/apps/winamp/README.md`.

## 4. Verification

- [x] 4.1 Run `bun x playwright test e2e/msn_app_links.spec.js e2e/msn_messenger.spec.js e2e/fotolog.spec.js e2e/winamp.spec.js` and confirm all pass (GREEN).

## 5. Manual verification

- [x] 5.1 Run `bun run dev` with MSN on `npm run dev:local` and `VITE_MSN_URL` set to the MSN dev origin; confirm the warning is logged once and the buttons still navigate (cross-origin fallback).
- [ ] 5.2 Serve both through the MSN verification stack (`scripts/win98-routing`, port 8081, `/win98`) so the frames are same-origin with the real MSN markup, signed in: click Winamp and Fotolog in the MSN window, MSN and Fotolog in the Winamp window, MSN and Winamp in the Fotolog window; check that frames never navigate, windows are reused when open or minimized, Ctrl+click behaves natively, and the console shows no errors. Also check the signed-out case: log in inside a Fotolog or Winamp window, record that the frame lands on MSN home and that the buttons there still open the matching windows.
- [x] 5.3 Confirm MSN opened outside Win98 (a normal tab) still navigates with the buttons.
- [ ] 5.4 After deploy (operator step): repeat 5.2 on `https://<domain>/win98` and record the result.

## 6. Final validation

- [x] 6.1 Run `bun run build` and confirm it succeeds.
- [x] 6.2 Run `bun run test` and compare with the baseline: nothing that passed now fails.
- [x] 6.3 Run `graphify update .`.
- [x] 6.4 Commit all changes with the Conventional Commit message `feat(msn-frame): open Winamp, Fotolog and MSN buttons as separate windows`.
