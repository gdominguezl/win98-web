# Proposal

## Why

The company runs the MSN Messenger clone (repo `MSN-working-clone`) on the same domain as this Windows 98 desktop. We want the two to feel like one product: a "MSN Messenger" icon on the Win98 desktop that, on double click, opens the already-running MSN app inside a Win98 window, as if Messenger were installed in the OS. No Messenger code is reused or duplicated; the window only frames the live app.

## What Changes

- New iframe app `msn-messenger` (`src/apps/msn-messenger/msn-messenger-app.js`) extending `IFrameApplication`, opening a resizable Win98 window that frames the MSN app URL.
- The MSN URL comes from the build-time variable `VITE_MSN_URL` and defaults to `/` (the MSN app lives at the root of the same domain in production, see `serve-win98-under-path` in MSN-working-clone). Local development sets it to the MSN dev server URL.
- A default desktop shortcut `MSN Messenger.lnk.json` is added to the `defaultShortcuts` list that `zenfs-init.js` already writes into `/C:/WINDOWS/Desktop`. A Start menu entry under Programs appears automatically through the app's `category`.
- New icon entry `ICONS["msn-messenger"]` reusing the MSN app favicon as an asset.
- Generated registry entry (`bun run build:registry`), app README with screenshot, row in `src/apps/README.md`, and a Playwright e2e spec.
- No changes to MSN-working-clone.

## Capabilities

### New Capabilities

- `apps/msn-messenger`: the MSN Messenger app and shortcut: how it is discovered (desktop, Start menu), how the window behaves, and which MSN URL it frames.

### Modified Capabilities

None. The only existing spec is `container-delivery`, whose requirements do not change.

## Impact

- **Layers affected**: config (`src/config/icons.js`, generated `src/config/app-registry.js`), system (`src/system/zenfs-init.js`: one entry in `defaultShortcuts`), and a new app folder. No shell, shared or `public/os-gui` change.
- **Concrete files**: `src/apps/msn-messenger/msn-messenger-app.js`, `src/apps/msn-messenger/README.md`, `src/apps/msn-messenger/screenshot.png`, `src/assets/icons/msn-messenger.ico`, `src/config/icons.js`, `src/config/app-registry.js` (generated), `src/system/zenfs-init.js`, `src/apps/README.md`, `e2e/msn_messenger.spec.js`, optionally `.env.example`.
- **Blast radius** (`graphify affected`): `zenfs-init.js` is imported only by `os-init.js` (and through it `main.js`), and the change adds one array entry, no logic. `icons.js` is imported by about 65 modules, but adding a key changes none of them. `IFrameApplication` is only extended, not modified. `app-registry.js` is regenerated; nothing else imports the new entry.
- **Persistence impact**: one new ZenFS file, `/C:/WINDOWS/Desktop/MSN Messenger.lnk.json` (written on boot only if missing, like the existing defaults, so returning users also get the icon with no migration), plus an auto-created Start menu shortcut under `/C:/WINDOWS/Start Menu/Programs`. No new localStorage keys. As with the other default shortcuts, a deleted icon comes back on the next boot.
- **Authenticity impact**: MSN Messenger shipped alongside Windows 98 (1999), so a Messenger shortcut on the desktop and under Programs is period-accurate. The framed content is the Windows Live Messenger look of the clone (7.css), which is a deliberate anachronism and not something this change tries to hide.
- **Cross-app interaction**: in production the iframe is same-origin with the Win98 page, so both share `localStorage` (MSN session keys `messenger_token`, `messenger_user`). Signing out in the window signs out any other MSN tab and vice versa. This is accepted for the internal deployment and is not new exposure (see `serve-win98-under-path`).
- **Rollout**: ships with the next win98-web image; needs no MSN change. The MSN `web` service is already reachable at `/` on the same host.

## Non-goals

- Reimplementing, embedding or bundling any MSN code, assets or styles in win98-web.
- Making MSN look like Windows 98 or restyling its UI.
- A Win98-side sign-in, session bridging or single sign-on between the OS and MSN beyond what the shared origin already gives.
- Hardening MSN against framing by other origins (`X-Frame-Options` or `frame-ancestors`). It currently sends neither header. Adding `frame-ancestors 'self'` in MSN's nginx is a follow-up in the other repo.
- Supporting the GitHub Pages deployment, where `/` is not MSN. That build only shows a broken frame unless `VITE_MSN_URL` is set.
- Native-feeling integration such as taskbar tray presence, notifications or inter-window messaging.
