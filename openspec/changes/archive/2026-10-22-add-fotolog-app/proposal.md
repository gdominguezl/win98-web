# Proposal

## Why

Fotolog is a second app that lives inside the MSN-working-clone project (route `/fotolog`). Like MSN Messenger (`add-msn-messenger-app`), it should feel installed in the Windows 98 OS: a desktop icon that, on double click, opens the running Fotolog page inside a Win98 window. No Fotolog code is copied; the window only frames the live app. This is the first of three related changes (`add-fotolog-app`, `add-msn-winamp-app`, `open-msn-shortcuts-as-windows`) and it also introduces the small shared helper the other two reuse.

## What Changes

- New shared helper `src/shared/utils/msn-frame.js` exporting `msnUrl(path)` (joins the `VITE_MSN_URL` base, default `/`, with an app path) and `createMsnFrameWindow(app, { path, title })` (builds the `$Window` plus the white, unsandboxed iframe and wires the inactivity listeners). The existing `msn-messenger` app is refactored to use it with identical behavior.
- New iframe app `fotolog` (`src/apps/fotolog/fotolog-app.js`) extending `IFrameApplication`, framing `msnUrl("/fotolog")`, 1024x768, resizable, singleton.
- Default desktop shortcut `Fotolog.lnk.json` in `defaultShortcuts` (`zenfs-init.js`, one array entry) and an automatic Start, Programs entry through `category: ""`.
- New icon `ICONS.fotolog`, rasterized from MSN's `public/assets/fotolog/favicon.svg` to PNG (16 and 32).
- Generated registry entry (`bun run build:registry`), app README with screenshot, row in `src/apps/README.md`, Playwright e2e spec.
- No changes to MSN-working-clone.

## Capabilities

### New Capabilities

- `apps/fotolog`: the Fotolog app and shortcut: discovery (desktop, Start menu), window behavior and which URL it frames.

### Modified Capabilities

None as a requirement change. The `apps/msn-messenger` spec stays valid because the refactor keeps its behavior; its e2e spec is the regression guard.

## Impact

- **Layers affected**: shared (new `msn-frame.js`), an app (new `fotolog`, refactored `msn-messenger`), config (`icons.js`, generated `app-registry.js`), system (`zenfs-init.js`: one `defaultShortcuts` entry).
- **Concrete files**: `src/shared/utils/msn-frame.js`, `src/apps/fotolog/fotolog-app.js`, `src/apps/fotolog/README.md`, `src/apps/fotolog/screenshot.png`, `src/assets/icons/fotolog-16.png`, `src/assets/icons/fotolog-32.png`, `src/apps/msn-messenger/msn-messenger-app.js`, `src/config/icons.js`, `src/config/app-registry.js` (generated), `src/system/zenfs-init.js`, `src/apps/README.md`, `e2e/fotolog.spec.js`.
- **Blast radius** (`graphify affected`): `zenfs-init.js` is imported only by `os-init.js` and, through it, `main.js`; the change adds one array entry. `icons.js` is imported by about 65 modules; adding a key changes none of them. `IFrameApplication` is only extended. `msn-frame.js` is new and is imported by the two MSN-family apps only.
- **Persistence impact**: one new ZenFS file `/C:/WINDOWS/Desktop/Fotolog.lnk.json` (written on boot only if missing, so returning users also get the icon with no migration) and an auto-created `/C:/WINDOWS/Start Menu/Programs/Fotolog.lnk.json`. No new localStorage keys. A deleted icon comes back on the next boot, like the other defaults.
- **Authenticity impact**: Fotolog (2002) postdates Windows 98, so a Fotolog shortcut is a deliberate anachronism, the same kind as the MSN window framing a Windows Live era UI. It is requested explicitly and is not hidden.
- **Cross-app interaction**: same-origin frame, so Fotolog shares `localStorage` with MSN (`messenger_token`, `messenger_user`). `/fotolog` requires a login (private route), so a signed-out user sees MSN's login page inside the window. The MSN server accepts several WebSockets per user (`sockets.get(user.id)` is a set), so extra frames do not conflict.
- **Rollout**: ships with the next win98-web image, no MSN change. Needs `/fotolog` reachable on the same origin, which the MSN `web` service already serves.

## Non-goals

- Copying, bundling or restyling any Fotolog code or assets.
- Making Fotolog look like Windows 98.
- A Win98-side sign-in or session bridge beyond the shared origin.
- The links inside MSN that open Fotolog and Winamp (handled by `open-msn-shortcuts-as-windows`).
- A height or width clamp to the visible desktop (see design Open Questions).
- Supporting the GitHub Pages build, where `/` is not MSN.
