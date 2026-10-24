# Design

## Context

- Engine contract: `{ id, apply(ctx) -> manifest, remove(ctx, manifest) }` (see `chile-throwback.js` as the model, including `writeVerified` retries).
- `dos-shell.js` already has `setHelpOverride(lines)` and DOS-style case-insensitive `DIR`/`CD`/`TYPE`. `CLS` is supported by the shell (Chile's help lists it), so the supplied help text stays unchanged. The shell starts in `C:\WINDOWS`.
- Supplied files (in `~/Downloads/Archivos Argentina/MS-DOS/`): `MEMORY.TXT` (671 B, ASCII), `ERROR.LOG` (319 B, ASCII), `HELP_PANTALLA.txt` (750 B, ASCII), `PLANO.TXT` (4482 B, ANSI art with 24-bit color, 23 lines, starts with `ESC[0m ESC[2J ESC[H`).

## Decisions

1. **Assets stored byte for byte** in `stations/assets/` (`argentina-memory.txt`, `argentina-error.log`, `argentina-plano.txt`, `argentina-help.txt`), imported with `?raw`, written with `writeVerified` (compare bytes, retry up to 5 times). Verify with a test that each written file equals its asset.
2. **Exactly three files.** `apply` creates the folder and the three files; it removes any other entry already inside `C:\THROWBACK` first, so `DIR` always shows exactly those three. The help screen is only in memory.
3. **HELP.** `setHelpOverride(helpText.split("\n"))`. The text mentions `CLS` and `CLS` works, so nothing is removed from it. `remove` calls `setHelpOverride(null)`.
4. **Start directory.** The help example is `CD THROWBACK`, which only works from `C:\`. Add `setStartDirOverride(path)` in `dos-shell.js` (module variable read where the shell sets its initial directory, default unchanged); the station sets `"C:\\"` and `remove` resets it to `null`. Only newly opened MS-DOS Prompt windows are affected.
5. **PLANO.TXT size.** The drawing has 23 lines. Verify in the 640x480 window that it renders without wrapping. If the top is scrolled out, tell the user before changing the window or the file (no reformatting of the art).
6. **MEMORY.TXT / ERROR.LOG.** The user notes they are reconstructions to review before publishing. Ship them as supplied; the user reviews them before the EC2 rollout. No ASCII conversion or accent changes.
7. Registered as `argentina: [..., { id: "throwback-folder", load: () => import("./argentina-throwback.js") }]`. Ids are per office, so Chile's id with the same name does not clash.

## Risks

- The shared folder name across offices: guarded by the engine removing the previous office's clues before applying (existing behavior, covered by tests).
- Stale `.metadata`/write truncation seen earlier: `writeVerified` retries.

## Open Questions

- Start directory `C:\` during Argentina sessions is my assumption so `CD THROWBACK` works as in the help text; alternative is changing the help example to `CD \THROWBACK` (but the text is supplied verbatim).
