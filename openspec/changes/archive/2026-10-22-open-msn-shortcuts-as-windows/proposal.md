# Proposal

## Why

Inside the MSN Messenger window there are two buttons at the bottom left (`AppShortcuts` in MSN-working-clone) that go to Winamp and Fotolog. They are React Router links, so today they navigate inside the same MSN frame and the window turns into Winamp or Fotolog. To make the three apps feel like separate programs of the OS, a click on those buttons inside a Win98 window must open the matching Win98 window (Winamp, Fotolog, or MSN Messenger) instead. This is the third change of the set and depends on `add-fotolog-app` (shared helper, Fotolog app) and `add-msn-winamp-app` (Winamp app).

## What Changes

- The shared helper `src/shared/utils/msn-frame.js` gains `interceptAppShortcuts(iframe)`, and `createMsnFrameWindow` calls it for every MSN-family frame (MSN Messenger, Fotolog, Winamp).
- On every iframe `load` it attaches one capture-phase `click` listener to the frame's document. A plain left click on `a.app-shortcuts__link` whose `href` path is `/`, `/winamp` or `/fotolog` is cancelled (`preventDefault` and `stopPropagation`, so React Router never navigates) and `window.System.launchApp("msn-messenger" | "winamp" | "fotolog")` runs instead. The apps are singletons, so an open window is focused or restored.
- Everything else is left alone: modified or non-primary clicks, other links, and links whose target app is not registered.
- No MSN change at all: the interception relies on the existing class `app-shortcuts__link` and the existing `href` values (the user chose to intercept from Win98, without adding ids to MSN). Outside Win98 the buttons keep working exactly as today.
- Playwright e2e spec `e2e/msn_app_links.spec.js`; READMEs of the three apps get a short note.

## Capabilities

### New Capabilities

- `apps/msn-shortcut-windows`: clicking the MSN app switcher inside a Win98 window opens the matching Win98 window instead of navigating the frame.

### Modified Capabilities

None as a spec change. It extends the behavior of the three app windows, specified by `apps/msn-messenger`, `apps/fotolog` and `apps/winamp`.

## Impact

- **Layers affected**: shared only (`src/shared/utils/msn-frame.js`) plus tests and docs. No system, shell, config or MSN change.
- **Concrete files**: `src/shared/utils/msn-frame.js`, `e2e/msn_app_links.spec.js`, `src/apps/msn-messenger/README.md`, `src/apps/fotolog/README.md`, `src/apps/winamp/README.md`.
- **Blast radius** (`graphify affected`): `msn-frame.js` is imported only by the three MSN-family apps. `window.System.launchApp` is called, not changed.
- **Persistence impact**: none (no localStorage keys, no ZenFS paths).
- **Authenticity impact**: none to reproduce; it removes the "one window turns into another app" effect so the three apps behave as separate programs, like separately installed programs would.
- **Cross-app interaction**: relies on same-origin access to the frame document (`iframe.contentDocument`). Dependency on MSN markup: the class `app-shortcuts__link` and the `href` values `/`, `/winamp`, `/fotolog` in `src/components/AppShortcuts.jsx`. If MSN renames them, the interception silently stops and the buttons fall back to navigating in the frame (graceful degradation); the e2e spec reproduces the MSN markup so the contract is documented, and the MSN repo gets a verification note in the README task.
- **Rollout**: ships with the win98-web image; no MSN redeploy.

## Non-goals

- Changing MSN (no `data-` attributes, no `postMessage`, no new markup); a more robust contract is a possible later MSN change.
- Hiding the shortcut buttons inside Win98 windows.
- Intercepting any other navigation inside the frames (chat links, `/fotolog/:userId`, external links).
- Cross-origin development setups: with `VITE_MSN_URL` on another origin the document is unreachable, the helper logs a warning and the buttons navigate as before.
- Making the three windows share a session or state beyond the same-origin `localStorage` they already share.
