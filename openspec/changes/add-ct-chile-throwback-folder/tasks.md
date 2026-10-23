# Tasks

Prerequisite: `add-ct-station-engine` is implemented. Baseline: use the result recorded in that change. The `PLANO.TXT` drawing was received and is at `/tmp/ct-assets/PLANO.TXT` (copy of `~/Downloads/PLANO.TXT`).

## 1. Failing e2e spec (RED)

- [ ] 1.1 Add `e2e/ct_station_chile.spec.js` with the cases of design decision 5 (folder and exact contents, `HELP` Spanish lines, `DIR`, `CD`, `TYPE` in any letter case, prompt shows the real name, removal on finish and restart, `HELP` back to default, Argentina and no-session untouched, team file removed with the folder, reload keeps clues and help). Drive MS-DOS Prompt as `e2e/command_prompt_zenfs.spec.js` does. Run it and confirm it fails.

## 2. System (DOS shell)

- [ ] 2.1 In `src/system/dos-shell.js` add the module-level `helpOverride` and exported `setHelpOverride(lines)`, and make `case "help"` print the override lines when set (design decision 3). Default output must stay byte-identical.
- [ ] 2.2 In the same file add `_findExisting(path)` (design decision 4) and call it from `DIR`, `CD` and `TYPE` right after `resolvePath`; `CD` stores the real on-disk path. No other command changes. No new comments.
- [ ] 2.3 Run `e2e/command_prompt_zenfs.spec.js` and the other DOS specs and confirm their baseline status is unchanged.

## 3. Station

- [ ] 3.1 Create `src/apps/improving-ct-october/stations/chile-throwback.js` per design decisions 1 and 2, using the exact file contents and the supplied `PLANO.TXT` stored byte for byte as `src/apps/improving-ct-october/stations/assets/plano.txt` and imported with `?raw`; add a test that the file written to `/C:/THROWBACK/PLANO.TXT` is identical to the asset.
- [ ] 3.2 Register it for `chile` in `src/apps/improving-ct-october/stations/registry.js`.

## 4. Docs

- [ ] 4.1 Add Chile's station to the "Stations" section of `src/apps/improving-ct-october/README.md` and the two-line note on the help override and case-insensitive names to `src/apps/command-prompt/README.md`.

## 5. Verification

- [ ] 5.1 Run `bun x playwright test e2e/ct_station_chile.spec.js e2e/ct_stations.spec.js e2e/command_prompt_zenfs.spec.js` and confirm everything passes except any case that already failed in the baseline.
- [ ] 5.2 Re-run `e2e/improving_ct_october.spec.js`, `e2e/y2k_patch.spec.js`, `e2e/msn_messenger.spec.js`, `e2e/fotolog.spec.js`, `e2e/winamp.spec.js` and `e2e/msn_app_links.spec.js`; no previously passing case may fail.
- [ ] 5.3 Manual check against the real local API (local Postgres only, never RDS; own Vite port 5180): start as a Chile team, open MS-DOS Prompt, run `HELP`, `DIR \THROWBACK`, `cd throwback`, `type plano.txt`, `type error.log` and confirm the em dash renders; finish with the patch code; confirm the folder is gone and `HELP` is back to normal; repeat as an Argentina team. Save screenshots of the three outputs.

## 6. Final validation

- [ ] 6.1 Run `bun run build` (restore the unrelated `report-a-bug` category if `build:registry` strips it), then `graphify update .`.
- [ ] 6.2 Commit as Gustavo only, with no `Co-authored-by` trailer. Message: `feat(ct): add the THROWBACK clue folder for Chile`. Verify `git log -1` shows that author and no co-author line.
