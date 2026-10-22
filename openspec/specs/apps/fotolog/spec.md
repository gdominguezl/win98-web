# apps/fotolog Specification

## Purpose
Lets users open the running Fotolog web app from the Windows 98 desktop, inside a Win98 window, as if it were an installed program.

## Requirements

### Requirement: Fotolog appears on the desktop
The system SHALL show a "Fotolog" shortcut on the desktop of every user, including users whose persisted desktop predates this app.

#### Scenario: Fresh profile
- **GIVEN** a browser with no previous Windows 98 state
- **WHEN** the system finishes booting
- **THEN** the desktop shows an icon labeled "Fotolog"

#### Scenario: Returning user with existing desktop
- **GIVEN** a browser whose persisted desktop has other shortcuts but no Fotolog shortcut
- **WHEN** the system boots
- **THEN** the desktop shows the "Fotolog" icon and the existing shortcuts are unchanged

#### Scenario: User deleted the shortcut
- **GIVEN** a user who deleted the "Fotolog" desktop icon
- **WHEN** the system boots again
- **THEN** the icon is restored, as for the other default shortcuts

### Requirement: Fotolog is listed under Start menu Programs
The system SHALL list "Fotolog" directly under Start, Programs.

#### Scenario: Start menu entry
- **GIVEN** the system has booted
- **WHEN** the user opens Start, then Programs
- **THEN** an entry "Fotolog" with the Fotolog icon is present and launches the app

### Requirement: Double click opens Fotolog in a window
The system SHALL open a Windows 98 window titled "Fotolog" containing the Fotolog page of the MSN app, filling the window content, when the user double-clicks the desktop icon.

#### Scenario: Launch from the desktop
- **GIVEN** the desktop is visible
- **WHEN** the user double-clicks "Fotolog"
- **THEN** a window titled "Fotolog" opens with a taskbar button and a frame that loads the MSN app at `/fotolog`

#### Scenario: Launch with the keyboard
- **GIVEN** the "Fotolog" desktop icon is selected
- **WHEN** the user presses Enter
- **THEN** the same window opens

#### Scenario: Launch from Start menu
- **GIVEN** the Start menu is open on Programs
- **WHEN** the user clicks "Fotolog"
- **THEN** the same window opens

### Requirement: Fotolog URL follows the MSN base URL
The framed URL SHALL be the MSN base URL (`VITE_MSN_URL` when set, `/` otherwise) joined with `/fotolog`.

#### Scenario: Default base
- **GIVEN** a build without `VITE_MSN_URL`
- **WHEN** the window opens
- **THEN** the frame loads `/fotolog` of the current origin

#### Scenario: Custom base
- **GIVEN** a build with `VITE_MSN_URL=http://localhost:5179`
- **WHEN** the window opens
- **THEN** the frame loads `http://localhost:5179/fotolog`

### Requirement: Signed-out users reach the login
The frame SHALL show whatever the MSN app shows for `/fotolog`, which is its login page when the user has no MSN session, and SHALL share the MSN session when the origin is the same.

#### Scenario: Signed in through MSN
- **GIVEN** a user signed in to MSN in the same browser and origin
- **WHEN** the user opens Fotolog
- **THEN** the Fotolog page of that user loads without asking to sign in again

#### Scenario: Signed out
- **GIVEN** a browser with no MSN session
- **WHEN** the user opens Fotolog
- **THEN** the window shows the MSN login page and the rest of the desktop stays usable

#### Scenario: Signing in inside the window
- **GIVEN** a signed-out Fotolog window showing the MSN login page
- **WHEN** the user completes the sign-in
- **THEN** the frame shows what MSN shows after login (its home), and closing and reopening Fotolog loads the Fotolog page signed in

### Requirement: Window opens as a wide content window
The window SHALL open at 1024x768, not maximized, and the user MUST be able to resize and maximize it.

#### Scenario: Default size
- **GIVEN** a desktop of at least 1440x900
- **WHEN** the user opens Fotolog
- **THEN** the window is 1024x768 and not maximized, and desktop icons remain visible beside it

#### Scenario: Low-resolution screen
- **GIVEN** a desktop shorter than 768 px
- **WHEN** the user opens Fotolog
- **THEN** the window can still be moved by its title bar and maximized to fit

### Requirement: Single instance and lifecycle
The system SHALL allow at most one Fotolog window; the window SHALL be resizable, minimizable and maximizable, and closing it SHALL remove the frame and its taskbar button.

#### Scenario: Launched twice
- **GIVEN** an open Fotolog window
- **WHEN** the user launches Fotolog again
- **THEN** no second window is created and the existing one is focused

#### Scenario: Launched while minimized
- **GIVEN** a minimized Fotolog window
- **WHEN** the user launches Fotolog again
- **THEN** the window is restored and focused and the frame is not reloaded

#### Scenario: Drag over the frame
- **GIVEN** an open Fotolog window
- **WHEN** the user drags it by its title bar
- **THEN** the window follows the pointer without the frame swallowing the drag

### Requirement: Frame is usable, accessible and visually consistent
The frame SHALL expose the accessible name "Fotolog", SHALL NOT be sandboxed, and SHALL have a white background so transparent MSN pages do not show the window gray.

#### Scenario: Accessible name
- **GIVEN** an open Fotolog window
- **WHEN** assistive technology reads the frame
- **THEN** its title is "Fotolog"

#### Scenario: Transparent document
- **GIVEN** a framed page with no background color
- **WHEN** it renders in the window
- **THEN** the area behind it is white, not ButtonFace gray

### Requirement: MSN being unavailable does not break the desktop
The desktop and all other apps SHALL keep working when the Fotolog URL cannot be loaded.

#### Scenario: MSN server unreachable
- **GIVEN** the URL returns an error or does not respond
- **WHEN** the user opens Fotolog
- **THEN** the window opens with the browser's frame error content, the desktop stays responsive and the window closes normally

### Requirement: Inactivity timer follows user activity in the frame
Typing or moving the mouse inside a same-origin frame SHALL reset the desktop inactivity timer.

#### Scenario: Active in a same-origin frame
- **GIVEN** an open same-origin Fotolog window and a short screensaver timeout
- **WHEN** the user keeps typing in the frame longer than the timeout
- **THEN** the screensaver does not start

#### Scenario: Cross-origin frame in development
- **GIVEN** `VITE_MSN_URL` points to a different origin
- **WHEN** the user interacts with the frame
- **THEN** the app logs a warning that inactivity listeners could not be attached and keeps working

### Requirement: MSN Messenger keeps its behavior after sharing the frame helper
The MSN Messenger window SHALL behave exactly as specified in `apps/msn-messenger` after it is moved onto the shared frame helper.

#### Scenario: Existing MSN spec
- **GIVEN** the helper refactor
- **WHEN** `e2e/msn_messenger.spec.js` runs unchanged
- **THEN** all its cases pass
