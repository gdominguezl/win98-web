# Spec Delta

## Purpose

Lets a crew start a timed office session and lets an admin manage that office, with a retro countdown on the desktop.

## ADDED Requirements

### Requirement: Improving CT October is on the desktop
The system SHALL show an Improving CT October shortcut on the desktop and under Start > Programs.

#### Scenario: Fresh desktop
- **GIVEN** a desktop that has never had this shortcut
- **WHEN** the desktop finishes booting
- **THEN** the icon is visible
- **AND** Start > Programs lists Improving CT October

#### Scenario: One window
- **GIVEN** the window is already open
- **WHEN** the user launches it again
- **THEN** the same window is focused

### Requirement: A crew starts or resumes a team
The window SHALL let a crew pick Argentina or Chile, pick a team, type the keyword, and start. Enter in the keyword field SHALL start the same way as the Start button.

#### Scenario: Start
- **GIVEN** the crew has picked an office and a team
- **WHEN** they type that team's keyword and press Start
- **THEN** the window shows that the session is running

#### Scenario: Wrong keyword
- **GIVEN** the crew has picked a team
- **WHEN** they submit a different keyword
- **THEN** a Windows 98-style error is shown
- **AND** the countdown does not appear

#### Scenario: Resume
- **GIVEN** that team already has a running session
- **WHEN** a crew member starts it again with the keyword
- **THEN** the countdown continues from the original start

### Requirement: The desktop countdown
While this tab has a running team session, the system SHALL show a retro countdown on the right side of the desktop, above the taskbar.

#### Scenario: Running
- **GIVEN** a session that started less than 60 minutes ago
- **WHEN** the desktop is visible
- **THEN** the countdown shows the time left until 60 minutes
- **AND** it stays visible if the Improving CT October window is closed

#### Scenario: Game over
- **GIVEN** a session that has passed 60 minutes and is not finished
- **WHEN** the desktop is visible
- **THEN** the countdown shows 00:00 and the words Game over

#### Scenario: Finished
- **GIVEN** the server has accepted the patch
- **WHEN** the countdown next refreshes
- **THEN** the clock freezes
- **AND** Game over is not shown

#### Scenario: New tab
- **GIVEN** a session was started in another tab
- **WHEN** a new tab opens the desktop
- **THEN** the countdown is not shown until that tab starts the team again

### Requirement: An admin manages the office
The window SHALL let an admin pick an office, enter that office's password, and then manage teams, refresh a board, read a podium, and reset that office.

#### Scenario: Admin login
- **GIVEN** the admin picked an office
- **WHEN** they enter that office's password
- **THEN** the team list, board, podium, and reset controls are shown

#### Scenario: Wrong password
- **GIVEN** the admin picked an office
- **WHEN** they enter the other office's password
- **THEN** the board is not shown

#### Scenario: Refresh
- **GIVEN** the admin board is open
- **WHEN** the admin presses Refresh
- **THEN** each team shows whether it has not started, is running, or has finished
- **AND** a running or finished team shows how long it has been in the session

#### Scenario: Podium
- **GIVEN** two teams have finished
- **WHEN** the admin reads the podium
- **THEN** the team that took less time is listed first

#### Scenario: Edit a team
- **GIVEN** the team list is visible
- **WHEN** the admin creates a team, changes its name and keyword, and deletes a team
- **THEN** the list matches those changes after Refresh

#### Scenario: Reset with someone playing
- **GIVEN** at least one team has started and not finished
- **WHEN** the admin chooses Reset
- **THEN** a warning names that someone is still playing
- **AND** the times are cleared only after the admin confirms

#### Scenario: Reset with nobody playing
- **GIVEN** no team is running
- **WHEN** the admin confirms Reset
- **THEN** the times are cleared
- **AND** the team names remain
