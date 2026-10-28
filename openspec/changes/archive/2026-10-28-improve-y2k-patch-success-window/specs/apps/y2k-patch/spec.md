# Spec Delta

## MODIFIED Requirements

### Requirement: A correct code saves the system
The system SHALL send the typed code to the server, SHALL accept it only when the server accepts it, and SHALL then show a short install sequence followed by a large "Installation complete" window that confirms the crash was stopped.

#### Scenario: Exact code
- **GIVEN** this tab has a running team session and the patch has not been applied in this tab
- **WHEN** the user submits the configured code
- **THEN** the server records the finish
- **AND** a short install sequence with large text plays over the desktop and ends by itself
- **AND** the Y2K Patch window then shows the Installation complete screen at a larger size

#### Scenario: Loose typing
- **GIVEN** this tab has a running team session
- **WHEN** the user submits the configured code with different letter case, extra spaces, or dashes
- **THEN** the server accepts it the same way as the exact code

#### Scenario: Past 60 minutes
- **GIVEN** the desktop countdown shows Game over
- **WHEN** the user submits the configured code
- **THEN** the server records the finish
- **AND** the success sequence plays
- **AND** Game over is no longer shown

#### Scenario: Same tab
- **GIVEN** the patch was accepted in this browser tab
- **WHEN** the user opens Y2K Patch again without closing the tab
- **THEN** the window shows the Installation complete screen
- **AND** it does not ask for the code again and does not replay the desktop sequence

#### Scenario: New tab
- **GIVEN** the server already finished this team's session
- **WHEN** the user starts that team in a new tab and submits the code
- **THEN** the window shows the Installation complete screen
- **AND** the desktop sequence does not replay

## ADDED Requirements

### Requirement: The Installation complete screen
The Y2K Patch window SHALL show, after a successful finish, a Windows 98 styled screen with a pixel-art globe, the title Installation complete, the lines Code accepted., Critical failure avoided., System date stabilized. and All operations restored., a checklist of four items beside a fireworks scene dated 31/12/1999 - 23:59, a progress bar at 100%, a WELCOME TO 2000 banner and a Finish button that closes the window.

#### Scenario: Content
- **GIVEN** a team that finished
- **WHEN** the Installation complete screen is shown
- **THEN** it contains the title, the four lines, the four checklist items (Millennium crisis avoided, System files patched, Network functions restored, Global systems online), the date caption, 100%, WELCOME TO 2000 and Finish

#### Scenario: The code is not shown
- **GIVEN** the team typed the code and it was accepted
- **WHEN** the Installation complete screen is shown
- **THEN** the typed code appears nowhere in the window

#### Scenario: Finish
- **GIVEN** the Installation complete screen
- **WHEN** the user presses Finish
- **THEN** the window closes

#### Scenario: Fits the desktop
- **GIVEN** a short desktop
- **WHEN** the Installation complete screen is shown
- **THEN** the window is larger than the code form and fits the visible desktop
