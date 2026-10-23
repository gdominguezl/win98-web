# Tasks

Prerequisite: the MSN API change `add-ct-office-patch-codes` is implemented (the server contract in design.md exists), at least in the local stack. Baseline: run `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" bun x playwright test e2e/improving_ct_october.spec.js e2e/y2k_patch.spec.js` on the current tree and keep the result (last known: 18 passed).

## 1. Mock and failing e2e specs (RED)

- [ ] 1.1 Extend `e2e/ct-mock.js` per design decision 5: `patchCodes` per office in `freshCtState()`, `GET` and `PUT /ct/admin/patch-code` with the server's validation and messages, and `/ct/finish` comparing against the active team's office code. Re-run the baseline specs and confirm they still pass.
- [ ] 1.2 Add the cases of design decision 5 to `e2e/improving_ct_october.spec.js` (office code shown for Argentina and Chile, default notice, valid save, default retired in Y2K Patch, each validation message, Enter saves, running-team confirm dismissed and accepted with `page.waitForEvent('dialog')` before the click, expired session, separate offices, load error, Refresh keeps typing). Run it and confirm the new cases fail because the section does not exist.

## 2. Client

- [ ] 2.1 Add `adminPatchCode()` and `adminSetPatchCode(code)` to `src/apps/improving-ct-october/api.js` (design decision 3).
- [ ] 2.2 Add the "Patch code" section to `#ct-admin` in `SHELL` and wire it in `improving-ct-october-app.js`: load on `_showAdmin()`, submit handler with the running-team confirm via `adminBoard()`, notices and error text from design decision 2, disabled states, expired-session handling. Reuse `ct-row` and `ct-error` classes; add a CSS rule only if the note needs one. No new comments.

## 3. Docs

- [ ] 3.1 Update `src/apps/improving-ct-october/README.md` (Admin bullet) and `src/apps/y2k-patch/README.md` (one code per office, set in Improving CT October, no longer `Y2K_PATCH_CODE`).

## 4. Verification

- [ ] 4.1 Run `PLAYWRIGHT_BROWSERS_PATH="$HOME/Library/Caches/ms-playwright" bun x playwright test e2e/improving_ct_october.spec.js e2e/y2k_patch.spec.js` and confirm everything passes (GREEN).
- [ ] 4.2 Manual check against the real local API (local Postgres only, never RDS; API env from the CT handoff with `CORS_ORIGIN=http://localhost:5173`; desktop with `VITE_CT_API_URL=http://localhost:3309 bun run dev`): open Admin for Argentina and Chile, confirm the default notice, save different codes, confirm each office's team finishes only with its own code in Y2K Patch and the old default is refused, try a refused code, a running team confirm, and check the section at 440x380 (visible without scrolling, nothing clipped). Stop the dev server, the API and the local DB afterwards.
- [ ] 4.3 After deploy (operator step, API first): on the deployed host, set each office's code from the admin panel and finish a team with it.

## 5. Final validation

- [ ] 5.1 Run `bun run build` (restore the unrelated `report-a-bug` category if `build:registry` strips it; the app config did not change so there should be no registry diff), then `graphify update .`.
- [ ] 5.2 Commit as Gustavo only, with no `Co-authored-by` trailer. Message: `feat(ct): let an admin edit the office patch code`. Verify `git log -1` shows that author and no co-author line.
