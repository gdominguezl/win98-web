# Facilitator guide — Chile session

SPOILERS. Everything a Chile team can find while its session runs, what each
clue means, and what disappears when the session ends. Sources:
`src/apps/improving-ct-october/stations/` and `openspec/specs/apps/ct-station-chile/`.

## Session lifecycle

- Stations apply the moment the team presses **Start** and the session goes
  `running` on the server.
- Everything below is removed when the session stops running: the patch is
  accepted in Y2K Patch, the admin restarts or resets the team (Restart /
  Reset all), or the team clicks **Start a new game**.
- Applied artifacts are tracked in `/C:/.ct_stations.json`; leftovers are
  cleaned at boot on a tab with no team session.
- Sessions live in `sessionStorage` per browser tab — a tab that was open
  before an update (or a session that was reset server-side) must sign in
  again before the station engine reapplies anything.

## Stations

| id | File | What it is |
|---|---|---|
| `focus-mode` | `stations/focus-mode.js` | Focus mode: hides non-essential apps and pins MS-DOS Prompt first in Programs |
| `throwback-folder` | `stations/chile-throwback.js` | `C:\THROWBACK` + MS-DOS session behavior |
| `morse-file` | `stations/chile-morse.js` | `MORSE.TXT` in My Documents |
| `recycle-clue` | `stations/chile-recycle.js` | Four dated decoys in the Recycle Bin |
| `y2k-memory` | `stations/chile-y2k.js` | `SYSTEM\ERROR.LOG` + `MEMORY.TXT` puzzle |
| `paint-puerta` | `stations/chile-paint.js` | `PUERTA.BMP` hidden-message image |
| `minesweeper` | `stations/minesweeper.js` | Locked Minesweeper challenge |

### Focus mode — `focus-mode`

Same shared station as Argentina: while the session runs it hides
non-essential apps (Agent, App Maker, Cursor Explorer, Desktop Themes,
Diablo, DOS Games Downloader, Doom, Flash Player, Media Player, Quake,
Commander Keen, Report a Bug, Sound Scheme Explorer, Task Manager) from
the desktop, the Games folder and Programs, hides Network Neighborhood,
drops empty Programs folders (Entertainment, System Tools) and pins
**MS-DOS Prompt** first under Programs. Buy me a coffee is always hidden.
Everything is restored when the session ends or is restarted; `C:\` files
are untouched.

### C:\THROWBACK + MS-DOS — `throwback-folder`

- **Where:** `C:\THROWBACK` (Explorer or `DIR \THROWBACK`; new MS-DOS Prompt
  windows open at `C:\>` so `CD THROWBACK` works immediately).
- **What the team sees:** `PLANO.TXT` (a colored ANSI drawing — a telephone
  plan that clears the screen and draws itself when typed), `MEMORY.TXT`
  ("MEMORY BANK UNAVAILABLE. ACCESS RESERVED FOR FINAL DIAGNOSTIC.") and
  `ERROR.LOG` (a clock-desync log, last entry "23:59 — AGE CALCULATION
  FAILED"). `HELP` prints a short Spanish help block; `DIR`, `CD` and `TYPE`
  accept any letter case.
- **Intended solution:** the PLANO.TXT telephone drawing is the kitchen-clue
  pointer in this station. *Facilitator to confirm: the exact physical
  location the telephone plan leads to.*
- **Cleanup:** the folder (and anything the team put inside) is removed;
  `HELP` and the start directory return to normal.

### MORSE.TXT — `morse-file`

- **Where:** `C:\My Documents\MORSE.TXT`, opens in Notepad.
- **What the team sees:** a Morse alphabet table, reading instructions, and
  three numbered transmissions.
- **Intended solution:** decoding gives `01 → COCINA` (kitchen),
  `02 → TELEVISOR` (television), `03 → ENTRADA` (entrance) — three physical
  locations to search in the office.
- **Cleanup:** the file is removed.

### Recycle Bin — `recycle-clue`

- **Where:** the Recycle Bin on the desktop (icon turns full). Four items,
  all "deleted" on 1999-12-31 between 23:41 and 23:59.
- **What the team sees:** `VACACIONES_1998.BMP` (a picture, restorable to
  `C:\My Documents`), `TAREA_FINAL_FINAL.DOC`, `NO_ABRIR.TXT` (a joke decoy:
  "No hay nada aqui. Te lo dije.") and `BACKUP_2359.TXT` — the real clue.
  `BACKUP_2359.TXT` reads: "No todas las papeleras guardan archivos. Mi
  version fisica recibe aquello que ya no necesitamos. Busca el lugar donde
  la oficina descarta o recicla sus residuos." — pointing the team to the
  office's physical trash/recycling spot.
- **Intended solution:** only `BACKUP_2359.TXT` matters; the other three are
  decoys. The team restores it (context menu > Restore) and goes to the
  physical waste basket.
- **Cleanup:** all four bin items, their metadata and any restored copies
  are removed; pre-existing user items in the bin are never touched.

### Y2K memory puzzle — `y2k-memory`

- **Where:** `C:\My Documents\SYSTEM\` with `ERROR.LOG` and `MEMORY.TXT`.
- **What the team sees:** `ERROR.LOG` reports a "Y2K AGE CALCULATION
  FAILURE": SYSTEM CREATED: 1998, CURRENT SYSTEM YEAR: 2000, REPORTED
  AGE: 100 — and asks to CALCULATE THE TRUE SYSTEM AGE and USE THE RESULT TO
  RECOVER THE CORRECT MEMORY. `MEMORY.TXT` lists four memories:
  `MEMORIA 1` (a place where everyone cooks and talks — kitchen),
  `MEMORIA 2` (when noise invades, someone closes a door and works in a
  space they don't share — a private office), `MEMORIA 3` (where visitors
  announce their arrival — reception), `MEMORIA 4` (storage).
- **Intended solution:** the "true age" is `2000 - 1998 = 2` (Calculator),
  so the correct memory is `MEMORIA 2` → the **private office**
  (`OFICINA PRIVADA` — the answer text deliberately never appears in the
  files or the code).
- **Cleanup:** the whole `SYSTEM` folder is removed.

### PUERTA.BMP — `paint-puerta`

- **Where:** `C:\My Documents\PUERTA.BMP`; double-clicking opens Paint.
  While the session runs, Paint's File > Open dialog already preselects the
  `24-bit Bitmap (*.bmp;*.dib)` type so the file is listed without changing
  the filter.
- **What the team sees:** an apparently blank white image.
- **Intended solution:** flood the background with Paint's **Fill With
  Color** tool — the hidden message appears:
  "BUSCA A QUIEN CUIDA QUIÉN ENTRA Y QUIÉN SALE" with a doorbell sketch,
  pointing to the concierge/reception — the person who watches who comes in
  and who goes out.
- **Cleanup:** the file is removed (including any edits the team saved over
  it) and Paint's Open dialog returns to its default type.

### Minesweeper — `minesweeper`

- **Where:** the normal Minesweeper app, locked to a 6x6 board with 4 mines
  (difficulty choices disabled).
- **What the team sees:** taunts from the third consecutive loss; on a win,
  a dialog reading **`SECTOR DESBLOQUEADO: BODEGA`** instead of the
  high-score prompt — "unlocked sector: warehouse/storage room".
- **Intended solution:** win the locked board → the bodega (storage room)
  is the physical place to search next.
- **Cleanup:** the challenge config is reset; Minesweeper behaves normally
  again.

## Physical clue chain (as implemented)

| Clue | Points to |
|---|---|
| MORSE.TXT transmissions | COCINA / TELEVISOR / ENTRADA |
| BACKUP_2359.TXT | the physical waste/recycling basket |
| Y2K MEMORIA 2 | the private office |
| PUERTA.BMP | the concierge / reception |
| Minesweeper BODEGA | the storage room |

*Facilitator to confirm: the exact office locations and what the team
physically finds at each (the code fragments or objects planted there), and
how they assemble into the Y2K patch code.*
