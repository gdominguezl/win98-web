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

### Requirement: Argentina HELP shows the short help screen
The system SHALL print a short help screen for `HELP` in MS-DOS Prompt while an Argentina session runs: only `Available commands:` followed by `HELP`, `DIR`, `CD`, `TYPE` and `CLS` with one description line each, so the whole output fits the default window without scrolling.

#### Scenario: HELP during the session
- **GIVEN** the running Argentina session
- **WHEN** the team types `HELP`
- **THEN** the short help text is printed starting with `Available commands:`, and `CLS` listed there clears the screen

#### Scenario: Help is not a clue file
- **GIVEN** the running Argentina session
- **WHEN** the team lists `C:\THROWBACK`
- **THEN** no help file appears in the folder

#### Scenario: HELP outside the session
- **GIVEN** no running Argentina session
- **WHEN** a user types `HELP`
- **THEN** the default help is printed

### Requirement: Argentina teams get HELP_PANTALLA.TXT on the desktop
The system SHALL create `C:\WINDOWS\Desktop\HELP_PANTALLA.TXT` while an Argentina team's session runs, a byte-exact copy of the supplied `HELP_PANTALLA.txt` (the full MS-DOS command reference, including the `EXAMPLES` section) that opens in Notepad.

#### Scenario: File present during the session
- **GIVEN** a running Argentina session
- **WHEN** the team looks at the desktop
- **THEN** `HELP_PANTALLA.TXT` is there and its bytes equal the supplied file

#### Scenario: File removed
- **GIVEN** an Argentina session that stops running
- **WHEN** the station is removed
- **THEN** `HELP_PANTALLA.TXT` no longer exists

#### Scenario: Chile and no session
- **GIVEN** a Chile session or no session
- **WHEN** the desktop is listed
- **THEN** `HELP_PANTALLA.TXT` is not present

### Requirement: MS-DOS Prompt opens in C:\ for Argentina and Chile teams
The system SHALL open new MS-DOS Prompt windows in `C:\` while an Argentina or a Chile session runs and SHALL keep the default directory otherwise.

#### Scenario: CD as in the help text
- **GIVEN** a new MS-DOS Prompt during an Argentina session
- **WHEN** the team types `CD THROWBACK`
- **THEN** the prompt moves to `C:\THROWBACK`
