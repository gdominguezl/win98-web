# Spec Delta

## Purpose

Gives Chile teams a folder of clue files in the MS-DOS Prompt while their session is running.

## ADDED Requirements

### Requirement: Chile teams get the THROWBACK folder
The system SHALL create `C:\THROWBACK` with `MEMORY.TXT`, `ERROR.LOG` and `PLANO.TXT` while a Chile team's session is running.

#### Scenario: Chile team starts
- **GIVEN** a Chile team that starts its session
- **WHEN** the team lists `C:\THROWBACK`
- **THEN** it shows `MEMORY.TXT`, `ERROR.LOG` and `PLANO.TXT`
- **AND** Explorer shows the same folder under drive C

#### Scenario: MEMORY.TXT
- **GIVEN** the running Chile session
- **WHEN** the team opens `MEMORY.TXT`
- **THEN** it reads "MEMORY BANK UNAVAILABLE." and "ACCESS RESERVED FOR FINAL DIAGNOSTIC."

#### Scenario: ERROR.LOG
- **GIVEN** the running Chile session
- **WHEN** the team opens `ERROR.LOG`
- **THEN** it lists "23:51 — CLOCK DESYNCHRONIZED", "23:54 — AUDIO MEMORY RECOVERED", "23:57 — LOCATION MAP CORRUPTED" and "23:59 — AGE CALCULATION FAILED"

#### Scenario: PLANO.TXT
- **GIVEN** the running Chile session
- **WHEN** the team opens `PLANO.TXT`
- **THEN** the terminal clears and shows a colored drawing of a telephone inside a closed space, taken from the supplied `PLANO.TXT`, fully visible in the default MS-DOS Prompt window

### Requirement: HELP shows simple instructions during a Chile session
The system SHALL make the MS-DOS Prompt `HELP` command show exactly three instructions in Spanish while a Chile team's session is running.

#### Scenario: HELP during the session
- **GIVEN** a running Chile session and an MS-DOS Prompt window
- **WHEN** the team types `HELP`
- **THEN** it shows "DIR             Muestra los archivos disponibles.", "TYPE ARCHIVO    Abre un archivo de texto." and "CD CARPETA      Ingresa a una carpeta."
- **AND** nothing else

#### Scenario: HELP outside a Chile session
- **GIVEN** no running Chile session, an Argentina session, or an admin
- **WHEN** a user types `HELP`
- **THEN** the usual MS-DOS Prompt help list is shown

### Requirement: DOS names ignore letter case
The MS-DOS Prompt SHALL find files and folders for `DIR`, `CD` and `TYPE` when only the letter case of the name differs, and SHALL keep exact names working as before.

#### Scenario: Lowercase names
- **GIVEN** `C:\THROWBACK\PLANO.TXT`
- **WHEN** the team types `cd \throwback` and then `type plano.txt`
- **THEN** the folder is entered and the drawing is shown

#### Scenario: Prompt shows the real name
- **GIVEN** the team typed `cd throwback`
- **WHEN** the prompt is shown
- **THEN** it reads `C:\THROWBACK>`

#### Scenario: Exact names
- **GIVEN** a file whose exact name exists
- **WHEN** the user types that exact name in `DIR`, `CD` or `TYPE`
- **THEN** it behaves as before

#### Scenario: Missing name
- **GIVEN** no file or folder matches even ignoring case
- **WHEN** the user types a name in `CD` or `TYPE`
- **THEN** the same error as before is shown

### Requirement: The folder is removed when the session stops running
The system SHALL delete `C:\THROWBACK` with everything inside it, and restore the normal `HELP`, when the session finishes, is restarted, is reset or a new game starts.

#### Scenario: Patch accepted
- **GIVEN** a running Chile session
- **WHEN** the server accepts the patch code
- **THEN** `C:\THROWBACK` no longer exists and `HELP` shows the usual list

#### Scenario: Files added by the team
- **GIVEN** a team that created a file inside `C:\THROWBACK`
- **WHEN** the session stops running
- **THEN** the folder and that file are gone

#### Scenario: Admin restart
- **GIVEN** a running Chile session
- **WHEN** an admin restarts that team and the desktop checks its session
- **THEN** the folder is removed

### Requirement: Other offices and visitors see no folder
The system SHALL NOT create `C:\THROWBACK` for Argentina teams, admins, ready or finished teams, or browsers without a CT session.

#### Scenario: Argentina team
- **GIVEN** an Argentina team that starts its session
- **WHEN** the team lists drive C
- **THEN** there is no `THROWBACK` folder

### Requirement: The clues survive a reload
The system SHALL keep the folder, its files and the simple `HELP` after the desktop reloads during the same running session, without duplicates.

#### Scenario: Reload
- **GIVEN** a running Chile session
- **WHEN** the desktop reloads and the team opens an MS-DOS Prompt
- **THEN** the folder has the three files and `HELP` shows the simple lines
