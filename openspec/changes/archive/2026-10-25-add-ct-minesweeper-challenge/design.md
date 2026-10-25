# Design

## Context

`MinesweeperApp` (`src/apps/minesweeper/minesweeper-app.js`) has a `difficulty` and `setDifficulty(w, h, mines, name)`; wins go through the `result === "win"` branch (high-score dialog), losses through `result === "mine"`; `resetGame()` is the "new game" path.

## Decisions

1. **Config shape.** `{ width, height, mines, winTitle, winText, tauntAfterLosses: 3, taunts: string[] }`. Argentina: `9x9/10`, `winText: "Codigo: 1"`. Chile: `6x6/4`, `winText: "SECTOR DESBLOQUEADO: BODEGA"`.
2. **Launch.** In the constructor/init, if the config is set, use its board and mark `difficulty = "challenge"` (a value outside the menu, like "custom"); the Game menu items for levels and Custom are disabled while a config exists. A window already open when the station applies keeps its board until reopened (documented).
3. **Win.** In the `"win"` branch, if the config is set, skip the high-score dialog and show `ShowDialogWindow({ title: winTitle, text: winText, modal: true, buttons: [OK] })`. Shown once per page load per team (`challengeRevealed` flag); later wins just show the win smiley.
4. **Taunts.** Count consecutive losses in the app instance (`challengeLosses`); a win resets it. From the third consecutive loss on, each loss shows a small dialog "Minesweeper" with a random taunt from the list, never the same twice in a row. Initial list (Spanish, retro): `sos re troll, intenta de nuevo`, `LOL te esta yendo re-mal`, `dale que se puede, no te rindas`, `ni mi abuela pierde asi`, `casi, casi... bueno no, pero segui`. The user can edit the list in one place.
5. **Cleanup.** `remove` sets `setMinesweeperChallenge(null)`; the next opened game is normal. Open windows keep the locked board until closed.
6. **Layering.** Station (app) imports `minesweeper/challenge.js` (app module with no dependencies); Minesweeper does not import the station.

## Risks

- Pre-existing `minesweeper-app.js` branches (custom dialog, difficulty menu) must remain untouched with `null` config: covered by existing specs.
- The text "Codigo: 1" is client-side and visible in the bundle (same as other clues).

## Open Questions

- "Reveal once per page load" follows the recommended option; changing to "every win" is a one-line change.
- Chile board (6x6/4 mines) is my proposal for "small and easy".
