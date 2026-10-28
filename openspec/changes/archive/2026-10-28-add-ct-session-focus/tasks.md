# Tasks

## 1. Failing e2e spec (RED)
- [x] 1.1 `e2e/ct_session_focus.spec.js`: for Argentina and Chile sessions check the desktop (hidden/visible items), the Games folder, the Programs menu (hidden entries, empty folders removed, MS-DOS Prompt first), restore on finish/restart, a tab with no session sees everything and the original order, and Buy me a coffee absent everywhere including a profile with the stored shortcut. Confirm it fails.

## 2. System and shell
- [x] 2.1 Add `src/system/app-visibility.js` (design decision 1) and verify the hidden ids against `app-registry.js`.
- [x] 2.2 Apply the filter in `getMenuFromZenFS` (hidden, empty folders, pin) and in the Desktop/Games readers; trigger live refresh. With the default state results must be identical to today.
- [x] 2.3 Drop the category of Buy me a coffee in `app-registry.js`.
- [x] 2.4 Run the existing Start menu, desktop, Explorer and games specs and confirm their baseline status is unchanged.

## 3. Station
- [x] 3.1 Add `stations/focus-mode.js` with the single list of ids and register it for both offices in `stations/registry.js`; update the marker assertions in `ct_stations.spec.js`.

## 4. Docs and verification
- [x] 4.1 README sections for the focus station and the visibility module; update the session docs in `docs/game-sessions` (what is hidden and that MS-DOS Prompt is first).
- [x] 4.2 Run the new spec and all `ct_*` specs; MSN, Fotolog and Winamp specs only to confirm no change. `openspec validate add-ct-session-focus --type change --strict`.
