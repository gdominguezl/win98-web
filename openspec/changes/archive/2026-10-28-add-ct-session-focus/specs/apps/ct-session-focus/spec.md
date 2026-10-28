# Spec Delta

## Purpose

Keeps teams focused during a session by hiding apps unrelated to the challenges and putting MS-DOS Prompt first in Programs, and hides Buy me a coffee from the menu at all times.

## ADDED Requirements

### Requirement: Unrelated apps are hidden during a session
The system SHALL hide a fixed list of unrelated apps from the desktop, the desktop Games folder and Start > Programs while an Argentina or Chile team's session is running, without deleting any shortcut.

#### Scenario: Desktop
- **GIVEN** a team session is running
- **WHEN** the desktop is shown
- **THEN** Desktop Themes, Agent and Network Neighborhood are not shown
- **AND** Internet Explorer, eSheep and the other desktop icons are still shown

#### Scenario: Games
- **GIVEN** a team session is running
- **WHEN** the Games folder is opened
- **THEN** Diablo, Commander Keen, Doom and Quake are not listed
- **AND** Minesweeper and the other games are still listed

#### Scenario: Programs
- **GIVEN** a team session is running
- **WHEN** the Programs menu is opened
- **THEN** App Maker, DOS Games Downloader, Task Manager, Report a Bug, Mouse, Sound Scheme Explorer, Flash Player and Media Player are not listed
- **AND** folders left empty by the filter are not listed

#### Scenario: Restored after the session
- **GIVEN** a session that stops running
- **WHEN** the station is removed
- **THEN** every hidden app is listed again with no shortcut recreated

#### Scenario: Both offices, nobody else
- **GIVEN** an Argentina team, a Chile team, and a tab with no team session
- **WHEN** each opens the desktop and the Programs menu
- **THEN** both teams see the filtered lists and the tab without a session sees every app

### Requirement: MS-DOS Prompt is first in Programs during a session
The system SHALL show MS-DOS Prompt as the first item of the Start > Programs list while a team session is running.

#### Scenario: Pinned
- **GIVEN** a team session is running
- **WHEN** the Programs menu is opened
- **THEN** MS-DOS Prompt is the first item, above the folders

#### Scenario: Normal order outside a session
- **GIVEN** no running session
- **WHEN** the Programs menu is opened
- **THEN** the order is unchanged

### Requirement: Buy me a coffee is always hidden
The system SHALL NOT list Buy me a coffee in the Start menu, with or without a session, including profiles that already stored its shortcut.

#### Scenario: Returning profile
- **GIVEN** a browser profile that already has the stored Buy me a coffee shortcut
- **WHEN** the Programs menu is opened
- **THEN** it is not listed
