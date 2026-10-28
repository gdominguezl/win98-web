# Design

## Context

- The Programs menu is built from shortcut files in `/C:/WINDOWS/Start Menu/Programs` by `getMenuFromZenFS(path)` (directories first, then alphabetical) and `loadLnk`; `refreshPrograms()` creates one shortcut per app with a category. Shortcuts already stored in a browser stay there (`refreshPrograms` only removes shortcuts to apps that no longer exist).
- The desktop shows `/Desktop`, a virtual path from `DesktopExtension` that merges virtual items (My Computer, Network Neighborhood, Recycle Bin, ...) with real shortcuts from `/C:/WINDOWS/Desktop`. The Games folder is the real folder `/C:/WINDOWS/Desktop/Games` with one `.lnk.json` per game; Explorer shows it as any folder.
- Apps and their categories: Doom, Quake, Diablo and Commander Keen are top-level Programs entries (category `""`); Mouse is under Accessories/System Tools; Flash Player and Media Player under Accessories/Entertainment; Sound Scheme Explorer under Accessories/Games; App Maker, DOS Games Downloader, Task Manager and Desktop Themes are top-level (`""`); Report a Bug and Agent are under Accessories; MS-DOS Prompt is top-level (`""`). Buy me a coffee is top-level (`""`).
- The engine contract is `{ id, apply(ctx) -> manifest, remove(ctx, manifest) }`, applied per page load while the session runs.

## Decisions

1. **Visual filter, not deletion.** `src/system/app-visibility.js` exports `setHiddenApps(ids | null)`, `setHiddenDesktopItems(names | null)`, `setPinnedProgram(appId | null)`, `isAppHidden(appId)`, `isDesktopItemHidden(name)`, `getPinnedProgram()`, and an always-hidden constant `ALWAYS_HIDDEN = ["buy-me-a-coffee"]` merged into `isAppHidden`. Setters dispatch the same refresh events the Desktop and Start menu already listen to (`desktop-refresh`, plus whatever event the Start menu uses to rebuild; found during implementation, no new listener API unless none exists). Default state is empty: nothing hidden, nothing pinned.
2. **Hidden app ids** (session): `desktop-themes`, `agent`, `diablo`, `keen`, `doom`, `quake`, `app-maker`, `dos-games-downloader`, `task-manager`, `report-a-bug`, `cursor-explorer`, `sound-scheme-explorer`, `flash-player`, `media-player`. Hidden virtual desktop item: Network Neighborhood. The ids and the item are the single list in `focus-mode.js`, easy to edit. Verify each id against `app-registry.js` while implementing; an unknown id is reported, not ignored silently.
3. **Where the filter applies.**
   - Start menu: in `getMenuFromZenFS`, skip a shortcut whose `appId` is hidden (this also covers stale stored shortcuts); after building a submenu, drop it if it became empty; honor `getPinnedProgram()` by placing the matching top-level `Programs` item first (before folders) only for the root Programs path.
   - Desktop: in `DesktopExtension.readdir` for `/Desktop` skip hidden virtual items and `.lnk.json` files whose `appId` is hidden (read each lnk once; cache by name per call); for `/Desktop/Games` skip hidden game shortcuts the same way, so Explorer windows on the Games folder match the desktop.
   - Not filtered: raw disk views (`C:\WINDOWS\Start Menu`, `C:\WINDOWS\Desktop` opened directly). The user chose a visual-only filter.
4. **Pin.** `setPinnedProgram("command-prompt")` makes `MS-DOS Prompt` the first entry of the Programs list. Outside sessions the order is unchanged.
5. **Buy me a coffee, always.** Remove its category in `app-registry.js` so new profiles get no Start shortcut, and rely on the always-hidden filter for profiles that already stored it. No ZenFS write.
6. **Station.** `focus-mode.js` (`id: "focus-mode"`): `apply` calls the three setters and returns `{}`; `remove` calls them with `null`. Registered for `argentina` and `chile`. Because it only changes in-memory state, a reload re-applies it through the engine, exactly like the help override of the THROWBACK stations.
7. **Live refresh.** If the Start menu or an Explorer/desktop window is open when the filter changes, it refreshes on the event; at minimum the next open shows the correct state.

## Risks

- Start menu and desktop builders are shared by everything: every change must be a no-op with the default state, guarded by the existing specs plus tests for the default state.
- Reading every `.lnk.json` in the desktop/Games readdir adds file reads; the folders are small. Cache within the call.
- Games folder entries are `.lnk.json` files created at first boot; a profile that renamed them keeps working because the filter matches the `appId` inside the file, not the name.

## Open Questions

- None blocking. If a hidden app is later needed by a challenge, remove its id from the list in `focus-mode.js`.
