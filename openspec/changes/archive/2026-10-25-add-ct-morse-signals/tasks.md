# Tasks

Assets: `~/Downloads/Archivos Argentina/Morse/SIGNALS.TXT`. Chile text is in the design.

## 1. Failing e2e spec (RED)
- [x] 1.1 `e2e/ct_station_morse.spec.js`: Argentina desktop file (shown, opens in Notepad, byte-exact), Chile `MORSE.TXT` (content, decodes to TELEVISOR/COCINA/ENTRADA, THROWBACK unchanged), removal on finish/restart, other office and no-session untouched, reload keeps them. Confirm it fails.

## 2. Stations
- [x] 2.1 Add the two assets and `argentina-signals.js`, `chile-morse.js`; register both.
- [x] 2.2 Screenshot the desktop label and Notepad for Argentina; report if the `.txt` extension shows.

## 3. Docs and verification
- [x] 3.1 README section. Run the new spec plus `ct_stations`, `ct_station_*`; MSN/Fotolog/Winamp specs only for unchanged status. `openspec validate add-ct-morse-signals --type change --strict`.
