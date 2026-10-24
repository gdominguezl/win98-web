# Spec Delta

## ADDED Requirements

### Requirement: Argentina teams get the Communication System file
The system SHALL show a desktop text file named "Communication System" with the supplied signals reference while an Argentina team's session is running.

#### Scenario: File on the desktop
- **GIVEN** an Argentina team that started its session
- **WHEN** the desktop is shown
- **THEN** it has a "Communication System" text file

#### Scenario: Opens in Notepad
- **GIVEN** the running session
- **WHEN** the team opens the file
- **THEN** Notepad shows the supplied `SIGNALS.TXT` content unchanged

#### Scenario: File removed
- **GIVEN** a session that stops running
- **WHEN** the station is removed
- **THEN** the desktop file no longer exists
