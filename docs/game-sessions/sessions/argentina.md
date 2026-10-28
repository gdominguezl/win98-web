# Facilitator guide — Argentina session

SPOILERS. Everything an Argentina team can find while its session runs, what
each clue means, and what disappears when the session ends. Sources:
`src/apps/improving-ct-october/stations/` and `openspec/specs/apps/ct-station-argentina/`.

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
| `recycle-clue` | `stations/argentina-recycle.js` | A deleted clue image in the Recycle Bin |
| `throwback-folder` | `stations/argentina-throwback.js` | `C:\THROWBACK` + MS-DOS session behavior |
| `signals-file` | `stations/argentina-signals.js` | Morse reference file on the desktop |
| `minesweeper` | `stations/minesweeper.js` | Locked Minesweeper challenge |

### Focus mode — `focus-mode`

- **What the team sees:** the moment the session starts, the desktop and
  Start menu are trimmed to what the game needs. Agent, App Maker, Cursor
  Explorer, Desktop Themes, Diablo, DOS Games Downloader, Doom, Flash
  Player, Media Player, Quake, Commander Keen, Report a Bug, Sound Scheme
  Explorer and Task Manager disappear from the desktop, the Games folder
  and Programs; Network Neighborhood goes too; empty Programs folders
  (Entertainment, System Tools) disappear and **MS-DOS Prompt** is pinned
  first under Programs. Buy me a coffee is hidden at all times. Everything
  is restored when the session ends or is restarted. Files on `C:\` are
  untouched.

### Recycle Bin — `recycle-clue`

- **Where:** the Recycle Bin on the desktop (icon turns full). One item,
  `IMG_0001.png`, "deleted" from `C:\My Documents`.
- **What the team sees:** a deleted image. Restoring it (context menu >
  Restore) puts it back in `C:\My Documents`, where double-clicking opens it
  in the image viewer. It is a Fotolog screenshot (the visual clue).
- **Intended solution / where it leads:** *Facilitator to confirm: what the
  Fotolog screenshot points to (the physical or in-system destination the
  image is meant to reveal).*
- **Cleanup:** the bin item, its metadata and the restored copy in
  `C:\My Documents` are all removed; the Recycle Bin icon goes empty again
  (unless the team had recycled files of its own, which are never touched).

### C:\THROWBACK + MS-DOS — `throwback-folder`

- **Where:** `C:\THROWBACK`, visible in Explorer or `DIR \THROWBACK`.
- **What the team sees:**
  - `MEMORY.TXT` — "EL TITULO QUE NUNCA FUE", a short memoir about learning
    MS-DOS that ends by telling the reader this text will not help find the
    next clue (a decoy/mood piece).
  - `ERROR.LOG` — a fake Y2K diagnostics log ending in
    "ERROR 1999: YOU ARE LOOKING IN THE WRONG PLACE." (also a decoy).
  - `PLANO.TXT` — ANSI art of a telephone/switchboard drawing with a labeled
    sector code at the bottom (typing it clears the screen and draws it in
    color; fits the default window).
  - MS-DOS behavior while the session runs: new MS-DOS Prompt windows start
    at `C:\>` (not `C:\WINDOWS>`), `HELP` prints a short five-command help
    screen, and `DIR` / `CD` / `TYPE` accept any letter case.
  - `HELP_PANTALLA.TXT` on the desktop — the full MS-DOS command reference
    (with the `EXAMPLES` section), opens in Notepad.
- **Intended solution / where it leads:** *Facilitator to confirm: what
  PLANO.TXT's drawing/sector code points to, and how HELP_PANTALLA.TXT is
  meant to be used in the hunt.*
- **Cleanup:** the folder (including any file the team created inside) and
  `HELP_PANTALLA.TXT` are removed; `HELP`, the start directory and
  case-sensitivity return to normal.

### Desktop Morse reference — `signals-file`

- **Where:** `C:\WINDOWS\Desktop`, shown as the desktop icon
  `Communication System.txt` (the `.txt` extension is visible in the label).
- **What the team sees:** `SIGNALS.TXT`, a Morse alphabet reference and
  reading instructions, opening in Notepad.
- **Intended solution:** the coded Morse message itself is **physical** —
  it is hidden under a desk in the office; decoding it with this reference
  leads the team to the bathroom.
- **Cleanup:** the file and its desktop icon are removed (`desktop-refresh`).

### Minesweeper — `minesweeper`

- **Where:** the normal Minesweeper app.
- **What the team sees:** the board is locked to 8x8 with 10 mines; the Game
  menu difficulty choices are disabled. Losing is normal — from the third
  consecutive loss the app shows taunts (e.g. "sos re troll, intenta de
  nuevo"). Winning shows a dialog: **`Codigo: 1`** instead of the usual
  high-score prompt.
- **Intended solution:** the team must beat the locked board; `Codigo: 1`
  is the reward. *Facilitator to confirm: what `Codigo: 1` refers to (code
  fragment / physical label) and how it combines with the other clues into
  the patch code.*
- **Cleanup:** the challenge config is reset — Minesweeper returns to the
  normal game with difficulty options and the high-score dialog.
