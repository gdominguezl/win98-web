# Tasks

Prerequisite: engine, Argentina recycle and Chile throwback changes are implemented (they are). Assets are in `~/Downloads/Archivos Argentina/MS-DOS/`.

## 1. Failing e2e spec (RED)
- [x] 1.1 Add `e2e/ct_station_argentina_dos.spec.js`: folder with exactly three files and byte-exact contents, `HELP` text and `CLS`, no help file, `CD THROWBACK` from a new prompt, removal on finish/restart, `HELP` and start directory back to default, Chile and no-session untouched, reload keeps the clue. Confirm it fails.

## 2. System
- [x] 2.1 Add `setStartDirOverride` to `src/system/dos-shell.js` (default unchanged); run `e2e/command_prompt_zenfs.spec.js` and confirm baseline.

## 3. Station
- [x] 3.1 Copy the four supplied files byte for byte into `stations/assets/` and create `argentina-throwback.js` per the design; register it in `registry.js`. Also make `chile-throwback.js` set and clear the start directory (add a Chile scenario to the spec and keep `ct_station_chile.spec.js` passing).
- [x] 3.2 Check `PLANO.TXT` fits the 640x480 prompt (screenshot) and report if not.

## 4. Docs and verification
- [x] 4.1 Document the station in `src/apps/improving-ct-october/README.md`.
- [x] 4.2 Run the new spec, `ct_stations`, `ct_station_argentina`, `ct_station_chile`, `command_prompt_zenfs`; MSN, Fotolog and Winamp specs only to confirm no change in results. `openspec validate add-ct-argentina-dos-challenge --type change --strict`.
