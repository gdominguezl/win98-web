# Spec Delta

## MODIFIED Requirements

### Requirement: Winamp window size and lifecycle
The window SHALL open with a content area (the framed page) of 901x592, not maximized, limited to the visible desktop on small screens, SHALL be resizable, minimizable and maximizable, SHALL allow only one instance, and closing it SHALL remove the frame and taskbar button.

#### Scenario: Default size
- **GIVEN** a desktop of at least 1440x900
- **WHEN** the user opens Winamp
- **THEN** the framed page area is 901x592 (within 1 px), the window is not maximized, and the Winamp page shows its desktop layout with the player, playlist and effects window without scrolling

#### Scenario: Small screen
- **GIVEN** a desktop area shorter than the Winamp window
- **WHEN** the user opens Winamp
- **THEN** the window is limited to the desktop area and its bottom edge is above the taskbar

#### Scenario: Launched twice or minimized
- **GIVEN** an open or minimized Winamp window
- **WHEN** the user launches Winamp again
- **THEN** no second window is created, the existing one is focused or restored and the frame is not reloaded

#### Scenario: Close
- **GIVEN** an open Winamp window with a track playing
- **WHEN** the user closes the window
- **THEN** the frame is removed with its taskbar button and playback stops
