# Proposal

## Why

The Y2K patch code is set on the API host and shared by both offices. The MSN API change `add-ct-office-patch-codes` stores one code per office in the database and lets an office admin change it. The Improving CT October admin panel needs a section to read and change that code, so each office admin can set a different code without touching the host.

## What Changes

- New "Patch code" section at the top of the Admin view of Improving CT October: a field showing the office's current code, a Save button, a notice while the office is still on the default code, and a status line.
- Saving asks for confirmation when teams are still playing, applies the change at the next submission and shows the server's validation message when the code is refused.
- Two client calls in `src/apps/improving-ct-october/api.js`: `adminPatchCode()` (`GET /ct/admin/patch-code`) and `adminSetPatchCode(code)` (`PUT /ct/admin/patch-code`).
- No change to the Y2K Patch app: it already posts the typed code to `POST /ct/finish`, and the server decides.
- Test mock, e2e specs and READMEs updated.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `apps/improving-ct-october`: new requirement for editing the office patch code (added to the admin requirements).

## Impact

- **Layers affected**: an app (`improving-ct-october`) and tests. No system, shell, shared, config or registry change (the app config literal does not change, so `build:registry` is not needed).
- **Concrete files**: `src/apps/improving-ct-october/improving-ct-october-app.js`, `src/apps/improving-ct-october/api.js`, `src/apps/improving-ct-october/improving-ct-october.css` (only if the new section needs a rule), `src/apps/improving-ct-october/README.md`, `src/apps/y2k-patch/README.md`, `e2e/ct-mock.js`, `e2e/improving_ct_october.spec.js`, `e2e/y2k_patch.spec.js`.
- **Blast radius** (`graphify affected`): `api.js` is imported by the CT window, the timer and the Y2K Patch app; the change only adds two exports.
- **Persistence impact**: none in the browser (no new localStorage or sessionStorage keys, no ZenFS paths, no migration). The code lives in the server database and is never cached by the client beyond the field value.
- **Authenticity impact**: none; it is an office-event admin tool with plain form controls in the existing Win98 style.
- **Dependency and rollout**: needs the API change `add-ct-office-patch-codes` deployed first (recreate `api`). An older API returns 404 for the new routes; the section then shows an error and the rest of the admin view keeps working. Ship the Win98 image after the API.

## Non-goals

- Changing the Y2K Patch window or how a team types the code.
- Showing the code to crew members or anywhere outside the admin view.
- Restoring the default code, code history or an audit log.
- Rate limiting wrong codes.
- Any server rule (validation, seeding, scoping): they belong to `add-ct-office-patch-codes`.
