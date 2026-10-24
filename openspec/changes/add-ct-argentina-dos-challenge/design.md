# Design

## Context

- Engine contract: `{ id, apply(ctx) -> manifest, remove(ctx, manifest) }` (see `chile-throwback.js` as the model, including `writeVerified` retries).
- `dos-shell.js` already has `setHelpOverride(lines)` and DOS-style case-insensitive `DIR`/`CD`/`TYPE`. `CLS` is supported by the shell (Chile's help lists it), so the supplied help text stays unchanged. The shell starts in `C:\WINDOWS`.
- Supplied files (in `~/Downloads/Archivos Argentina/MS-DOS/`): `MEMORY.TXT` (671 B, ASCII), `ERROR.LOG` (319 B, ASCII), `HELP_PANTALLA.txt` (750 B, ASCII), `PLANO.TXT` (4482 B, ANSI art with 24-bit color, 23 lines, starts with `ESC[0m ESC[2J ESC[H`).

## Decisions

1. **Assets stored byte for byte** in `stations/assets/` (`argentina-memory.txt`, `argentina-error.log`, `argentina-plano.txt`, `argentina-help.txt`), imported with `?raw`, written with `writeVerified` (compare bytes, retry up to 5 times). Verify with a test that each written file equals its asset.
2. **Exactly three files.** `apply` creates the folder and the three files; it removes any other entry already inside `C:\THROWBACK` first, so `DIR` always shows exactly those three. The help screen stays out of the folder.
3. **HELP.** `setHelpOverride(helpDosText.split("\n"))` with the short built-in text (`argentina-help-dos.txt`: `Available commands:` plus `HELP`, `DIR`, `CD`, `TYPE`, `CLS` one line each) so it fits the 24-row window. The supplied `HELP_PANTALLA.txt` (`argentina-help.txt`, untouched) is written byte for byte to `C:\WINDOWS\Desktop\HELP_PANTALLA.TXT` with `writeVerified` and a `desktop-refresh` event like `argentina-signals.js`; it opens in Notepad. `remove` deletes it, dispatches the event again and calls `setHelpOverride(null)`.
4. **Start directory.** The help example is `CD THROWBACK`, which only works from `C:\`. Add `setStartDirOverride(path)` in `dos-shell.js` (module variable read where the shell sets its initial directory, default unchanged); both the Argentina station and the existing Chile station (`chile-throwback.js`) set `"C:\\"` and their `remove` resets it to `null`. Only newly opened MS-DOS Prompt windows are affected.
5. **PLANO.TXT size.** The drawing has 23 lines. Verify in the 640x480 window that it renders without wrapping. If the top is scrolled out, tell the user before changing the window or the file (no reformatting of the art).
6. **MEMORY.TXT / ERROR.LOG.** The user notes they are reconstructions to review before publishing. Ship them as supplied; the user reviews them before the EC2 rollout. No ASCII conversion or accent changes.
7. Registered as `argentina: [..., { id: "throwback-folder", load: () => import("./argentina-throwback.js") }]`. Ids are per office, so Chile's id with the same name does not clash.

## Risks

- The shared folder name across offices: guarded by the engine removing the previous office's clues before applying (existing behavior, covered by tests).
- Stale `.metadata`/write truncation seen earlier: `writeVerified` retries.

## Open Questions

- Resolved: `C:\` start directory applies to both offices.
