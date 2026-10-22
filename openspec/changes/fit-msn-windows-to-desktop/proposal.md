# Proposal

## Why

Two sizing problems in the MSN-family windows (MSN Messenger, Fotolog, Winamp):

1. **Winamp needs a bigger, specific size.** The Winamp page of the MSN app has a Milkdrop video/effects window next to the player and playlist. At the current 640x480 it falls into MSN's stacked mobile layout and scrolls (measured when implementing `add-msn-winamp-app`). The right size for the iframe content is about 901x592.
2. **Windows are cut off on small screens.** A user on a 13 inch laptop reports the bottom of the MSN window hidden. Cause (verified in `public/os-gui/$Window.js`): `$Window` centers a new window inside `#screen`, which includes the taskbar, and never limits its size to `#desktop-area`, which is the real work area (`#screen` minus the 28 px taskbar). The configured 529x796 (MSN), 1024x768 (Fotolog) and any bigger Winamp therefore open partly under the taskbar whenever the visible desktop is shorter than the window.

## What Changes

- `createMsnFrameWindow` (`src/shared/utils/msn-frame.js`) fits every window it creates to the desktop work area: the initial size is limited to the size of `#desktop-area`, and the window is positioned fully inside it. Windows that already fit are unchanged. This fixes MSN, Fotolog and Winamp at once and any future MSN-family window.
- Winamp opens with a 901x592 content area (the iframe size) instead of 640x480 outer. The helper learns an optional content-size config (`innerWidth`, `innerHeight`), passed to `$Window` as `innerWidth` and `innerHeight` (supported by `setDimensions`), so the iframe size does not depend on the theme's window border width.
- Specs: new capability `apps/msn-frame-sizing` (fit to the desktop for all three windows) and a modified Winamp size requirement.
- No MSN change.

## Capabilities

### New Capabilities

- `apps/msn-frame-sizing`: MSN-family windows open fully inside the visible desktop and never under the taskbar.

### Modified Capabilities

- `apps/winamp`: the "Winamp window size and lifecycle" requirement changes from 640x480 to a 901x592 content area, fitted to the desktop.

## Impact

- **Layers affected**: shared (`src/shared/utils/msn-frame.js`), an app config (`src/apps/winamp/winamp-app.js`), generated registry, tests and READMEs. No system, shell or `public/os-gui` change.
- **Concrete files**: `src/shared/utils/msn-frame.js`, `src/apps/winamp/winamp-app.js`, `src/config/app-registry.js` (generated, only the `winamp` block), `e2e/winamp.spec.js`, `e2e/msn_messenger.spec.js`, `e2e/fotolog.spec.js` (new low-resolution cases), `src/apps/winamp/README.md`, `src/apps/msn-messenger/README.md`, `src/apps/fotolog/README.md`.
- **Blast radius** (`graphify affected`): `msn-frame.js` is imported only by the three MSN-family apps. `$Window` is read, not modified.
- **Persistence impact**: none. The window's user-chosen size is not persisted, so there is nothing to migrate.
- **Authenticity impact**: in Windows 98 a new window that does not fit on the screen is limited to the screen; a window never opens under the taskbar. Fitting reproduces that.
- **Cross-app interaction**: none beyond the existing shared helper.
- **Rollout**: ships with the next win98-web image; no MSN redeploy.

## Non-goals

- Re-fitting windows when the browser window is resized after opening (existing os-gui behavior keeps title bars reachable and maximized windows fitted).
- Limiting other apps' windows or changing `$Window` for everyone.
- Persisting window sizes between sessions.
- Changing MSN's own responsive CSS.
- Changing the Fotolog (1024x768) and MSN (529x796) configured sizes.
