# Spec Delta

## MODIFIED Requirements

### Requirement: A correct code saves the system
The system SHALL send the typed code to the server, SHALL accept it only when the server accepts it, and SHALL then show the desktop confirmation that the crash was stopped.

#### Scenario: Exact code
- **GIVEN** this tab has a running team session and the patch has not been applied in this tab
- **WHEN** the user submits the configured code
- **THEN** the server records the finish
- **AND** a short install sequence plays over the desktop
- **AND** the desktop then shows that the patch is installed and files, memories, and messages will survive midnight

#### Scenario: Loose typing
- **GIVEN** this tab has a running team session
- **WHEN** the user submits the configured code with different letter case, extra spaces, or dashes
- **THEN** the server accepts it the same way as the exact code

#### Scenario: Past 60 minutes
- **GIVEN** the desktop countdown shows Game over
- **WHEN** the user submits the configured code
- **THEN** the server records the finish
- **AND** the success sequence plays
- **AND** Game over is no longer shown

#### Scenario: Same tab
- **GIVEN** the patch was accepted in this browser tab
- **WHEN** the user opens Y2K Patch again without closing the tab
- **THEN** the window shows that the patch is already installed
- **AND** it does not ask for the code again and does not replay the desktop sequence

#### Scenario: New tab
- **GIVEN** the server already finished this team's session
- **WHEN** the user starts that team in a new tab and submits the code
- **THEN** the window shows that the patch is already installed
- **AND** the desktop sequence does not replay

## ADDED Requirements

### Requirement: The patch needs a live session
The window SHALL NOT play the success sequence when this tab has no team session, or when the server says the team was reset.

#### Scenario: No session
- **GIVEN** this tab has not started a team
- **WHEN** the user submits a code
- **THEN** the window tells them to start a session in Improving CT October
- **AND** the success sequence does not play

#### Scenario: Reset team
- **GIVEN** the server says this team was reset
- **WHEN** the user submits the configured code
- **THEN** the window says the team was reset and to contact the admin or start a new session
- **AND** the success sequence does not play
