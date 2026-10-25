# Proposal

## Why

Two more Chile clues: (1) a Recycle Bin with four files where `BACKUP_2359.TXT` is the right one; (2) a Y2K puzzle with `ERROR.LOG` and `MEMORY.TXT` where the team uses Calculator (`2000 - 1998 = 2`) to pick memory 2.

## What Changes

- Station `recycle-clue` for `chile`: the Recycle Bin shows `VACACIONES_1998.BMP`, `TAREA_FINAL_FINAL.DOC`, `NO_ABRIR.TXT` and `BACKUP_2359.TXT`, restorable to `C:\My Documents`, with deletion times. Removed (including restored copies) when the session stops. It reuses the shared Recycle Bin helpers of the Argentina station (extracted to `stations/lib/recycle.js`).
- Station `y2k-memory` for `chile`: `C:\My Documents\SYSTEM\ERROR.LOG` and `MEMORY.TXT` with the supplied texts. The folder is removed when the session stops. `C:\THROWBACK` files are untouched.
- No server, MSN or nginx change.

## Capabilities

### Modified Capabilities

- `apps/ct-station-chile`.

## Impact

- **Layers**: app (stations), a refactor inside the stations folder (shared recycle helper), tests, README. Argentina's recycle behavior must be byte-identical after the extraction (its spec reruns).
- **Files**: `stations/lib/recycle.js`, `stations/argentina-recycle.js`, `stations/chile-recycle.js`, `stations/chile-y2k.js`, `registry.js`, `e2e/ct_station_chile_clues.spec.js`, README.
- **Persistence**: ZenFS only (`/C:/Recycled`, `/C:/My Documents/SYSTEM`), recorded in the engine marker.
- **EC2**: win98-web image only.

## Non-goals

- Changing the Recycle Bin app; a calculator hint.
