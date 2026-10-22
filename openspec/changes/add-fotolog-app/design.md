# Design

## Context

See proposal.md. Reused as is (checked with `graphify query` and by reading the files; the same ground as the archived `add-msn-messenger-app`):

- `IFrameApplication` (`src/system/iframe-application.js`) only adds `_setupIframeForInactivity(iframe)`. `msn-messenger-app.js` is the reference: `$Window`, an `<iframe>` injected with `win.$content.html(iframe.outerHTML)`, then the live element is re-queried and the inactivity listeners attached. It already carries two hard-won details: a white iframe background (MSN pages are transparent and would show the ButtonFace gray) and no `sandbox`.
- The app registry is generated (`scripts/generate_registry.js`, regex over `static config = ...;`), so the config stays a plain literal with no semicolons.
- Desktop icons come from `defaultShortcuts` in `zenfs-init.js` (created on every boot if missing). Start menu entries come from `category` via `start-menu-utils.js` (`refreshPrograms`).
- MSN side (read-only): `/fotolog/:userId?` is a private route (`PrivateRoute` redirects to `/login` without a session) and `/fotolog/leni` is public. Fotolog is a content page with `max-width: 1000px` and `min-height: 100vh`.

## Goals / Non-Goals

**Goals:** a launchable "Fotolog" app that frames `/fotolog`; one shared place that knows how to build MSN-family frames so Winamp and the link interception do not copy it.

**Non-Goals:** see proposal.

## Decisions

**1. Shared helper `src/shared/utils/msn-frame.js`.**
- `msnUrl(path)`: `const base = (import.meta.env.VITE_MSN_URL || "/").replace(/\/+$/, "")`, returns `base + path`. With the default base `/` this yields `/fotolog`; with `http://localhost:5179` it yields `http://localhost:5179/fotolog`. `msnUrl("/")` returns the base itself, so MSN keeps its current URL (`/` or the dev URL, never `""`).
- `createMsnFrameWindow(app, { path, title })`: builds the `$Window` (title, outer size and `resizable` taken from `app`), the iframe (`title`, `allow="autoplay; fullscreen; clipboard-write"`, 100% size, no border, `backgroundColor = "#fff"`, no `sandbox`), injects it, re-queries it, calls `app._setupIframeForInactivity` and returns the window. It stores the iframe on `app.iframe`.
- Layering: `shared` has no dependency on apps or shell; apps depend on shared. `$Window` is the existing global.
- Alternative: copy the 25 lines into each app (as `pinball` and `buy-me-a-coffee` do). Rejected: there will be three near-identical apps and the white-background and no-sandbox decisions must stay in one place.
- Alternative: a new base class `MsnFrameApplication`. Rejected: a function is enough and does not add another level to the `Application` hierarchy.

**2. Refactor `msn-messenger` onto the helper, no behavior change.** Risk is contained by the existing `e2e/msn_messenger.spec.js` (7 specs including the white-background pixel test), which must pass unchanged. If any assertion needs editing, stop and report.

**3. Fotolog config literal**: `id: "fotolog"`, `title: "Fotolog"`, `description: "Share a photo a day with your friends."`, `icon: ICONS.fotolog`, `category: ""`, `width: 1024`, `height: 768`, `resizable: true`, `isSingleton: true`. Size agreed with the user (Fotolog is a wide content page).

**4. URL**: `msnUrl("/fotolog")`, the private route chosen by the user. Signed-out users get MSN's login page inside the window. Checked in MSN's `LoginPage.jsx`: after a successful login it always navigates to `/` (the MSN home), it does not return to the page that required the login. So in a signed-out Fotolog window, signing in leaves the frame on the MSN home. This is MSN behavior and changing it is outside this change (MSN must not be affected); the user can close and reopen Fotolog, now signed in.

**5. Icon**: rasterize `MSN-working-clone/public/assets/fotolog/favicon.svg` to PNG at 16 and 32 px (for example with the already installed Playwright/Chromium screenshotting an `<img>`), saved as `fotolog-16.png` and `fotolog-32.png`, registered as `ICONS.fotolog = { 16, 32 }`. Nothing is imported from the MSN repo at build time.
- Note: the source favicon is a plain black and white square mark. Confirmed acceptable as the starting point; the icon can be swapped later without code changes.

**6. Default shortcut**: one entry `{ name: "Fotolog.lnk.json", appId: "fotolog" }` in `defaultShortcuts`, following the MSN entry. No migration code.

**7. Window lifecycle**: singleton via `isSingleton`; relaunch focuses (or restores) the existing window without reloading the frame; closing removes the frame and taskbar button; no timers, audio or workers are owned by the Win98 side.

**8. Tests (Playwright, written first)** in `e2e/fotolog.spec.js`, the same shape as `e2e/msn_messenger.spec.js`: a 1440x900 viewport, a `page.route` that answers `/fotolog` with a stub page, boot, then assert the desktop icon, window title and `iframe[title="Fotolog"]` with `src` resolving to `/fotolog`, the taskbar button, singleton, Start menu entry, keyboard launch, close, the returning-user case (pre-seed `window.fs` without the shortcut, reload) and the white iframe background.

**9. Docs**: app README with `## Screenshot`, `screenshot.png`, a table row in `src/apps/README.md`, and the `VITE_MSN_URL` note pointing to the MSN README section.

## Risks / Trade-offs

- **[Risk] A 1024x768 window exceeds a short desktop.** At 1280x720 it overflows by about 100 px under the taskbar, and at 1366x768 by about 20 px, because `$Window` does not clamp. → Mitigation: it can be dragged, resized and maximized; the clamp is an Open Question and deliberately outside this change.
- **[Risk] Refactoring the working MSN app.** → Mitigation: pure move of code, guarded by its 7 e2e specs.
- **[Risk] `zenfs-init.js` is high-risk.** → Mitigation: one array entry; `desktop_component.spec.js` and `desktop_extension.spec.js` are re-run.
- **[Risk] Signed-out first launch lands on the MSN login screen and, after login, on the MSN home (MSN always redirects to `/`).** → Accepted; the session is shared once signed in, so reopening the window works. A "return to original page" fix belongs to a separate MSN change.
- **[Trade-off] Same-origin trust**, as already accepted for MSN.

- **[Deviation found while implementing] `Application.launch` relaunched minimized singleton windows with `win.restore()`, which is a no-op for windows minimized from the taskbar (os-gui only hides them and never adds the `.minimized` class `restore()` checks).** → Fixed with one line in `src/system/application.js`, `unminimize()` (the same call `window-manager.js` uses). It affects every singleton app and is required by the "launched while minimized" scenario.

## Open Questions

- Should initial window size be clamped to the visible desktop for every MSN-family window (this would also fix the existing MSN 47 px overflow at 1366x768)? Proposed follow-up: `min(config, desktop size)` inside `createMsnFrameWindow`. Needs the user's call.
- Is the plain favicon the desired desktop icon, or should a Fotolog logo asset be provided?
