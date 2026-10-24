# apps/ct-stations Specification

## Purpose
Arranges parts of the Windows 98 system for a team while its game session is running, depending on its office, and puts everything back when the session stops running.

## Requirements

### Requirement: Stations apply while a team is running
The system SHALL apply the stations of a team's office when that team's session starts running in the browser, and SHALL apply only the stations of that office.

#### Scenario: Team starts
- **GIVEN** a team of an office that has stations
- **WHEN** the team starts its session
- **THEN** that office's stations are applied
- **AND** no station of another office is applied

#### Scenario: Office without stations
- **GIVEN** a team of an office with no stations
- **WHEN** the team starts its session
- **THEN** nothing is added to the system and the session works as before

#### Scenario: Rejoin
- **GIVEN** a team whose session is already running
- **WHEN** the team starts again or the desktop is reloaded
- **THEN** the stations are present exactly once, with no duplicates

### Requirement: Nothing changes without a running team session
The system SHALL NOT add or change anything for admins, for crews that have not started, or for browsers without a CT session.

#### Scenario: Admin signed in
- **GIVEN** an admin signed in to Improving CT October
- **WHEN** the admin uses the window
- **THEN** no station is applied

#### Scenario: No session
- **GIVEN** a browser that never started a CT session
- **WHEN** the desktop is used
- **THEN** no station file, folder or marker exists

#### Scenario: Ready or finished team
- **GIVEN** a team whose session is ready or finished
- **WHEN** the desktop loads
- **THEN** no station is applied

### Requirement: Stations are removed when the session stops running
The system SHALL remove every applied station when the team's session stops running, including when the patch is accepted, when an admin restarts or resets the team, and when the crew chooses Start a new game.

#### Scenario: Patch accepted
- **GIVEN** a running team with stations applied
- **WHEN** the server accepts the patch code
- **THEN** the stations are removed and the finish screen is unaffected

#### Scenario: Admin restart
- **GIVEN** a running team with stations applied
- **WHEN** an admin restarts that team and the team's desktop next checks its session
- **THEN** the stations are removed

#### Scenario: Start a new game
- **GIVEN** a finished team that chooses Start a new game
- **WHEN** the form returns
- **THEN** no station remains

#### Scenario: Removal is complete
- **GIVEN** stations that created files, folders or other items
- **WHEN** they are removed
- **THEN** everything they created is gone, including copies the players made of what they created, and nothing else is touched

### Requirement: Leftover stations are cleaned at start-up
The system SHALL remove leftover stations when the desktop loads in a browser tab that has no team session.

#### Scenario: Closed browser
- **GIVEN** stations left from a session whose tab was closed before it ended
- **WHEN** the desktop loads in a new tab without a team session
- **THEN** the leftover stations are removed

#### Scenario: Same running session
- **GIVEN** a tab with a running team session and stations in place
- **WHEN** the desktop reloads
- **THEN** the stations stay and are not duplicated

### Requirement: A failing station does not break the game
The system SHALL keep the other stations, the countdown, Y2K Patch and every other app working when one station fails to apply or to remove.

#### Scenario: One station fails
- **GIVEN** two stations for an office and the first one fails
- **WHEN** the team starts
- **THEN** the second is still applied, the countdown shows and the window reports no error

### Requirement: Other apps are unaffected
The system SHALL leave MSN Messenger, Fotolog, Winamp, the app switcher buttons and Y2K Patch behaving exactly as before, with or without stations applied.

#### Scenario: Regular desktop
- **GIVEN** a desktop with no CT session
- **WHEN** the user opens MSN Messenger, Fotolog or Winamp and uses their switcher buttons
- **THEN** they behave as before
