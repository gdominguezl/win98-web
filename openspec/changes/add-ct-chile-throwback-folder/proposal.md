# Proposal

## Why

Chile teams must find clues by exploring the system in MS-DOS Prompt: a `C:\THROWBACK` folder with three text files. The kitchen clue tells them to look for a plan, so they must open `PLANO.TXT`, which shows an ASCII drawing of a telephone inside a closed space. This is the second station built on the engine from `add-ct-station-engine`. It also needs two small MS-DOS Prompt behaviors: a simple Spanish `HELP` while a Chile team plays, and DOS-style case-insensitive names so `type plano.txt` works.

## What Changes

- New station `throwback-folder` for office `chile` (`src/apps/improving-ct-october/stations/chile-throwback.js`), registered in `registry.js`. While a Chile team runs, `C:\THROWBACK` exists with `MEMORY.TXT`, `ERROR.LOG` and `PLANO.TXT`. It is removed, with everything inside it, when the session stops running.
- MS-DOS Prompt (`src/system/dos-shell.js`) gains a help override: `setHelpOverride(lines | null)`. While a Chile team runs, `HELP` prints exactly three simple lines in Spanish (`DIR`, `TYPE ARCHIVO`, `CD CARPETA`). Outside a Chile session `HELP` is unchanged.
- MS-DOS Prompt resolves names case-insensitively as a fallback for `DIR`, `CD` and `TYPE`: when the exact path does not exist, a case-insensitive match is used, like real DOS. Exact matches behave exactly as before.
- No server, MSN or nginx change.

## Capabilities

### New Capabilities

- `apps/ct-station-chile`: the `C:\THROWBACK` folder, its files, the simple `HELP`, and case-insensitive DOS names during a Chile session.

### Modified Capabilities

None.

## Impact

- **Layers affected**: system (`dos-shell.js`: a help override and a case-insensitive lookup fallback), an app (`improving-ct-october/stations/`), tests and README. `dos-shell.js` is used by MS-DOS Prompt (`command-prompt`) and the DOS box; both are listed in the blast radius. Layering is respected: the station (app) calls the system module, not the other way around.
- **Concrete files**: `src/system/dos-shell.js`, `src/apps/improving-ct-october/stations/chile-throwback.js`, `src/apps/improving-ct-october/stations/registry.js`, `e2e/ct_station_chile.spec.js`, `e2e/command_prompt_zenfs.spec.js` (only if its assertions need an update), `src/apps/improving-ct-october/README.md`, `src/apps/command-prompt/README.md`.
- **Blast radius** (`graphify affected src/system/dos-shell.js`): `command-prompt-app.js` and the DOS box app that creates `DOSShell`. The new help override is `null` by default and the lookup fallback only runs when an exact path is missing, so no existing successful command changes; commands that used to fail on a case mismatch now succeed.
- **Persistence impact**: ZenFS only. `/C:/THROWBACK/` with three files while the station is applied, listed in the engine marker `/C:/.ct_stations.json`. The help override lives in memory and is re-applied by the engine on reload. No localStorage or sessionStorage key, nothing for users without a Chile session.
- **Authenticity impact**: Windows 98 / MS-DOS file names are case-insensitive (`TYPE plano.txt` finds `PLANO.TXT`) and the files use 8.3 style upper-case names, as in the original system. The ZenFS folder is also visible in Explorer.
- **Rollout and compatibility (EC2)**: win98-web image only, after `add-ct-station-engine`. No MSN, API or env change. MSN, Fotolog and Winamp are not edited; Argentina and no-session users see no folder and the normal `HELP`.

## Non-goals

- The Argentina station and any other station.
- Changing other DOS commands, changing the DOS prompt's starting directory, or a Spanish translation of the whole shell.
- Case-insensitive file matching for commands other than `DIR`, `CD` and `TYPE` (for example `COPY`, `DEL`).
- Preventing the team from deleting or editing the files (a restart and a new start re-applies them).
- Hiding the file contents from someone reading the app bundle.
