# apps/ct-station-chile Specification

## Purpose
Gives Chile teams a folder of clue files in the MS-DOS Prompt while their session is running.

## Requirements

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
The system SHALL make the MS-DOS Prompt `HELP` command show the three requested instructions in Spanish first, followed by a short list of other useful instructions, while a Chile team's session is running.

#### Scenario: HELP during the session
- **GIVEN** a running Chile session and an MS-DOS Prompt window
- **WHEN** the team types `HELP`
- **THEN** the first three lines are "DIR             Muestra los archivos disponibles.", "TYPE ARCHIVO    Abre un archivo de texto." and "CD CARPETA      Ingresa a una carpeta."
- **AND** a short block follows with "CLS", "HELP" and "EXIT" and their Spanish descriptions
- **AND** the usual English command list is not shown

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

### Requirement: Chile teams get MORSE.TXT
The system SHALL create `C:\My Documents\MORSE.TXT` with a Morse translation table and three transmissions while a Chile team's session is running, without changing the contents of `C:\THROWBACK`.

#### Scenario: Content
- **GIVEN** a Chile team that started its session
- **WHEN** the team opens `MORSE.TXT`
- **THEN** a letter table is followed by transmissions 01, 02 and 03 with the exact Morse text
- **AND** transmission 02 decodes to `TELEVISOR` with the table

#### Scenario: THROWBACK unchanged
- **GIVEN** the running Chile session
- **WHEN** the team lists `C:\THROWBACK`
- **THEN** it still shows only `MEMORY.TXT`, `ERROR.LOG` and `PLANO.TXT`

#### Scenario: File removed
- **GIVEN** a session that stops running
- **WHEN** the station is removed
- **THEN** `MORSE.TXT` no longer exists

### Requirement: Chile teams get a Recycle Bin clue
The system SHALL show at least four files in the Recycle Bin while a Chile team's session runs: `VACACIONES_1998.BMP`, `TAREA_FINAL_FINAL.DOC`, `NO_ABRIR.TXT` and `BACKUP_2359.TXT`, restorable to `C:\My Documents`.

#### Scenario: Bin content
- **GIVEN** a Chile team that started its session
- **WHEN** the team opens the Recycle Bin
- **THEN** the four files are listed with deletion times and the bin icon is full

#### Scenario: Correct file
- **GIVEN** the running session
- **WHEN** the team restores and opens `BACKUP_2359.TXT`
- **THEN** it shows the three supplied lines

#### Scenario: Cleanup
- **GIVEN** a session that stops running
- **WHEN** the station is removed
- **THEN** the four bin items and any restored copies are gone

### Requirement: Chile teams get the Y2K memory puzzle
The system SHALL create `C:\My Documents\SYSTEM\ERROR.LOG` and `MEMORY.TXT` with the supplied texts while a Chile team's session runs.

#### Scenario: Files
- **GIVEN** a running Chile session
- **WHEN** the team opens the two files
- **THEN** ERROR.LOG shows the Y2K age failure text and MEMORY.TXT shows MEMORIA 1 to 4, without the answer text

#### Scenario: THROWBACK unchanged
- **GIVEN** the running Chile session
- **WHEN** the team lists `C:\THROWBACK`
- **THEN** its files are unchanged

#### Scenario: Cleanup
- **GIVEN** a session that stops running
- **WHEN** the station is removed
- **THEN** `C:\My Documents\SYSTEM` no longer exists

### Requirement: Chile teams get PUERTA.BMP
The system SHALL create `C:\My Documents\PUERTA.BMP` while a Chile team's session runs, an image that looks empty and reveals `BUSCA A QUIEN CUIDA QUIÉN ENTRA Y QUIÉN SALE` after the background is filled with another color in Paint.

#### Scenario: Image looks empty
- **GIVEN** a running Chile session
- **WHEN** the team opens `PUERTA.BMP` in Paint
- **THEN** the image looks like a uniform background

#### Scenario: Fill reveals the message
- **GIVEN** `PUERTA.BMP` open in Paint
- **WHEN** the team floods the background with Fill With Color
- **THEN** the message and the doorbell become readable in the original color

#### Scenario: File removed
- **GIVEN** a session that stops running
- **WHEN** the station is removed
- **THEN** `PUERTA.BMP` no longer exists

### Requirement: Paint File > Open defaults to the BMP type during a Chile session
The system SHALL preselect `24-bit Bitmap (*.bmp;*.dib)` in the "Files of type" selection of Paint's Open dialog while a Chile session runs, so `PUERTA.BMP` is listed without a manual filter change.

#### Scenario: Dialog preselects the BMP type
- **GIVEN** a running Chile session and `PUERTA.BMP` in `C:\My Documents`
- **WHEN** the team opens File > Open in Paint
- **THEN** the selected type is `24-bit Bitmap (*.bmp;*.dib)` and `PUERTA.BMP` appears in the file list

#### Scenario: Default restored after the session
- **GIVEN** a Chile session that stopped running
- **WHEN** a user opens File > Open in Paint
- **THEN** the "Files of type" selection is the default first entry

#### Scenario: Other sessions unaffected
- **GIVEN** an Argentina session or no session
- **WHEN** a user opens File > Open in Paint
- **THEN** the "Files of type" selection is the default first entry
