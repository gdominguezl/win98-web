# apps/ct-station-argentina Specification

## Purpose
Gives Argentina teams a clue to find in the Windows 98 Recycle Bin while their session is running.

## Requirements

### Requirement: The Recycle Bin holds a clue image for Argentina
The system SHALL put one image in the Recycle Bin, with a restorable original location, while an Argentina team's session is running.

#### Scenario: Argentina team starts
- **GIVEN** an empty Recycle Bin and an Argentina team that starts its session
- **WHEN** the team opens the Recycle Bin
- **THEN** it contains one image with a neutral file name
- **AND** the Recycle Bin icon shows as full

#### Scenario: Restore and open
- **GIVEN** the clue image in the Recycle Bin
- **WHEN** the team restores it
- **THEN** it appears in My Documents and opens in the image viewer

#### Scenario: Other items are untouched
- **GIVEN** the Recycle Bin already holds a file that was deleted by a person
- **WHEN** the Argentina session starts and later stops
- **THEN** that file is still in the Recycle Bin, unchanged

### Requirement: Other offices and visitors see no clue
The system SHALL NOT add the image for Chile teams, admins, finished or ready teams, or browsers without a CT session.

#### Scenario: Chile team
- **GIVEN** a Chile team that starts its session
- **WHEN** the team opens the Recycle Bin
- **THEN** the clue image is not there

#### Scenario: No session
- **GIVEN** a browser that never started a CT session
- **WHEN** the user opens the Recycle Bin
- **THEN** it is as the user left it

### Requirement: The clue appears once and survives a reload
The system SHALL keep exactly one clue image while the Argentina session is running, also after a reload or when the team starts again.

#### Scenario: Reload during the game
- **GIVEN** a running Argentina session with the clue in the Recycle Bin
- **WHEN** the desktop reloads
- **THEN** the Recycle Bin still has exactly one clue image

#### Scenario: Restored before the reload
- **GIVEN** a clue the team already restored to My Documents
- **WHEN** the desktop reloads during the same running session
- **THEN** the restored image is not duplicated and the Recycle Bin gets a single clue item again

### Requirement: The clue is removed when the session stops running
The system SHALL remove the clue from the Recycle Bin, and the copy restored to My Documents, when the session finishes, is restarted, is reset or a new game starts.

#### Scenario: Patch accepted
- **GIVEN** a running Argentina session in which the team restored the clue
- **WHEN** the server accepts the patch code
- **THEN** the Recycle Bin no longer holds the clue and My Documents no longer holds the restored image
- **AND** the Recycle Bin icon returns to its state before the session

#### Scenario: Admin restart
- **GIVEN** a running Argentina session with the clue in the Recycle Bin
- **WHEN** an admin restarts that team and the desktop checks its session
- **THEN** the clue is removed

#### Scenario: Emptied by the team
- **GIVEN** a team that emptied the Recycle Bin during the game
- **WHEN** the session stops running
- **THEN** cleanup finishes without an error

### Requirement: The Recycle Bin keeps working for everyone
The Recycle Bin SHALL behave as before for normal deletes and restores, with or without the station.

#### Scenario: Normal delete and restore
- **GIVEN** a desktop with no CT session
- **WHEN** a user deletes a file and restores it from the Recycle Bin
- **THEN** it works as before

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
