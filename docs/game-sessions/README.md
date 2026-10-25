# Improving CT October — game sessions

Improving CT October is a timed team game that runs inside the Windows 98 Web
Edition desktop. Two offices compete in parallel: **Argentina** and **Chile**.
Each office has its own set of teams and its own admin.

## The dynamic

- A **team** opens the *Improving CT October* app, picks its office and team,
  types its keyword, and presses **Start**. A 60-minute countdown appears on
  the desktop.
- During the session the desktop changes: the **station engine** drops files,
  programs and clues that only exist while that team's session is running.
  Challenges are found **inside** the system (Recycle Bin, MS-DOS Prompt,
  Minesweeper, Paint, My Documents, the desktop itself) and **outside** of it
  (physical clues placed by the facilitators in the office).
- Solving the challenges leads the team to the **Y2K patch code**. The team
  enters it in the **Y2K Patch** app before the countdown ends. A correct code
  installs the patch, stops the clock and records the team's time on the board.
- An **admin** per office manages teams, watches the board and the podium, can
  restart a single team or reset the whole office, and sets the office's patch
  code.

## The station engine in one paragraph

While a session runs, `src/apps/improving-ct-october/stations/engine.js` applies
every station registered for that office (see `stations/registry.js`). A station
is a small module that creates its artifacts on apply and deletes exactly those
artifacts when the session stops running — patch accepted, admin restart or
reset, or "Start a new game". What a station created is recorded in
`/C:/.ct_stations.json`, and leftovers are cleaned at boot, so two offices and
successive teams never see each other's clues.

## Roles

| Role | Who | Reads |
|---|---|---|
| Facilitator | Runs the game, plants physical clues, knows the solutions | `sessions/` guides (contain spoilers) |
| Admin | One person per office, manages teams from the app | `manuals/admin.md` |
| Team | The players | `manuals/team-player.md` |

## Index

- Manuals (no spoilers)
  - [Admin manual](manuals/admin.md)
  - [Team / player manual](manuals/team-player.md)
- Session guides (facilitator only — contain solutions)
  - [Argentina session](sessions/argentina.md)
  - [Chile session](sessions/chile.md)
- Reference
  - [Station reference](reference/stations.md)
  - [Architecture and deploy](reference/architecture-and-deploy.md)
