# Proposal

## Why

During Argentina and Chile sessions teams see the whole Windows 98 catalog (games, tools, themes, the assistant) and lose focus on the challenges. A "focus" station hides the apps unrelated to the challenges while the session runs, so teams are guided to what matters, and puts MS-DOS Prompt first in the Programs list. Separately, "Buy me a coffee" must be hidden from the menu for everyone, always.

## What Changes

- New module `src/system/app-visibility.js`: a small in-memory visibility filter. It holds a set of hidden app ids (and hidden virtual desktop items) and an optional pinned app id for the top of Programs. Setters dispatch a refresh event. Nothing is deleted from ZenFS; the filter is applied only when menus and folders are built, so removing it restores everything.
- New station `focus-mode` registered for BOTH offices (`src/apps/improving-ct-october/stations/focus-mode.js`). `apply` sets the hidden list and pins MS-DOS Prompt; `remove` clears them. Re-applied by the engine on reload.
- Hidden during Argentina and Chile sessions:
  - Desktop: Desktop Themes, Agent, Network Neighborhood.
  - Games (desktop Games folder and Start > Programs): Diablo, Commander Keen, Doom, Quake.
  - System tools: App Maker, DOS Games Downloader, Task Manager, Report a Bug, Mouse, Sound Scheme Explorer, Flash Player, Media Player.
  - Everything else stays on purpose as distractions, including Internet Explorer, the other games, eSheep and buggyprogram.exe.
- Start > Programs: MS-DOS Prompt is the first item of the list while a session runs (above the folders). Folders left empty by the filter disappear.
- Always (also without a session): Buy me a coffee is hidden from Start > Programs, including the shortcut already stored in browsers that visited before. The app stays in the code and can still be launched by id.
- No server, MSN or nginx change.

## Capabilities

### New Capabilities

- `apps/ct-session-focus`: the focus filter during sessions and the always-hidden Buy me a coffee.

## Impact

- **Layers affected**: system (`app-visibility.js`), shell (Start menu builder `src/shell/start-menu/start-menu-utils.js` and the Desktop/Games folder readers: `src/shell/explorer/extensions/desktop-extension.js` and the desktop controller), config (`app-registry.js` category for Buy me a coffee), app (`improving-ct-october/stations/`), tests, README. Layering is respected: shell reads the system module; the station (app) calls it.
- **Concrete files**: `src/system/app-visibility.js`, `src/shell/start-menu/start-menu-utils.js`, `src/shell/explorer/extensions/desktop-extension.js`, `src/shell/desktop/desktop.js` (only if the filter cannot live in the extension), `src/config/app-registry.js`, `stations/focus-mode.js`, `stations/registry.js`, `e2e/ct_session_focus.spec.js`, `src/apps/improving-ct-october/README.md`.
- **Blast radius** (`graphify affected` on the touched shell files): the Start menu, the desktop and Explorer's Desktop view. With no hidden ids and no pinned app (the default) the builders return exactly what they return today, except Buy me a coffee, which is always filtered. The existing specs for the Start menu, desktop, Explorer and games must keep passing.
- **Persistence**: none. Hidden ids and the pin live in memory and the engine re-applies them on reload while a session runs; no ZenFS shortcut is created, edited or deleted, so there is nothing to clean up and no migration.
- **Authenticity impact**: the menu and desktop keep the standard Windows 98 look; only some entries are absent. The pin reorders one item during sessions.
- **Rollout (EC2)**: win98-web image only. No API or env change; MSN, Fotolog and Winamp are not edited or hidden.

## Non-goals

- Blocking the hidden apps from launching (Run dialog, Explorer, typed paths). The user chose a visual-only filter.
- Hiding Explorer's raw view of `C:\WINDOWS\Start Menu` or other disk folders; deleting shortcuts; per-team customization.
- Changing which apps exist or their categories (except dropping the Start entry for Buy me a coffee).
