# Tasks

Reference image: the user's screenshot of the intended "Installation complete" window.

## 1. Discovery
- [x] 1.1 Confirm the `$Window` resize/re-center API in `public/os-gui/` and which pixel font is registered with `@font-face`; record both in the design.

## 2. Failing e2e specs (RED)
- [x] 2.1 Update `e2e/y2k_patch.spec.js` and `e2e/improving_ct_october.spec.js` per design decision 8 (remove overlay message/OK assertions; add the new screen, size, no-code and Finish assertions). Run them and confirm the new assertions fail.

## 3. Implementation
- [x] 3.1 Draw `assets/globe.svg` and `assets/fireworks.svg` (one-off generator script, committed SVG only).
- [x] 3.2 Add the `SUCCESS_HTML` view, styles, resize and Finish in `y2k-patch-app.js` / `y2k-patch.css`; remove the overlay message and OK; enlarge the overlay text.
- [x] 3.3 Save screenshots (install overlay, success window at 1440x900 and on a short viewport, with the finale panel visible) and compare them with the reference image.

## 4. Docs and verification
- [x] 4.1 Update `src/apps/y2k-patch/README.md` and its screenshot.
- [x] 4.2 Run `y2k_patch`, `improving_ct_october` and the `ct_station_*` specs; MSN, Fotolog and Winamp specs only to confirm no change. `openspec validate improve-y2k-patch-success-window --type change --strict`.
