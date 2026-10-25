# Admin manual — Improving CT October

One admin per office (Argentina or Chile) manages the game from the
**Improving CT October** window. This manual describes every control in the
Admin view. UI labels match the implementation in
`src/apps/improving-ct-october/improving-ct-october-app.js`.

## Sign in

1. Open **Improving CT October** (desktop icon or Start > Programs).
2. Click **Admin** at the top of the window.
3. Choose your **Office** and type the office **Password**, then **Sign in**.

The admin password for each office lives on the server in the environment
variables `CT_ADMIN_PASSWORD_ARGENTINA` and `CT_ADMIN_PASSWORD_CHILE`
(`server/.env.example` in the MSN repo shows the names — the values are
secrets, ask whoever deployed the event). A wrong password shows
"That password was not accepted." If your admin token expires the app shows
"Your admin session expired. Sign in again."

## Patch code

The top section is the office's Y2K patch code — the code its teams must
enter in the Y2K Patch app to finish.

- The field shows the current code (loaded per office).
- If the office still uses the shared default, a note warns:
  **"This office is still using the default code. Save your own code so the
  default stops working."**
- **Save code** stores the new code. Before saving, the app checks the board:
  if any team is still running it asks **"Someone is still playing. Change
  the code anyway?"** Confirming retires the old code immediately — the new
  code applies to the next code a team enters. On success the note reads
  **"Code saved. It applies to the next code teams enter."**
- Validation happens on the server: 4–32 letters/numbers (spaces and dashes
  are ignored and letters are uppercased), and it cannot equal the default
  code. Rejections are shown under the field.

## Teams

The **Teams** section lists every team in your office as an editable row:
name field, keyword field, **Save** and **Delete** buttons. Use it to rename
teams or rotate keywords before the event. Below the list, the
**Name** + **Keyword** inputs with the **Create** button add a new team.

Deleting a team also drops it from the board and the podium.

## Board

The **Board** shows every team with its status — `Not started`,
`Running — m:ss` elapsed, or `Finished — m:ss` — refreshed only when you
click **Refresh** (the button under "Board"). Running and finished teams get
a **Restart** button next to their row.

- **Restart** on a running team asks **"&lt;team&gt; is still playing.
  Restart this team anyway?"**; on a finished team it asks
  **"Restart &lt;team&gt;? Their time will be cleared."**
- After a restart the team's session is cleared server-side: on their
  computer the app returns to the login form, the countdown disappears, and
  every station artifact of your office is removed. They sign in and start
  again as if new.

## Podium

The **Podium** lists the finished teams ordered by their recorded time
(fastest first). It updates together with the board on **Refresh**.

## Reset all

**Reset all** (bottom of the view) clears every session in your office —
all running clocks and all finished results. Team names and keywords stay.
If anyone is still playing the confirmation is stronger:
**"Someone is still playing. Reset this office anyway?"**, otherwise
**"Reset this office? Team names will stay."**

Use it between groups of teams so each group starts on a clean board. After
a reset, teams that were mid-game must sign in again; their clue files are
removed by the station engine.

## Tips

- Check the board with **Refresh** before Reset all — the confirmation tells
  you if someone is still playing, but the board shows who.
- Save your office's patch code **before** the first team starts; changing
  it mid-run makes earlier codes worthless.
- Each office sees only its own teams, board and code — you cannot break the
  other office from this view.
