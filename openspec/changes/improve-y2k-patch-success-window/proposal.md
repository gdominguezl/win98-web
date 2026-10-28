# Proposal

## Why

When a team enters the right code, the Y2K Patch ends with a plain message ("The Y2K patch is already installed on this computer." in the window, and a small overlay message with an OK button). The finish deserves a celebratory Windows 98 style screen: a bigger "Installation complete" window with a pixel-art globe, a checklist, a fireworks scene, a full progress bar and a "WELCOME TO 2000" banner, matching the reference image the user supplied.

## What Changes

- On success the Y2K Patch window becomes bigger and shows the new "Installation complete" screen: pixel-art globe with ring and sparkles, title `Installation complete`, the lines `Code accepted.`, `Critical failure avoided.`, `System date stabilized.`, `All operations restored.`, a bevelled panel with four checked items (`Millennium crisis avoided`, `System files patched`, `Network functions restored`, `Global systems online`) next to a fireworks-over-a-city scene captioned `31/12/1999 - 23:59`, a blue segmented progress bar at `100%`, a yellow `WELCOME TO 2000` banner and a `Finish` button that closes the window.
- The code is NOT shown: only `Code accepted.` (decision of the user).
- The same screen replaces "The Y2K patch is already installed on this computer." when a team reopens Y2K Patch in the same tab or when the server already finished the team.
- The existing 2-second install overlay is kept, with larger text. Its end-state message and OK button are removed: when the 2 seconds end, the overlay disappears on its own and the new window is visible.
- The first screen (code form) keeps its current small size and behavior.
- Pixel-art assets (globe, fireworks scene) are drawn for this change as small SVGs, rendered with `image-rendering: pixelated`.
- No server, MSN or nginx change.

## Capabilities

### Modified Capabilities

- `apps/y2k-patch`: the success sequence and the installed state.

## Impact

- **Layers affected**: one app (`src/apps/y2k-patch/`) and its tests/README; `improving-ct-october/timer.js` is read-only context (see risk).
- **Concrete files**: `src/apps/y2k-patch/y2k-patch-app.js`, `y2k-patch.css`, `assets/globe.svg`, `assets/fireworks.svg`, `e2e/y2k_patch.spec.js`, `e2e/improving_ct_october.spec.js` (assertions on the overlay message/OK), `src/apps/y2k-patch/README.md` (and its screenshot).
- **Blast radius**: `timer.js` `beginFinale` waits for `#y2k-overlay` to disappear before the finale panel starts. Today the overlay disappears when the user presses OK; after this change it disappears by itself after 2 seconds, so the finale starts earlier. The new window must stay usable next to the finale panel; verify visually and with `improving_ct_october.spec.js`.
- **Persistence**: no change; the existing `y2k-patch-applied` sessionStorage flag is reused. Nothing about the code is stored.
- **Authenticity impact**: dialog frame, bevels, buttons and the progress bar use the existing Windows 98 theme variables and `os-gui` window; the fixed pixel font is already bundled.
- **Rollout (EC2)**: win98-web image only. No API or env change.

## Non-goals

- Changing the code form, the rules for accepting a code, the timer, the board or the finale panel.
- Showing the typed code or the team's time.
- Sound or animation beyond the existing 2-second progress.
