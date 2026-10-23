# Tasks

Prerequisite: `add-ct-station-engine` is implemented. Baseline: use the result recorded in that change. The clue image was received (1024x576 PNG, 954 KB) and is at `/tmp/ct-assets/argentina-clue.png`; copy it unchanged to `src/apps/improving-ct-october/stations/assets/argentina-clue.png` in task 2.1.

## 1. Failing e2e spec (RED)

- [x] 1.1 Add `e2e/ct_station_argentina.spec.js` with the cases of design decision 6 (clue present for Argentina and Recycle Bin icon full, restore and open in the image viewer, removed on finish including the restored copy, Chile and no-session untouched, one item after reload, pre-existing bin item untouched, normal delete and restore unchanged). Use the CT mock and real ZenFS. Run it and confirm it fails because the station does not exist.

## 2. Station

- [x] 2.1 Add the clue image to `src/apps/improving-ct-october/stations/assets/` (copy `/tmp/ct-assets/argentina-clue.png` unchanged) and note its size and extension in the commit body.
- [x] 2.2 Create `src/apps/improving-ct-october/stations/argentina-recycle.js` per design decisions 1 to 3 (fixed id, idempotent `apply`, `remove` from the manifest, name and location constants). No new comments.
- [x] 2.3 Register it for `argentina` in `src/apps/improving-ct-october/stations/registry.js` (design decision 5).

## 3. Docs

- [x] 3.1 Add Argentina's station to the "Stations" section of `src/apps/improving-ct-october/README.md`.

## 4. Verification

- [x] 4.1 Run `bun x playwright test e2e/ct_station_argentina.spec.js e2e/ct_stations.spec.js` and confirm all pass (GREEN).
- [x] 4.2 Re-run `e2e/improving_ct_october.spec.js`, `e2e/y2k_patch.spec.js`, `e2e/msn_messenger.spec.js`, `e2e/fotolog.spec.js`, `e2e/winamp.spec.js`, `e2e/msn_app_links.spec.js` and the explorer and desktop specs; no previously passing case may fail.
- [x] 4.3 Manual check against the real local API (local Postgres only, never RDS; own Vite port 5180 so the user's `:5173` server is untouched): start as an Argentina team, find the image in the Recycle Bin, restore it, open it, finish with the patch code, confirm everything is gone; repeat as a Chile team and confirm the Recycle Bin is untouched. Screenshots of the full Recycle Bin and of the restored image.

## 5. Final validation

- [x] 5.1 Run `bun run build` (restore the unrelated `report-a-bug` category if `build:registry` strips it), then `graphify update .`.
- [x] 5.2 Commit as Gustavo only, with no `Co-authored-by` trailer. Message: `feat(ct): hide a clue image in the Recycle Bin for Argentina`. Verify `git log -1` shows that author and no co-author line.
