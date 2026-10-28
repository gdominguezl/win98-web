# Station reference

A station is a module under `src/apps/improving-ct-october/stations/` that
materializes part of the game while a team's session is running and removes
it when the session stops. All paths below are relative to
`src/apps/improving-ct-october/stations/` unless noted.

## Station tables

### Argentina

| id | Module | Creates | Cleanup (`remove`) |
|---|---|---|---|
| `focus-mode` | `focus-mode.js` | In-memory focus mode via `src/system/app-visibility.js`: hides non-essential apps from the desktop, Games folder and Start menu, hides the virtual Network Neighborhood icon, and pins MS-DOS Prompt first in Programs | Resets the visibility state + `desktop-refresh` |
| `recycle-clue` | `argentina-recycle.js` | Recycle Bin item `ct-argentina-clue` holding `IMG_0001.png` (asset `assets/argentina-clue.png`), metadata entry with `originalPath` `/C:/My Documents/IMG_0001.png` | Deletes the bin item, its metadata key and the restored copy; refreshes the bin icon |
| `throwback-folder` | `argentina-throwback.js` | `C:\THROWBACK\{MEMORY.TXT, ERROR.LOG, PLANO.TXT}` (assets `argentina-{memory.txt,error.log,plano.txt}`), `C:\WINDOWS\Desktop\HELP_PANTALLA.TXT` (asset `argentina-help.txt`), `HELP` override (short text, `argentina-help-dos.txt`), start-dir override `C:\` | Empties and removes the folder, unlinks the desktop file + `desktop-refresh`, resets both overrides |
| `signals-file` | `argentina-signals.js` | `C:\WINDOWS\Desktop\Communication System.txt` (asset `argentina-signals.txt`) | Unlinks it + `desktop-refresh` |
| `minesweeper` | `minesweeper.js` | Locked Minesweeper board 9x9/10, win dialog `Codigo: 1`, taunts from the 3rd consecutive loss (`src/apps/minesweeper/challenge.js`) | `setMinesweeperChallenge(null)` — normal game restored |

### Chile

| id | Module | Creates | Cleanup (`remove`) |
|---|---|---|---|
| `focus-mode` | `focus-mode.js` | Same focus mode as Argentina (shared module) | Same |
| `throwback-folder` | `chile-throwback.js` | `C:\THROWBACK\{PLANO.TXT, MEMORY.TXT, ERROR.LOG}` (asset `assets/plano.txt`), Spanish `HELP` override, start-dir override `C:\` | Empties and removes the folder, resets both overrides |
| `morse-file` | `chile-morse.js` | `C:\My Documents\MORSE.TXT` (asset `chile-morse.txt`; decodes to COCINA / TELEVISOR / ENTRADA) | Unlinks it |
| `recycle-clue` | `chile-recycle.js` | Four bin items `ct-chile-1..4` (`VACACIONES_1998.BMP`, `TAREA_FINAL_FINAL.DOC`, `NO_ABRIR.TXT`, `BACKUP_2359.TXT`), all `originalPath` under `C:\My Documents`, deletionDate 1999-12-31 23:41–23:59 | Removes each item + metadata + restored copies |
| `y2k-memory` | `chile-y2k.js` | `C:\My Documents\SYSTEM\{ERROR.LOG, MEMORY.TXT}` | Removes both files and the `SYSTEM` folder |
| `paint-puerta` | `chile-paint.js` | `C:\My Documents\PUERTA.BMP` (asset `puerta.bmp`, near-white hidden message); `setPaintOpenDefault("bmp")` so File > Open preselects 24-bit Bitmap | Unlinks it; `setPaintOpenDefault(null)` |
| `minesweeper` | `minesweeper.js` | Locked Minesweeper board 6x6/4, win dialog `SECTOR DESBLOQUEADO: BODEGA`, taunts from the 3rd consecutive loss | `setMinesweeperChallenge(null)` |

`focus-mode` hides these app ids: `desktop-themes`, `agent`, `diablo`,
`keen`, `doom`, `quake`, `app-maker`, `dos-games-downloader`,
`task-manager`, `report-a-bug`, `cursor-explorer`, `sound-scheme-explorer`,
`flash-player` and `media-player`, plus the virtual `Network Neighborhood`
desktop item. `buy-me-a-coffee` is hidden at all times (session or not).
The filter lives in `src/system/app-visibility.js` and is applied while
reading `/Desktop` (desktop and Games folder) and the Start Menu
directories; raw disk folders like `C:\` are unaffected. The Start menu
rebuilds on open and the desktop listens for the `desktop-refresh` event,
so changes apply live.

The per-office lists live in `registry.js`. Shared Recycle Bin plumbing is in
`stations/lib/recycle.js`; the Paint hook is in
`src/apps/paint/challenge.js` + `paint-app.js`.

## Engine contract

Source: `stations/engine.js`.

- A station module exports `id`, `apply(ctx)` and `remove(ctx, manifest)`.
  `ctx` is `{ fs, office }` (`fs` is the ZenFS instance).
- `apply` must be **idempotent** — the engine re-runs it on every page load
  while the session runs — and returns a JSON-serializable manifest of what
  it created.
- `remove` deletes exactly what the manifest describes and must tolerate
  missing files (the team may have deleted or moved things).
- The engine applies stations only while a team session is `running`;
  finished/stopped sessions trigger `remove` for every applied station.
- Applied manifests are recorded in `/C:/.ct_stations.json` (the "marker");
  a boot with a marker but no team session removes the leftovers.
- `registry.js` exports `STATIONS = { argentina: [...], chile: [...] }`;
  entries are `{ id, load: () => import("./<name>.js") }` so each station is
  code-split and fetched only for its office.
- Binary assets are bundled under `stations/assets/` and imported inside the
  station module with `?url` (fetched) or `?raw` (inline text); the
  `writeVerified` helper (re-read + byte-compare + retry) guards against
  racy ZenFS writes.

## Adding a station

1. Create `stations/<name>.js` implementing the contract above.
2. Add `{ id: "<station-id>", load: () => import("./<name>.js") }` to the
   office's list in `registry.js`.
3. Add any assets under `stations/assets/` (`.log` files are gitignored —
   `git add -f`).
4. Write an e2e spec `e2e/ct_station_*.spec.js` using `e2e/ct-mock.js`
   (mock API) with the **real** ZenFS and Recycle Bin — no mocks of
   `window.System` or `window.fs`. Existing specs are the templates.
5. Expect to update marker assertions in `e2e/ct_stations.spec.js` (the
   marker records each applied station incrementally — poll for the full
   key set).
