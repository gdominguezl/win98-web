# Proposal

## Why

Both offices get a Morse-code clue file that teams decode in Windows 98 with help from a physical clue. Argentina gets a Notepad text named "Communication System" on the desktop (the supplied `SIGNALS.TXT`); Chile gets `MORSE.TXT` with a translation table and three transmissions (transmission 02 decodes to `TELEVISOR`).

## What Changes

- Argentina station `signals-file`: while the session runs, `C:\WINDOWS\Desktop\Communication System.txt` exists with the supplied `SIGNALS.TXT` content; a double click opens it in Notepad. Removed when the session stops.
- Chile station `morse-file`: while the session runs, `C:\My Documents\MORSE.TXT` exists with the table and three transmissions. Removed when the session stops. (`C:\THROWBACK` is untouched, so it still has exactly its three files.)
- No server, MSN or nginx change.

## Capabilities

### Modified Capabilities

- `apps/ct-station-argentina`, `apps/ct-station-chile`.

## Impact

- **Layers**: app (`improving-ct-october/stations/`), tests, README. No system change.
- **Files**: `stations/argentina-signals.js`, `stations/chile-morse.js`, `stations/assets/{argentina-signals.txt,chile-morse.txt}`, `registry.js`, `e2e/ct_station_morse.spec.js`, README.
- **Persistence**: ZenFS only. The desktop file is a plain `.txt`, listed in the engine marker and deleted on removal; the existing desktop shortcuts are not modified.
- **EC2**: win98-web image only.

## Non-goals

- A Morse translator tool; hiding the answer; changing the supplied text.
