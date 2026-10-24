# Proposal

## Why

Argentina teams get a second station in the MS-DOS Prompt, like Chile: a `C:\THROWBACK` folder with exactly three files (`MEMORY.TXT`, `ERROR.LOG`, `PLANO.TXT`) and a native `HELP` that prints the supplied help screen. It is built on the station engine and on the `setHelpOverride` and case-insensitive name support already added for Chile.

## What Changes

- New Argentina station `throwback-folder` (`src/apps/improving-ct-october/stations/argentina-throwback.js`), registered in `registry.js` after `recycle-clue`. While an Argentina team runs, `C:\THROWBACK` exists with exactly `MEMORY.TXT`, `ERROR.LOG` and `PLANO.TXT` (Argentina's own texts and its own new ANSI drawing, not Chile's). It is removed with everything inside when the session stops running.
- `HELP` prints the supplied `HELP_PANTALLA.txt` verbatim while an Argentina session runs, via the existing `setHelpOverride`. The help text is bundled as an asset and is never a file in `C:\THROWBACK` or anywhere on the virtual disk.
- While an Argentina or a Chile session runs, MS-DOS Prompt opens in `C:\` so `CD THROWBACK` works as written (decided by the user for both offices; the Chile station `throwback-folder` also sets and clears it). This adds a small `setStartDirOverride(path | null)` to `dos-shell.js`; default behavior (start in `C:\WINDOWS`) is unchanged.
- No server, MSN or nginx change.

## Capabilities

### Modified Capabilities

- `apps/ct-station-argentina`: adds the THROWBACK folder, the help screen and the start directory.

## Impact

- **Layers affected**: system (`dos-shell.js`: start-directory override next to the help override), app (`improving-ct-october/stations/`), tests, README.
- **Concrete files**: `src/system/dos-shell.js`, `src/apps/improving-ct-october/stations/argentina-throwback.js`, `.../stations/registry.js`, `.../stations/assets/argentina-{memory.txt,error.log,plano.txt,help.txt}`, `e2e/ct_station_argentina_dos.spec.js`, `src/apps/improving-ct-october/README.md`.
- **Blast radius**: `dos-shell.js` is used by MS-DOS Prompt and the DOS box; the new override is `null` by default, so no behavior changes outside an Argentina session. Both offices use the same folder name but never at the same time (one team per machine; the engine removes the other office's clues first).
- **Persistence**: ZenFS only, `/C:/THROWBACK/` while applied and listed in the engine marker. The overrides live in memory and are re-applied on reload.
- **EC2 rollout**: win98-web image only, no API or env change. MSN, Fotolog and Winamp are not edited.

## Non-goals

- Changing Chile's folder or help; other DOS commands; preventing the team from editing files.
