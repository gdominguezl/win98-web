# Tasks

## 1. Spike
- [ ] 1.1 Confirm Fill With Color works on a BMP from ZenFS and record the result (and which app opens `.bmp` by default). If it fails, stop and ask the user which fallback to use.

## 2. Failing e2e spec (RED)
- [ ] 2.1 `e2e/ct_station_chile_paint.spec.js`: file exists during the session, canvas looks uniform, fill reveals a differing pixel pattern (read pixels), removal on finish/restart, Argentina/no-session untouched. Confirm it fails.

## 3. Station
- [ ] 3.1 Generate `puerta.bmp` (one-off script, not committed), add `chile-paint.js`, register it. Screenshot the revealed image for the user.

## 4. Docs and verification
- [ ] 4.1 README. Run the new spec, `ct_*` specs, Paint specs if any; MSN/Fotolog/Winamp only for unchanged status. `openspec validate add-ct-chile-paint-challenge --type change --strict`.
