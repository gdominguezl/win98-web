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
