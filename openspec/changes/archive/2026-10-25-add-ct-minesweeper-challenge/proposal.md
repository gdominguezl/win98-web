# Proposal

## Why

Both offices play a Minesweeper station: a small fixed easy board; winning reveals a retro window with the office's reveal text (Argentina `Codigo: 1`, Chile `SECTOR DESBLOQUEADO: BODEGA`); repeated losses trigger retro taunts that keep them trying.

## What Changes

- New `src/apps/minesweeper/challenge.js`: `setMinesweeperChallenge(config | null)` and `getMinesweeperChallenge()`. Minesweeper imports it; it has no CT knowledge.
- `minesweeper-app.js` reads the config: opens on the configured board, locks the Game menu levels (Beginner/Intermediate/Expert/Custom disabled), skips the high-score prompt, shows the reveal window on a win, and shows a taunt on losses after the threshold. With no config, Minesweeper behaves exactly as today.
- Stations `minesweeper` for `argentina` (9x9, 10 mines) and `chile` (6x6, 4 mines), registered in `registry.js`; `apply` sets the config, `remove` sets `null`.
- Window text styled like the existing dialogs (`ShowDialogWindow`).
- No server, MSN or nginx change.

## Capabilities

### New Capabilities

- `apps/ct-minesweeper-challenge`.

## Impact

- **Layers**: app (minesweeper + stations), tests, README.
- **Blast radius**: only `minesweeper-app.js`; behavior with `null` config is unchanged, covered by the existing Minesweeper specs.
- **Persistence**: none; the config is in memory and re-applied by the engine on reload. No new storage key.
- **EC2**: win98-web image only.

## Non-goals

- Verifying the win on the server; changing Minesweeper rules or high-score storage; the win text as a server-side secret.
