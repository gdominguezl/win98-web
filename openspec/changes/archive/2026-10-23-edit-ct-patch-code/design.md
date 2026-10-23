# Design

## Context

Read first (`graphify query` on the app plus the files):

- `improving-ct-october-app.js`: a static `SHELL` with the Admin container `#ct-admin` (Teams, Board, Podium, Reset all). `_showAdmin()` calls `_loadAdminTeams()` and `_loadBoard()`. `_reset()` already warns when `board.runningCount > 0` by calling `adminBoard()` and `window.confirm`. `_error(message)` writes the shared `#ct-error` line. The window is 440x380, not resizable, and its content container has `overflow: auto`, so a longer Admin view scrolls.
- `api.js`: one `request(path, { method, body, auth, clearOnUnauthorized })` helper; a 401 with a token clears the session. Functions return `{ status, body }`.
- `e2e/ct-mock.js` fakes the whole `/ct` API in Playwright and hardcodes `Y2KPATCH99` in `/ct/finish`.
- The Y2K Patch window posts the typed code through `finishPatch`; it never knows the expected value.
- Server contract (from `add-ct-office-patch-codes`): `GET /ct/admin/patch-code` → `{ patchCode, isDefault, updatedAt }`; `PUT /ct/admin/patch-code` with `{ code }` → `{ patchCode, isDefault: false, updatedAt }` or `400 { error }` with one of `Enter a code`, `Use 4 to 32 letters or numbers`, `Use only letters, numbers, spaces and dashes`, `Choose a code different from the default`; 401 without a valid admin token.

## Goals / Non-Goals

**Goals:** an admin sees and changes their office's code; clear feedback; no surprise when teams are playing.

**Non-Goals:** see proposal.

## Decisions

**1. A "Patch code" section at the top of `#ct-admin`**, before Teams, because it is the one setting an admin must not forget, and the Admin view already scrolls in a 440x380 window.
```html
<h2>Patch code</h2>
<form id="ct-patch-code-form">
  <div class="ct-row">
    <input id="ct-patch-code" type="text" maxlength="48" autocomplete="off" spellcheck="false" aria-label="Patch code">
    <button type="submit" id="ct-patch-code-save">Save code</button>
  </div>
  <p id="ct-patch-code-note" role="status"></p>
</form>
```
- A `<form>` makes Enter save, and the save is a normal submit. Existing classes (`ct-row`, `ct-error`) are reused; at most one small CSS rule is added for the note.
- Alternative: a separate "Settings" tab. Rejected: one more mode for one field.

**2. Behavior.**
- On `_showAdmin()` the app loads the code with `adminPatchCode()`; the field shows `patchCode`. While loading, the field is disabled. If the call fails the note says `The patch code could not be loaded.` and Save stays disabled.
- While `isDefault` is true the note says `This office is still using the default code. Save your own code so the default stops working.` After a successful save the note says `Code saved. It applies to the next code teams enter.`
- Save with an empty or unchanged value still calls the server (the server owns validation); the server's `error` text is shown in the note and the field keeps focus. Unknown failures show `The code could not be saved.`
- Before saving, the app calls `adminBoard()` and, if `runningCount > 0`, asks `window.confirm("Someone is still playing. Change the code anyway?")`; cancelling does nothing. This mirrors `_reset()`.
- A 401 (session expired) shows the admin login again with `Your admin session expired. Sign in again.` (the `request` helper has already cleared the token).
- The Save button is disabled while a request is in flight to prevent double saves.
- Refresh board does not reload the code; the field is only reloaded when the admin view opens, so unsaved typing is never overwritten.

**3. API client**: add to `api.js`
```js
export function adminPatchCode() { return request("/admin/patch-code"); }
export function adminSetPatchCode(code) { return request("/admin/patch-code", { method: "PUT", body: { code } }); }
```

**4. Y2K Patch app unchanged.** A team of one office can only finish with that office's code; the server enforces it, so there is nothing to do client-side. Its README sentence about "one shared code" is rewritten.

**5. Mock and tests (Playwright, written first).** `e2e/ct-mock.js` gains `patchCodes` in `freshCtState()` (`argentina` and `chile`, both `Y2KPATCH99`, `isDefault: true`), `GET` and `PUT /ct/admin/patch-code` mirroring the server validation and messages, and `/ct/finish` compares against the code of the active team's office (so a saved code retires the default in the mock too, as the server does). Cases in `e2e/improving_ct_october.spec.js`:
- Admin sees the office's code and the default notice; the Chile admin sees Chile's code.
- Saving a valid code clears the notice, shows `Code saved. ...`, and the same session then rejects `Y2KPATCH99` in Y2K Patch and accepts the new code.
- Each validation message from the server is shown in the note and the code is not changed.
- Enter in the field saves.
- With a running team the confirm appears (accept the dialog before awaiting the click; the confirm follows an awaited fetch, so use `page.waitForEvent('dialog')` before the click): dismiss sends no `PUT`, accept sends it.
- 401 on save returns to the admin login with the expired message.
- The two offices keep separate codes.
- Existing specs keep passing; `e2e/y2k_patch.spec.js` still uses the default code through the mock.

**6. Docs.** README of the CT window gets one Admin bullet; the Y2K Patch README replaces "One shared code ... `Y2K_PATCH_CODE`" with "One code per office, set by that office's admin in Improving CT October".

## Risks / Trade-offs

- **[Risk] The section depends on the API change.** → Mitigation: ship after the API; an older API only breaks this section (404 shows the load error).
- **[Risk] The code is displayed in plain text on a shared screen.** → Accepted (same as team keywords); the admin works on their own machine.
- **[Risk] Dialogs after awaited fetches are flaky in Playwright.** → Mitigation: `page.waitForEvent('dialog')` before the click, as noted for the existing restart tests.
- **[Trade-off] Reload only on opening the admin view.** Avoids overwriting unsaved typing; the admin can reopen the view to refresh.
- **[Risk] 440x380 window plus a new section.** → The view already scrolls; the section is first so it is visible on opening; checked in the manual step.

## Open Questions

None. Decisions agreed with the user: code visible, 4 to 32 letters or numbers, change applies immediately, default retired once the office saves its own.
