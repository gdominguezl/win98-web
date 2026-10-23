# Spec Delta

## ADDED Requirements

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
