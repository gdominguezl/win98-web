# Design

## Decisions

1. **Argentina file as a real desktop file.** The desktop lists files in `/C:/WINDOWS/Desktop` (shortcuts are `.lnk.json`; other files use the extension association). A `.txt` there opens in Notepad. The file is named `Communication System.txt` and holds `SIGNALS.TXT` byte for byte (it is UTF-8 with `Ñ`, supplied `UTF-8`), imported with `?raw`. Chosen over a shortcut so it behaves like a document and is removed by deleting one file. Verify the icon label shows "Communication System" and decide with a screenshot whether the `.txt` extension must be hidden by the desktop renderer (if it is shown, report it before changing anything).
2. **Chile file in `C:\My Documents`.** `MORSE.TXT` content: a table with the letters A to Z (one per line, `A .-` ... `Z --..`), then:
```
TRANSMISION 01
-.-. --- -.-. .. -. .-

TRANSMISION 02
- . .-.. . ...- .. ... --- .-.

TRANSMISION 03
. -. - .-. .- -.. .-
```
Accent: the request writes `TRANSMISIÓN`; keep it exactly with the accent, UTF-8. The table is complete and correct (the Morse table must be verified by a unit-style test decoding transmission 02 to `TELEVISOR`, 01 to `COCINA`, 03 to `ENTRADA`).
3. **Idempotent, removal-safe.** Both stations delete only the file they created (manifest holds the path). If a file with that name pre-exists, it is overwritten and still removed on finish (they are clue names unlikely to exist).
4. Registered next to the existing stations in `registry.js`.

## Risks

- Desktop does not refresh when a file appears: verify with the desktop's file watcher; if needed, the station dispatches the same refresh event the Explorer uses (found during implementation, no new API).
