# Tasks

## 1. Failing e2e spec (RED)
- [x] 1.1 `e2e/ct_minesweeper_challenge.spec.js`: board size per office, locked menu, win reveal (use a seeded/forced board or cheat hook through the game object, as existing minesweeper specs do), taunts from the third loss, win resets count, removal restores normal behavior, no-session untouched. Confirm it fails.

## 2. Minesweeper
- [x] 2.1 Add `src/apps/minesweeper/challenge.js` and wire `minesweeper-app.js` per the design; with `null` config the app is byte-for-byte equivalent in behavior. Run the existing Minesweeper specs and confirm baseline.

## 3. Stations
- [x] 3.1 Add `stations/minesweeper.js` (parametrized by office) and register it for both offices.

## 4. Docs and verification
- [x] 4.1 README (`improving-ct-october` and `minesweeper`). Run the new spec, existing minesweeper and `ct_*` specs; MSN/Fotolog/Winamp only for unchanged status. `openspec validate add-ct-minesweeper-challenge --type change --strict`.
