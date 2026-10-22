# Proposal

## Why

The MSN-working-clone project ships its own Winamp (route `/winamp`, a WebAmp-style player plus a YouTube-based shared listening feature that needs the MSN session). Like MSN Messenger and Fotolog, it should feel installed in the Win98 OS: the desktop "Winamp" icon should open that live app inside a Win98 window. The current Winamp of this repo (Webamp, id `webamp`) must not be deleted: it is archived as a hidden backup that can be restored later. This is the second of three related changes; it depends on the shared helper created in `add-fotolog-app`.

## What Changes

- New iframe app `winamp` (`src/apps/winamp/winamp-app.js`) extending `IFrameApplication`, framing `msnUrl("/winamp")` through the shared `createMsnFrameWindow` helper, 640x480, resizable, singleton, icon `ICONS.webamp` (the existing winamp.png).
- The classic Webamp app is archived in place, not removed: its id stays `webamp`, its title becomes "Winamp Classic", its `category` is removed so it no longer appears in Start, Programs, and its code under `src/apps/webamp/` is untouched apart from the config literal and its README. It stays registered so `.m3u` files (file association) and any custom or StartUp shortcut that targets `webamp` keep working.
- The default desktop shortcut `Winamp.lnk.json` now points to `winamp` (one changed entry in `defaultShortcuts`), and the Start, Programs entry for the new app appears through `category: ""`.
- One-time migration for returning users: persisted `Desktop/Winamp.lnk.json` and `Start Menu/Programs/Winamp.lnk.json` that still point to `webamp` are rewritten in place to `winamp` (keeping icon position), guarded by a marker file like the existing `.shortcuts_migrated`.
- The Agent tour step "Winamp" opens `winamp` instead of `webamp`.
- `e2e/webamp_launch.spec.js` is adapted to launch the classic app through `window.System.launchApp("webamp")` because the desktop icon no longer opens it. New `e2e/winamp.spec.js`.
- Generated registry entries (`bun run build:registry`), app README with screenshot, rows in `src/apps/README.md`.
- No changes to MSN-working-clone.

## Capabilities

### New Capabilities

- `apps/winamp`: the MSN Winamp app and shortcut, and the rule that classic Webamp stays available as a hidden backup (including the migration of persisted shortcuts).

### Modified Capabilities

None as a spec change; `apps/msn-messenger` and `apps/fotolog` are unaffected.

## Impact

- **Layers affected**: an app (new `winamp`, config-only edit of `webamp`), config (`app-registry.js` generated, `file-associations.js` unchanged on purpose), system (`zenfs-init.js`: one changed `defaultShortcuts` entry and a small one-time migration function), apps (`agent.js` tour step id).
- **Concrete files**: `src/apps/winamp/winamp-app.js`, `src/apps/winamp/README.md`, `src/apps/winamp/screenshot.png`, `src/apps/webamp/webamp-app.js` (config literal only), `src/apps/webamp/README.md`, `src/config/app-registry.js` (generated), `src/system/zenfs-init.js`, `src/apps/agent/agent.js`, `src/apps/README.md`, `e2e/webamp_launch.spec.js`, `e2e/winamp.spec.js`.
- **Blast radius** (`graphify affected`, `graphify query "what reads webamp app id"`): the `webamp` id is referenced by `app-registry.js`, `file-associations.js` (`m3u`), `zenfs-init.js` (default shortcut), `agent.js` (tour) and the taskbar tray menu inside the app itself; nothing else imports `webamp-app.js`. `zenfs-init.js` is high-risk (it boots every user): the edit is limited to one entry plus one self-contained migration function.
- **Persistence impact**: existing users have `/C:/WINDOWS/Desktop/Winamp.lnk.json` and `/C:/WINDOWS/Start Menu/Programs/Winamp.lnk.json` with `appId: "webamp"`. They are migrated once to `winamp`. New ZenFS marker `/C:/.winamp_msn_migrated`. No new localStorage keys. Shortcuts elsewhere (StartUp, user-created, Quick Launch) are not touched and keep launching the classic app.
- **Authenticity impact**: Winamp 2 (1998) matches the Windows 98 era and the MSN version is a themed recreation of it; the MSN page is a full-page app inside a window, which is a deliberate anachronism of the same kind as MSN Messenger. The classic Webamp window floats on the desktop; the new one is an ordinary Win98 window.
- **Cross-app interaction**: same origin, shared `localStorage` session; `/winamp` is a private route (login required). Winamp and MSN each open their own WebSocket; the MSN server keeps a set of sockets per user, so it works. The YouTube player inside is a nested iframe and needs the `autoplay` permission delegated by the Win98 frame.
- **Rollout**: ships with the next win98-web image; needs `/winamp` on the same origin and an MSN build where `VITE_ENABLE_WINAMP` is not `false` (production default is enabled).

## Non-goals

- Deleting or rewriting the classic Webamp code; making it the handler of MSN Winamp features.
- Playing local ZenFS files in the MSN Winamp (it cannot read them; `.m3u` stays with classic Webamp).
- A UI to switch between the classic and the MSN Winamp (restoring the classic is a config change).
- The links inside MSN that open the other apps (`open-msn-shortcuts-as-windows`).
- Changing MSN or its `VITE_ENABLE_WINAMP` flag.
- Clamping the window to the desktop (see `add-fotolog-app` Open Questions).
