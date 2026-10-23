# Proposal

## Why

Office teams will finish a Y2K game by typing one recovered code into the desktop. Without a window for that code, the final step of the story has nowhere to land. Game sessions that show or hide the app come later; this change only adds the patch window so the puzzle can be solved now.

## What Changes

- Add a singleton **Y2K Patch** app. It opens from the desktop and from Start > Programs.
- The player types one shared code of about 10 letters or digits. The expected code comes from `VITE_Y2K_PATCH_CODE`, default `Y2KPATCH99`.
- A wrong code shows a Windows 98-style error in the window and leaves the field editable. There is no lockout.
- A correct code plays a short install sequence, then a desktop-wide message that the system was saved before midnight. The same browser tab remembers that success in `sessionStorage`.
- The code reader is one function so a later change can pick a code per office (Argentina, Chile) without rewriting the window.

## Capabilities

### New Capabilities

- `apps/y2k-patch`: Enter the Y2K patch code, reject a wrong code, and confirm a correct code with a desktop-wide success moment.

### Modified Capabilities

- None.

## Impact

- **Layers**: a new app, plus a one-line desktop shortcut in system boot (`zenfs-init.js`). No shell, `public/os-gui`, or `window.System` shape change. Start > Programs appears on its own because the app config sets `category: ""`, which `refreshPrograms` already turns into a shortcut.
- **Files**: `src/apps/y2k-patch/y2k-patch-app.js`, `src/apps/y2k-patch/code.js`, `src/apps/y2k-patch/y2k-patch.css`, `src/apps/y2k-patch/README.md`, `src/apps/y2k-patch/screenshot.png`, `src/system/zenfs-init.js` (one `defaultShortcuts` entry), `src/config/app-registry.js` (generated), `src/apps/README.md`, `e2e/y2k_patch.spec.js`. Icon is the existing `ICONS.key`. No new asset.
- **Blast radius** (`graphify affected` on `zenfs-init.js`): imported by `os-init.js` / `initializeOS` and `main.js`. The edit only writes `Y2K Patch.lnk.json` when that file is missing. Other shortcuts and apps are unchanged.
- **Persistence**: no new `localStorage` key and no ZenFS user data. `sessionStorage` key `y2k-patch-applied` records success for the tab. The expected code is a build-time env var and is visible in the client bundle until a later server-side check exists.
- **Authenticity**: a small fixed utility window, a plain text field, an OK button, and a system-style error. The success moment uses the desktop grays, a progress bar, and the existing title-bar look. It does not restyle the OS.

## Non-goals

- Showing or hiding the app when a game session starts.
- Per-office or per-team codes. The reader is shaped so an office id can select a code later.
- Collecting the eight story records inside this app. Teams bring the final code from the other challenges.
- Merging or depending on the `improving-challenge` branch.
- A backend, hashing, or hiding the code from the page source.
- New sounds, icons, or a countdown that actually deletes files.
