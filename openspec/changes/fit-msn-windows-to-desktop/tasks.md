# Tasks

Baseline: before editing, run `bun x playwright test e2e/msn_messenger.spec.js e2e/fotolog.spec.js e2e/winamp.spec.js e2e/msn_app_links.spec.js` on the current tree and keep the result (known failing: `winamp.spec.js` classic Webamp case, which depends on unpkg.com and archive.org). The full-suite baseline is the last run, 49 passed / 25 failed (24 older failures plus the Webamp case).

## 1. Failing e2e specs (RED)

- [ ] 1.1 Read the existing assertions of the four specs above and list those that depend on window position or on Winamp's 640x480 size (for example `e2e/winamp.spec.js` 640x480 case). Record the list in the commit body or a note.
- [ ] 1.2 Update `e2e/winamp.spec.js`: at 1440x900 the iframe bounding box is 901x592 (within 1 px) and the window is not maximized.
- [ ] 1.3 Add small-viewport cases (decision 6): at 1280x600, for MSN, Fotolog and Winamp the window box is inside `#desktop-area` and above the `.taskbar`; at 1440x900 MSN is 529x796 and Fotolog 1024x768; at 800x400 sizes are limited without errors and not below 240 px; maximize then restore returns to the fitted size. Put MSN cases in `e2e/msn_messenger.spec.js`, Fotolog in `e2e/fotolog.spec.js`, Winamp in `e2e/winamp.spec.js`. Run them and confirm they fail for the right reasons.

## 2. Shared helper and app config

- [ ] 2.1 In `src/shared/utils/msn-frame.js`: pass `innerWidth` and `innerHeight` from `app.config` to `$Window` when present, else `outerWidth` and `outerHeight` as now.
- [ ] 2.2 In the same file add the fit step (design decisions 1 and 2): measure `#desktop-area`, limit the outer size with a 240 px floor, then position the window centered inside the area. Do nothing if `#desktop-area` is missing. No new comments.
- [ ] 2.3 In `src/apps/winamp/winamp-app.js` set `innerWidth: 901` and `innerHeight: 592` and remove `width` and `height` from the config literal; grep for other readers of `app.width` and `app.height` and stop and report if any exist for Winamp.
- [ ] 2.4 Run `bun run build:registry`; keep only the `winamp` block change in `src/config/app-registry.js` (revert the unrelated `report-a-bug` drift).

## 3. Docs

- [ ] 3.1 Update `src/apps/winamp/README.md` (size 901x592 content area, fit to the desktop, remove the scrolls-by-default note) and add a short fit-to-desktop sentence to the MSN Messenger and Fotolog READMEs.

## 4. Verification

- [ ] 4.1 Run `bun x playwright test e2e/msn_messenger.spec.js e2e/fotolog.spec.js e2e/winamp.spec.js e2e/msn_app_links.spec.js` and confirm everything passes except the known Webamp case.
- [ ] 4.2 Manual headless check at 1280x600 and 1366x768 with screenshots of the three windows showing the bottom edge above the taskbar, and Winamp at 1440x900 against the real MSN CSS if the MSN dev server is available (confirm the desktop layout without scrolling).
- [ ] 4.3 After deploy (operator step): check on a 13 inch laptop or a short browser window that MSN, Fotolog and Winamp are fully visible, and that Winamp shows player, playlist and effects without scrolling.

## 5. Final validation

- [ ] 5.1 Run `bun run build`.
- [ ] 5.2 Run `bun run test` and compare with the baseline: nothing that passed now fails.
- [ ] 5.3 Run `graphify update .`.
- [ ] 5.4 Commit with `feat(msn-frame): fit MSN-family windows to the desktop and size Winamp to 901x592`.
