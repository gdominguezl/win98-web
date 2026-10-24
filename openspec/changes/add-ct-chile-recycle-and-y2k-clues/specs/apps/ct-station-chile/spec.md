# Spec Delta

## ADDED Requirements

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
