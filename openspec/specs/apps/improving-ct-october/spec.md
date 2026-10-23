# apps/improving-ct-october Specification

## Purpose
Lets a crew start a timed office session and lets an admin manage that office, with a retro countdown on the desktop.

## Requirements

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
- **GIVEN** the server has accepted the patch inside 60 minutes
- **WHEN** the countdown next refreshes
- **THEN** the timer shows a short completion message and then leaves the desktop
- **AND** the Improving CT October window says the team completed the challenge on time
- **AND** Start a new game returns to the team form

#### Scenario: Finished late
- **GIVEN** the server has accepted the patch after 60 minutes
- **WHEN** the countdown next refreshes
- **THEN** the timer shows a short acceptance message and then leaves the desktop
- **AND** the window says the team did not finish on time and that the patch was still accepted

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

#### Scenario: Restart one team
- **GIVEN** one team has finished and another is still running
- **WHEN** the admin restarts the finished team
- **THEN** that team's time is cleared
- **AND** the running team keeps its time

#### Scenario: Reset with someone playing
- **GIVEN** at least one team has started and not finished
- **WHEN** the admin chooses Reset all
- **THEN** a warning names that someone is still playing
- **AND** the times are cleared only after the admin confirms

#### Scenario: Reset with nobody playing
- **GIVEN** no team is running
- **WHEN** the admin confirms Reset all
- **THEN** the times are cleared
- **AND** the team names remain

### Requirement: An admin sets the office patch code
The admin view SHALL show the office's current patch code and let the admin replace it, with feedback for success, refusal, running teams and an expired session.

#### Scenario: Current code is shown
- **GIVEN** an admin signed in for Argentina
- **WHEN** the admin view opens
- **THEN** a "Patch code" section is the first section and its field shows Argentina's current code

#### Scenario: Another office
- **GIVEN** an admin signed in for Chile
- **WHEN** the admin view opens
- **THEN** the field shows Chile's code, not Argentina's

#### Scenario: Default code notice
- **GIVEN** an office still using the default code
- **WHEN** the admin view opens
- **THEN** a notice says the office is still using the default code and asks the admin to save their own

#### Scenario: Save a valid code
- **GIVEN** the admin typed a valid new code
- **WHEN** the admin presses Save code or Enter
- **THEN** the notice says the code was saved and applies to the next code teams enter
- **AND** the default-code notice is gone

#### Scenario: The default stops working
- **GIVEN** an office whose admin saved a new code and a team with a started session
- **WHEN** the team types the old default in Y2K Patch
- **THEN** the code is not accepted
- **AND** typing the new code is accepted

#### Scenario: Refused code
- **GIVEN** the admin typed an empty code, a code shorter than 4 or longer than 32 letters or numbers, one with unsupported characters, or the default code
- **WHEN** the admin saves
- **THEN** the message returned by the server is shown, the field keeps its text and focus, and the stored code is unchanged

#### Scenario: Teams are playing
- **GIVEN** at least one team has started and not finished
- **WHEN** the admin saves a code
- **THEN** the window asks "Someone is still playing. Change the code anyway?"
- **AND** cancelling leaves the stored code unchanged, and confirming saves it

#### Scenario: Teams already finished
- **GIVEN** a finished team
- **WHEN** the admin saves a new code
- **THEN** the finished team keeps its time and place on the podium

#### Scenario: Each office keeps its own code
- **GIVEN** the Argentina admin saved a code
- **WHEN** the Chile admin opens the view
- **THEN** Chile's code is unchanged

#### Scenario: Expired admin session
- **GIVEN** an admin whose token is no longer accepted
- **WHEN** the admin saves a code
- **THEN** the admin login is shown with "Your admin session expired. Sign in again."

#### Scenario: Code can not be loaded
- **GIVEN** the API returns an error for the code
- **WHEN** the admin view opens
- **THEN** the section says the code could not be loaded, Save is disabled, and the rest of the admin view works

#### Scenario: Keyboard
- **GIVEN** focus is in the code field
- **WHEN** the admin presses Enter
- **THEN** the code is saved like pressing Save code

#### Scenario: Refresh does not discard typing
- **GIVEN** the admin typed a new code and did not save
- **WHEN** the admin presses Refresh board
- **THEN** the typed text stays in the field
