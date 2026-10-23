# apps/y2k-patch Specification

## Purpose

Lets a player type the recovered Y2K patch code and see the desktop confirm that the system was saved before midnight.

## Requirements

### Requirement: Y2K Patch is on the desktop and in Programs
The system SHALL show a Y2K Patch shortcut on the desktop and under Start > Programs.

#### Scenario: Fresh desktop
- **GIVEN** a desktop that has never had the Y2K Patch shortcut
- **WHEN** the desktop finishes booting
- **THEN** a Y2K Patch icon is visible on the desktop
- **AND** Start > Programs lists Y2K Patch

#### Scenario: Returning desktop
- **GIVEN** a desktop saved before this app existed
- **WHEN** the desktop boots again
- **THEN** the Y2K Patch icon is restored

### Requirement: One patch window
The window SHALL open as a small fixed utility, SHALL allow only one instance, and SHALL be closable from its title bar and with the keyboard.

#### Scenario: Open from the desktop
- **GIVEN** the desktop is visible
- **WHEN** the user double-clicks Y2K Patch
- **THEN** one window titled Y2K Patch is visible
- **AND** it is not maximized
- **AND** it contains a code field and an OK button

#### Scenario: Open again
- **GIVEN** the Y2K Patch window is already open
- **WHEN** the user launches Y2K Patch again
- **THEN** no second window appears and the existing window is focused

#### Scenario: Keyboard
- **GIVEN** the code field is focused
- **WHEN** the user presses Enter
- **THEN** the code is submitted the same way as clicking OK

#### Scenario: Short screen
- **GIVEN** a desktop shorter than 600 px
- **WHEN** the user opens Y2K Patch
- **THEN** the title bar and the OK button stay inside the visible desktop

### Requirement: A wrong code is rejected
The system SHALL refuse a code that does not match the configured patch code and SHALL leave the field editable.

#### Scenario: Wrong code
- **GIVEN** the patch has not been applied in this tab
- **WHEN** the user submits a code other than the configured one
- **THEN** a Windows 98-style error is shown in the window
- **AND** the desktop does not show the success message
- **AND** the user can edit the field and submit again

#### Scenario: Empty code
- **GIVEN** the code field is empty
- **WHEN** the user submits
- **THEN** the same error is shown and the success message does not appear

### Requirement: A correct code saves the system
The system SHALL accept the configured code ignoring letter case, spaces, and dashes, and SHALL then show a desktop-wide confirmation that the crash was stopped.

#### Scenario: Exact code
- **GIVEN** the patch has not been applied in this tab
- **WHEN** the user submits the configured code
- **THEN** a short install sequence plays over the desktop
- **AND** the desktop then shows that the patch is installed and files, memories, and messages will survive midnight

#### Scenario: Loose typing
- **GIVEN** the configured code is letters and digits
- **WHEN** the user submits that code with different letter case, extra spaces, or dashes
- **THEN** it is accepted the same way as the exact code

#### Scenario: Same tab
- **GIVEN** the patch was accepted in this browser tab
- **WHEN** the user opens Y2K Patch again without closing the tab
- **THEN** the window shows that the patch is already installed
- **AND** it does not ask for the code again and does not replay the desktop sequence

#### Scenario: New tab
- **GIVEN** the patch was accepted in another tab
- **WHEN** the user opens the desktop in a new tab
- **THEN** Y2K Patch asks for the code again
