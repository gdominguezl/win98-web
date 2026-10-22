# Design

## Context

- Reused from `add-fotolog-app`: `src/shared/utils/msn-frame.js` (`msnUrl`, `createMsnFrameWindow`). This change must be applied after that one.
- Classic Webamp (`src/apps/webamp/webamp-app.js`) renders into `#webamp-container` without a standard window (`_createWindow` returns null), has a taskbar button, tray context menu and `isSingleton: true`. Its config has `category: ""`, so `refreshPrograms` creates `Programs/Winamp.lnk.json`.
- Where `webamp` is referenced (checked with grep and `graphify query`): `defaultShortcuts` in `zenfs-init.js` (`Winamp.lnk.json`), `file-associations.js` (`m3u` only), `agent.js` tour step, the generated registry, `e2e/webamp_launch.spec.js`, and the app's own files.
- Start menu behavior: `refreshPrograms` removes shortcuts only when their `appId` no longer exists in the registry, and creates missing ones for apps with a defined `category`. It runs on first boot, in the taskbar refresh and in `update-manager.js`. So hiding the classic app by removing `category` does not remove the old persisted Programs shortcut, hence the migration.
- MSN side (read-only): `/winamp` is a private route, enabled unless `VITE_ENABLE_WINAMP === 'false'`; the page is a desktop-like layout (`.winamp-desktop { height: calc(100vh - 44px); min-height: 580px }`, floating media window `width: min(760px, 100vw - 365px)`), and below 760 px of viewport width it switches to a stacked mobile layout with `min-height: 1020px`.

## Goals / Non-Goals

**Goals:** the desktop Winamp icon opens the live MSN Winamp in a window; classic Webamp remains available but hidden; existing users get the new icon without losing their desktop layout.

**Non-Goals:** see proposal.

## Decisions

**1. New app id `winamp`, classic keeps id `webamp`.** The archive is a config edit, so nothing that already references `webamp` (file association, user shortcuts, StartUp) breaks and the backup can be restored by reverting the config and the shortcut default.
- Alternative: move the code to `src/apps/_archive/webamp` and unregister it. Rejected by the user: `.m3u` would stop opening and shortcuts would be cleaned as invalid.
- Alternative: reuse id `webamp` for the iframe app. Rejected: the persisted shortcuts, file association and the Agent tour would then silently run the wrong app, and the backup would have no id.

**2. `winamp` config literal**: `id: "winamp"`, `title: "Winamp"`, `description: "Listen to music with your friends."`, `icon: ICONS.webamp`, `category: ""`, `width: 640`, `height: 480`, `resizable: true`, `isSingleton: true`. `_createWindow` uses `createMsnFrameWindow(this, { path: "/winamp", title: "Winamp" })`.

**3. `webamp` config edit (only these keys)**: `title: "Winamp Classic"`, remove `category: ""`. Everything else, including `tray`, `tips` and the implementation, is untouched. Its README gets a short "Archived backup" note describing how to restore it (set `category: ""`, point the default shortcut back, restore the title).
- `apps` that look up the app by title are not an issue: lookups use ids.

**4. Default shortcut**: the `Winamp.lnk.json` entry in `defaultShortcuts` changes `appId` from `webamp` to `winamp`. No second shortcut is created for the classic player.

**5. One-time migration** `migrateWinampShortcuts()` in `zenfs-init.js` (a small function in that file, or in a new `src/system/migrate-winamp-shortcut.js` imported there, mirroring `migrate-shortcuts.js`, whichever keeps the zenfs-init diff smaller):
- It runs before the `defaultShortcuts` loop and before `refreshPrograms`, only if `/C:/.winamp_msn_migrated` does not exist, then writes that marker (same pattern as `/C:/.shortcuts_migrated`).
- For each of `/C:/WINDOWS/Desktop/Winamp.lnk.json` and `/C:/WINDOWS/Start Menu/Programs/Winamp.lnk.json`: if it exists, parses as JSON with `type: "shortcut"` and `appId: "webamp"`, it is rewritten with `appId: "winamp"` in place, which keeps the icon's saved position (layout is keyed by file name). Missing files and parse errors are skipped with a `console.warn`, never thrown.
- Only these two default locations are migrated. A user who deliberately made another shortcut to the classic player keeps it.
- The marker makes it one-time, so a user who later points the shortcut back to `webamp` is not overridden at every boot.
- Order matters: if the migration ran after the default loop, a fresh `Winamp.lnk.json` (appId `winamp`) would already exist and the old one would never be seen. Verified by an e2e case.

**6. Agent tour**: the `webamp` tour step changes `appId` to `winamp` and keeps its id and text, so the Agent opens the same icon the user sees.

**7. File association `m3u` stays on `webamp`.** The MSN Winamp cannot read local ZenFS files, and the classic player implements `.m3u` loading (`_onLaunch(filePath)`).

**8. Window size 640x480** as requested by the user. Measured MSN behavior: the Winamp page switches to its stacked mobile layout below 760 px viewport width, with a minimum height of 1020 px, so inside a 640x480 window it will be the mobile layout and will scroll vertically. This is accepted as the default, recorded in Risks, and the size is a one-line change if the user prefers 960x640 or larger.

**9. Tests (Playwright, written first)** in `e2e/winamp.spec.js` (1440x900 viewport, `page.route` stub for `/winamp`): desktop icon "Winamp"; double click opens `.window[data-app-id="winamp"]` titled "Winamp" with `iframe[title="Winamp"]` whose src resolves to `/winamp`, taskbar button, 640x480, not maximized; Start, Programs has "Winamp" and does not list "Winamp Classic"; singleton; close; the migration case (seed `window.fs` with the old Desktop and Programs shortcuts pointing at `webamp` and no marker, reload, both now point at `winamp`, the marker exists, and a StartUp shortcut to `webamp` is untouched); the classic app still launches through `window.System.launchApp("webamp")` and `#webamp-container` appears. `e2e/webamp_launch.spec.js` is updated to launch classic through `launchApp("webamp")` and no longer clicks the desktop icon.

**10. Docs**: new app README with `## Screenshot`; rows in `src/apps/README.md` (add Winamp, rename the Webamp row to "Winamp Classic" and note it is archived).

## Risks / Trade-offs

- **[Risk] 640x480 shows MSN Winamp in its mobile layout (scrolling).** → Accepted at the user's request; recorded; trivial to change. Task 6.2 checks how it looks and reports it.
- **[Risk] `zenfs-init.js` is high-risk and runs for every user.** → Mitigation: one entry plus one isolated, idempotent, error-tolerant function; boot-related specs re-run (`desktop_component.spec.js`, `desktop_extension.spec.js`); migration tested both ways (with and without the old shortcuts).
- **[Risk] Existing e2e `webamp_launch.spec.js` already fails in the baseline (dev-server timeouts) and now targets a different flow.** → Mitigation: it is adapted and judged against the recorded baseline, not against "all green".
- **[Risk] YouTube playback inside a nested iframe may need the `autoplay` delegation.** → Mitigation: `createMsnFrameWindow` already sets `allow="autoplay; fullscreen; clipboard-write"` on the Win98 frame; verified manually in 6.2 and, on the deployed host, in 6.4.
- **[Risk] Login required.** A signed-out user sees MSN's login in the Winamp window, and after login MSN navigates to its home `/`, not back to `/winamp` (`LoginPage.jsx` always does `navigate('/')`). → Accepted, same as Fotolog; closing and reopening Winamp loads it signed in. A return-to-page fix would be an MSN change, out of scope.
- **[Risk] Audio duplication.** Opening MSN and Winamp windows together can play MSN notification sounds while a track plays. → Accepted, same as the real apps in separate tabs.
- **[Trade-off] Two apps called Winamp in the registry.** The classic one is "Winamp Classic" and has no Start entry, so the UI shows only one.

## Open Questions

- After deployment: should the classic player stay reachable through the UI (for example an Explorer shortcut), or is the file association enough? Default here: file association only.
