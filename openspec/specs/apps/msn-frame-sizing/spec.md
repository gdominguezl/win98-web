# apps/msn-frame-sizing Specification

## Purpose

Makes MSN Messenger, Fotolog and Winamp windows open fully inside the visible desktop, above the taskbar, even on small screens.

## Requirements

### Requirement: Windows never open under the taskbar
The system SHALL limit the initial size of an MSN Messenger, Fotolog or Winamp window to the visible desktop area and SHALL position it fully inside that area.

#### Scenario: Small laptop screen
- **GIVEN** a desktop area shorter than the configured window height (for example about 650 px tall)
- **WHEN** the user opens MSN Messenger
- **THEN** the window is as tall as the desktop area at most, its title bar is visible at the top and its bottom edge is above the taskbar

#### Scenario: Wide window on a narrow desktop
- **GIVEN** a desktop area narrower than the configured window width
- **WHEN** the user opens Fotolog
- **THEN** the window is no wider than the desktop area and is fully inside it

#### Scenario: Window that already fits
- **GIVEN** a desktop of at least 1440x900
- **WHEN** the user opens MSN Messenger or Fotolog
- **THEN** the window keeps its configured size (529x796 and 1024x768)

#### Scenario: Very small desktop
- **GIVEN** a desktop area smaller than the minimum window size
- **WHEN** the user opens any of the three apps
- **THEN** the window opens at the smallest allowed size or the available area, nothing throws, and the window can be moved, resized and maximized

### Requirement: Fitted windows stay fully usable
A window that was reduced to fit SHALL remain resizable, minimizable, maximizable and single-instance.

#### Scenario: Maximize and restore
- **GIVEN** a window that opened reduced on a small desktop
- **WHEN** the user maximizes it and then restores it
- **THEN** it returns to the reduced size and position, still inside the desktop area

#### Scenario: Enlarging
- **GIVEN** a window that opened reduced
- **WHEN** the user drags an edge
- **THEN** it can grow, the content resizes, and nothing is clamped by this requirement after opening
