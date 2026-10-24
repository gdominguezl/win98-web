# Spec Delta

## ADDED Requirements

### Requirement: Argentina teams get the THROWBACK folder
The system SHALL create `C:\THROWBACK` containing exactly `MEMORY.TXT`, `ERROR.LOG` and `PLANO.TXT` while an Argentina team's session is running.

#### Scenario: Argentina team lists the folder
- **GIVEN** an Argentina team that started its session
- **WHEN** the team runs `DIR` in `C:\THROWBACK`
- **THEN** exactly those three files are listed

#### Scenario: Files are the supplied ones
- **GIVEN** the running Argentina session
- **WHEN** the team types each file
- **THEN** the content equals the supplied Argentina file, and `PLANO.TXT` is not Chile's drawing

#### Scenario: Folder removed
- **GIVEN** an Argentina session that stops running
- **WHEN** the station is removed
- **THEN** `C:\THROWBACK` no longer exists

### Requirement: Argentina HELP shows the supplied help screen
The system SHALL print the supplied help screen for `HELP` in MS-DOS Prompt while an Argentina session runs, and SHALL NOT store it as a file.

#### Scenario: HELP during the session
- **GIVEN** the running Argentina session
- **WHEN** the team types `HELP`
- **THEN** the supplied help text is printed, and `CLS` listed there clears the screen

#### Scenario: Help is not a clue file
- **GIVEN** the running Argentina session
- **WHEN** the team lists `C:\THROWBACK`
- **THEN** no help file appears

#### Scenario: HELP outside the session
- **GIVEN** no running Argentina session
- **WHEN** a user types `HELP`
- **THEN** the default help is printed

### Requirement: MS-DOS Prompt opens in C:\ for Argentina teams
The system SHALL open new MS-DOS Prompt windows in `C:\` while an Argentina session runs and SHALL keep the default directory otherwise.

#### Scenario: CD as in the help text
- **GIVEN** a new MS-DOS Prompt during an Argentina session
- **WHEN** the team types `CD THROWBACK`
- **THEN** the prompt moves to `C:\THROWBACK`
