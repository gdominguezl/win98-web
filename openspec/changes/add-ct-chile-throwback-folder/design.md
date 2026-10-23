# Design

## Context

- Station engine (`add-ct-station-engine`): `{ id, apply(ctx) -> manifest, remove(ctx, manifest) }`, applied while the office's team is running, removed when it stops, `apply` re-run once per page load so in-memory effects come back.
- `src/system/dos-shell.js` (`DOSShell`): starts in `/C:/WINDOWS`; `HELP` prints a fixed English list; `DIR`, `CD` and `TYPE` call `resolvePath(path)`, which only normalizes separators (`\` and `/`) and `..` and is case-sensitive, and then use ZenFS (`fs.promises.readdir`, `stat`, `readFile`). `type` reads the file as UTF-8 and writes it with `\n` turned into `\r\n`.
- ZenFS paths are case-sensitive, so `type plano.txt` fails for `PLANO.TXT` today, unlike DOS.
- `e2e/command_prompt_zenfs.spec.js` drives MS-DOS Prompt through the xterm helper textarea with `page.keyboard.type`.

## Goals / Non-Goals

**Goals:** during a Chile session `C:\THROWBACK` and its three files exist, `HELP` shows three simple Spanish lines, and `DIR`, `CD` and `TYPE` work with any letter case; nothing changes for anyone else.

**Non-Goals:** see proposal.

## Decisions

**1. Station `throwback-folder`.** `apply`: `mkdir /C:/THROWBACK` (recursive, ignore exists), write the three files with `writeFile(path, content)` (overwrite, idempotent), then `setHelpOverride(HELP_LINES)`; manifest `{ folder: "/C:/THROWBACK" }`. `remove`: `rm` the folder recursively (ignore not found, so it also removes anything the team added inside) and `setHelpOverride(null)`. Registered as `chile: [{ id: "throwback-folder", load: () => import("./chile-throwback.js") }]`.

**2. File contents (exact, `\n` line endings).**
- `MEMORY.TXT`
```
MEMORY BANK UNAVAILABLE.
ACCESS RESERVED FOR FINAL DIAGNOSTIC.
```
- `ERROR.LOG`
```
23:51 — CLOCK DESYNCHRONIZED
23:54 — AUDIO MEMORY RECOVERED
23:57 — LOCATION MAP CORRUPTED
23:59 — AGE CALCULATION FAILED
```
- `PLANO.TXT`: the telephone drawing supplied by the user (`PLANO.TXT`, 5049 bytes, 20 lines, UTF-8, LF). It is ANSI art, not plain ASCII: it starts with `ESC[0m ESC[2J ESC[H` (reset, clear the screen, cursor home), uses 24-bit colors (`ESC[38;2;R;G;Bm`) and block characters (`█ ▓ ░ ▀ ▄ ▌`), and is at most 72 visible columns wide. It is stored byte for byte as a `.txt` asset imported with `?raw` inside the station module (never reformatted, trimmed or re-encoded) and written with `writeFile`. `TYPE` therefore clears the terminal and draws the picture in color, which is the author's intent; xterm.js supports these sequences.
- Verify that the 640x480 MS-DOS Prompt window shows all 20 lines and 72 columns without wrapping, and that the block characters render in the terminal font (otherwise xterm falls back to another font, which is accepted).
- Verify that the em dash in `ERROR.LOG` renders in the terminal font; if the IBM BIOS font lacks the glyph the xterm falls back to another font, which is accepted. If it renders as a broken glyph, tell the user before changing it.

**3. Help override in the DOS shell.** `dos-shell.js` gets a module variable and an exported setter:
```js
let helpOverride = null;
export function setHelpOverride(lines) { helpOverride = lines; }
```
In `case "help"`, if `helpOverride` is set, write each line followed by `\r\n` instead of the default list. The Chile text is exactly:
```
DIR             Muestra los archivos disponibles.
TYPE ARCHIVO    Abre un archivo de texto.
CD CARPETA      Ingresa a una carpeta.
```
The override is `null` by default, in memory only, set by the station on apply and cleared on remove; the engine re-applies it after a reload. All DOS shells (MS-DOS Prompt windows) share it, which is intended for a computer running a Chile session. The default `HELP` output is untouched when no override is set.
- Alternative: have the station write a hidden `HELP` file. Rejected: `HELP` is a built-in command.
- Alternative: append the three lines to the default list. Not chosen by default; one line in the setter's caller changes it if wanted.

**4. Case-insensitive lookup fallback.** New async method `_findExisting(path)` in `DOSShell`: if `stat(path)` succeeds return `path`; otherwise walk the path segments from the drive root, reading each parent directory and choosing the entry whose lower-cased name equals the lower-cased segment (exact name preferred; if several entries differ only by case, pick the first in name order); return the corrected path, or the original path when any segment has no match. `DIR`, `CD` and `TYPE` call it right after `resolvePath`. Drive mounts and `..` handling are unchanged. No other command changes.
- The corrected path is only used for the lookup; `CD` stores the real on-disk casing as the current directory so the prompt shows `C:\THROWBACK`.
- Alternative: make the whole shell case-insensitive. Rejected: wider blast radius for `COPY`, `REN`, `DEL`, `MD`.

**5. Tests (Playwright, written first)** in `e2e/ct_station_chile.spec.js` with the CT mock and real ZenFS:
- Chile team starts: Explorer or `window.fs` shows `/C:/THROWBACK` with the three files and the exact contents.
- In MS-DOS Prompt: `HELP` prints the three Spanish lines (and not the default list); `DIR \THROWBACK` lists the three files; `CD \THROWBACK` then `TYPE PLANO.TXT`, `type plano.txt`, `TYPE memory.txt` and `TYPE ERROR.LOG` print the contents; `cd throwback` works.
- Finish (patch accepted) or admin restart: folder gone, `HELP` returns to the default list, the prompt reports `Directory not found` for `CD \THROWBACK`.
- Argentina team and no session: no folder and the default `HELP`.
- A file the team created inside `C:\THROWBACK` disappears with the folder.
- Reload during the game: the folder is present once and `HELP` still shows the simple lines.
- `e2e/command_prompt_zenfs.spec.js` and other DOS specs keep their baseline status; case-sensitive exact commands behave as before (a dedicated case checks `DIR` and `TYPE` with exact names).

**6. Docs.** README of the CT window: Chile's station under "Stations". README of the command prompt: help override and case-insensitive fallback in two lines.

## Risks / Trade-offs

- **[Risk] Editing a shared system module (`dos-shell.js`).** → Mitigation: the change is additive (null override, fallback only when the exact path is missing); the existing DOS spec and the new spec cover both paths.
- **[Risk] The help override is global to the page.** → Accepted: one team per computer; removed with the session.
- **[Risk] A player deletes `PLANO.TXT`.** → Accepted; restart plus a new start re-applies it.
- **[Risk] Em dash glyph in the terminal font.** → Checked during the manual step.
- **[Trade-off] Case-insensitive lookup does a few extra `readdir` calls only after a miss.** Negligible.

## Open Questions

Defaults used because the user did not answer before the plan was written, and the files did not arrive:
- `PLANO.TXT` was received (`/tmp/ct-assets/PLANO.TXT`, copy of `~/Downloads/PLANO.TXT`); it is ANSI art that clears the screen when typed.
- `HELP` is replaced only during a Chile session (not for everyone, and not appended to the normal list).
- The folder is removed whenever the session stops running (finished, restarted, reset, new game).
