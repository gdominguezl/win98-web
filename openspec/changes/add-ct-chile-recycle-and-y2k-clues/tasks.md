# Tasks

## 1. Failing e2e spec (RED)
- [ ] 1.1 `e2e/ct_station_chile_clues.spec.js`: bin items and times, restore and open BACKUP_2359.TXT, decoys, Y2K files verbatim, no answer text anywhere, THROWBACK unchanged, cleanup on finish/restart, Argentina/no-session untouched, reload keeps them. Confirm it fails.

## 2. Refactor
- [ ] 2.1 Extract `stations/lib/recycle.js` from `argentina-recycle.js`; run `e2e/ct_station_argentina.spec.js` and confirm it passes unchanged.

## 3. Stations
- [ ] 3.1 Add `chile-recycle.js` and `chile-y2k.js`; register them.

## 4. Docs and verification
- [ ] 4.1 README. Run the new spec, all `ct_*` specs; MSN/Fotolog/Winamp only for unchanged status. `openspec validate add-ct-chile-recycle-and-y2k-clues --type change --strict`.
