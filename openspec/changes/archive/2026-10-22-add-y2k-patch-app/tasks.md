# Tasks

## 1. Code check

- [x] 1.1 Add `src/apps/y2k-patch/code.js` with `getExpectedCode()` (`VITE_Y2K_PATCH_CODE`, else `Y2KPATCH99`) and `codesMatch()` (case, spaces, and dashes ignored). Verify the file is the only reader of that env var and exports both functions.

## 2. Patch window

- [x] 2.1 Add `e2e/y2k_patch.spec.js` that boots the real app and covers the scenarios in `specs/apps/y2k-patch/spec.md`: desktop icon, Start > Programs, wrong and empty code, Enter and OK, exact and loose `Y2KPATCH99`, overlay text, same-tab installed state, a second page that asks again, and a short viewport where the title bar and OK stay visible. Verify the file asserts those cases. Do not launch the browser yet.
- [x] 2.2 Add `src/apps/y2k-patch/y2k-patch-app.js` and `src/apps/y2k-patch/y2k-patch.css` using the config in `design.md` and `ICONS.key` (no new icon). Add the `Y2K Patch.lnk.json` entry to `defaultShortcuts` in `src/system/zenfs-init.js`. Run `bun run build:registry` and keep only the new `y2k-patch` block in `src/config/app-registry.js`. Verify with `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" bun x playwright test e2e/y2k_patch.spec.js`.

## 3. Docs

- [x] 3.1 Add `src/apps/y2k-patch/README.md` with a `## Screenshot` section and `screenshot.png`, and one row in `src/apps/README.md`. Verify both files exist and the README section heading is present.

## 4. Validation

- [x] 4.1 Run `bun run build`, then the `e2e/y2k_patch.spec.js` command from 2.2, then `graphify update .` from `win98-web`. Verify the build and the spec pass.
- [x] 4.2 Run `bun run dev`, open `/win98-web/`, submit a wrong code and then `Y2KPATCH99`, and confirm the desktop message. Repeat under one other theme. Verify the console has no new errors.
- [x] 4.3 Commit as Gustavo only, with no `Co-authored-by` trailer. Message: `feat(y2k-patch): add the patch window for the office game`. Verify `git log -1` shows that author and no co-author line.

## Workflow follow-up

- Archive `add-y2k-patch-app` after review. Game sessions that show or hide the app are a later change.
