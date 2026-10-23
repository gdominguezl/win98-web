# Design

## Context

See proposal.md for why. A new app is `src/apps/<id>/<id>-app.js` extending `Application`, with a plain `static config` literal. `bun run build:registry` copies that literal into `src/config/app-registry.js`. Desktop shortcuts that are missing are created from the `defaultShortcuts` list in `src/system/zenfs-init.js`. Start > Programs is filled by `refreshPrograms` for every app whose `category` is set, including `""`. The window is a native `$Window`, not an iframe. The icon is the existing `ICONS.key`. `graphify affected` on `zenfs-init.js` shows only boot (`os-init.js`, `main.js`).

## Goals / Non-Goals

**Goals:** One small window, one code check, one desktop success moment, one tab-scoped "already installed" state.

**Non-Goals:** See proposal. Also: no change to `local-storage.js`, `application.js`, or `public/os-gui`.

## Decisions

**1. App id `y2k-patch`.** Config literal:

```javascript
static config = {
  id: "y2k-patch",
  title: "Y2K Patch",
  description: "Install the patch before midnight.",
  icon: ICONS.key,
  category: "",
  width: 360,
  height: 200,
  resizable: false,
  isSingleton: true,
}
```

`category: ""` is what puts it directly under Start > Programs. Desktop entry: `{ name: "Y2K Patch.lnk.json", appId: "y2k-patch" }` in `defaultShortcuts`. No file association. No iframe.

**2. Code module `src/apps/y2k-patch/code.js`.** `getExpectedCode()` reads `import.meta.env.VITE_Y2K_PATCH_CODE` and falls back to `Y2KPATCH99`. `codesMatch(input)` compares after uppercasing and removing spaces and dashes. This function is the only reader of the env var. A later office (Argentina, Chile) selects a code inside this function. The window does not change. Alternative rejected: `sessionStorage` for the expected code, because a new tab would have no code to check. Alternative rejected: importing the `improving-challenge` generator, because this deliverable is one shared code.

**3. Success flag in `sessionStorage`, key `y2k-patch-applied`, value `1`.** Not `LOCAL_STORAGE_KEYS`. A new tab asks again. Missing or any other value means not installed. The window reads the flag on open. After a correct code it writes the flag, then runs the sequence.

**4. Wrong code stays in the window.** A sunken status line under the field says the code was not accepted. No `ShowDialogWindow`, no lockout, no counter. Enter on the field clicks OK.

**5. Desktop sequence.** On success, append one overlay to `#screen` (not the browser Fullscreen API). It uses the existing window grays and a progress bar for about two seconds, then the line that the patch is installed and files, memories, and messages will survive midnight. An OK button removes the overlay. The patch window switches to an "already installed" view with no field. If the window closes mid-sequence, the timer is cleared and the overlay is removed. Reopening in the same tab shows the installed view and does not replay the overlay. No new sound file.

**6. Tests.** `e2e/y2k_patch.spec.js` boots the real app. It checks the desktop icon and Start > Programs, a wrong code, Enter and OK with `Y2KPATCH99` (and one loose spelling), the overlay text, reopen-in-tab, a second page that asks again, and a short viewport where the title bar and OK stay visible. No unit test runner.

## Risks / Trade-offs

- **[Risk] The expected code is in the client bundle.** → Accepted until a later server check. Facilitators change `VITE_Y2K_PATCH_CODE` and rebuild.
- **[Risk] `build:registry` rewrites `app-registry.js` and can drop unrelated drift such as `report-a-bug`'s `category`.** → Keep only the new `y2k-patch` block.
- **[Risk] A 360x200 window is still tall on a very short browser.** → The window is fixed and short. The short-viewport e2e case guards the title bar and OK button.
- **[Trade-off] `sessionStorage` does not survive a new tab.** That is the chosen behavior.

## Migration Plan

No data migration. Shipping adds a shortcut only when `Y2K Patch.lnk.json` is absent. Rollback is reverting the app and the shortcut line. A desktop that already wrote the shortcut keeps the file. `refreshPrograms` removes the Programs shortcut if the app id is gone.
