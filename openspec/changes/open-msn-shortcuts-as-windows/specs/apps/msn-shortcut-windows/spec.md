# Spec Delta

## Purpose

Makes the app switcher buttons of the MSN project (MSN, Fotolog, Winamp), when shown inside a Windows 98 window, open the matching Win98 window instead of navigating the frame, so the apps behave like separate programs.

## ADDED Requirements

### Requirement: Switcher buttons open separate windows
Inside any MSN Messenger, Fotolog or Winamp window, a plain click on an app switcher button SHALL open (or focus) the Win98 window of the target app and SHALL NOT navigate the clicked frame.

#### Scenario: From MSN to Winamp
- **GIVEN** an open MSN Messenger window showing the Winamp button
- **WHEN** the user clicks the Winamp button
- **THEN** a "Winamp" window opens (or is focused) and the MSN Messenger frame stays on the MSN page

#### Scenario: From MSN to Fotolog
- **GIVEN** an open MSN Messenger window showing the Fotolog button
- **WHEN** the user clicks the Fotolog button
- **THEN** a "Fotolog" window opens (or is focused) and the MSN Messenger frame stays on the MSN page

#### Scenario: From Winamp or Fotolog to MSN
- **GIVEN** an open Winamp (or Fotolog) window showing the MSN button
- **WHEN** the user clicks the MSN button
- **THEN** the MSN Messenger window opens or is focused, no second MSN window appears and the Winamp (or Fotolog) frame stays on its page

#### Scenario: Between Winamp and Fotolog
- **GIVEN** an open Winamp window showing the Fotolog button
- **WHEN** the user clicks it
- **THEN** a "Fotolog" window opens or is focused

### Requirement: Existing windows are reused
Clicking a switcher button whose target app already has a window SHALL focus that window, restoring it when minimized, without reloading its frame.

#### Scenario: Target already open
- **GIVEN** an open Fotolog window and an open MSN Messenger window
- **WHEN** the user clicks the Fotolog button in the MSN window
- **THEN** the Fotolog window comes to the front and keeps its state

#### Scenario: Target minimized
- **GIVEN** a minimized Winamp window
- **WHEN** the user clicks the Winamp button inside the MSN window
- **THEN** the Winamp window is restored and focused and its frame is not reloaded

### Requirement: Keyboard access keeps working
Activating a switcher button with the keyboard SHALL behave like a click.

#### Scenario: Enter on a focused button
- **GIVEN** the Winamp button inside the MSN window has keyboard focus
- **WHEN** the user presses Enter
- **THEN** the Winamp window opens or is focused

### Requirement: Other interactions are not changed
Only plain primary clicks on the switcher buttons SHALL be intercepted; other clicks and other links SHALL keep their normal behavior.

#### Scenario: Modified click
- **GIVEN** a switcher button inside a frame
- **WHEN** the user clicks it while holding Ctrl, Meta, Shift or Alt, or with a non-primary mouse button
- **THEN** the browser's normal behavior happens and no Win98 window is opened by the interception

#### Scenario: Other links
- **GIVEN** a link in the frame that is not a switcher button
- **WHEN** the user clicks it
- **THEN** it behaves as before

#### Scenario: MSN opened outside Win98
- **GIVEN** the MSN app opened directly in a browser tab
- **WHEN** the user clicks a switcher button
- **THEN** it navigates inside that tab exactly as before (no Win98 involved)

### Requirement: Interception survives frame reloads
The interception SHALL work again after the frame document is replaced.

#### Scenario: Reload inside the window
- **GIVEN** an MSN Messenger window whose frame was reloaded
- **WHEN** the user clicks a switcher button
- **THEN** the matching Win98 window opens

### Requirement: Failure falls back to the original behavior
When the interception cannot be applied, the buttons SHALL keep navigating inside the frame and the desktop SHALL keep working.

#### Scenario: Cross-origin frame in development
- **GIVEN** `VITE_MSN_URL` points to a different origin
- **WHEN** a window opens
- **THEN** a warning is logged once and the buttons navigate inside the frame as before

#### Scenario: Target app not available
- **GIVEN** a switcher button whose target app is not registered
- **WHEN** the user clicks it
- **THEN** the click is not intercepted

#### Scenario: Markup changed in MSN
- **GIVEN** a frame page without the switcher markup
- **WHEN** the window opens and the user interacts
- **THEN** nothing breaks and no error is logged
