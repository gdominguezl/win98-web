# apps/msn-messenger Specification

## Purpose
Lets users open the running MSN Messenger web app from the Windows 98 desktop, inside a Win98 window, as if it were an installed program.

## Requirements

### Requirement: MSN Messenger appears on the desktop
The system SHALL show a "MSN Messenger" shortcut on the desktop of every user, including users whose persisted desktop predates this app.

#### Scenario: Fresh profile
- **GIVEN** a browser with no previous Windows 98 state
- **WHEN** the system finishes booting
- **THEN** the desktop shows an icon labeled "MSN Messenger"

#### Scenario: Returning user with existing desktop
- **GIVEN** a browser whose persisted desktop already has other shortcuts but no MSN Messenger shortcut
- **WHEN** the system boots
- **THEN** the desktop shows the "MSN Messenger" icon and the existing shortcuts are unchanged

#### Scenario: User deleted the shortcut
- **GIVEN** a user who deleted the "MSN Messenger" desktop icon
- **WHEN** the system boots again
- **THEN** the icon is restored, as for the other default shortcuts

### Requirement: MSN Messenger is listed under Start menu Programs
The system SHALL list "MSN Messenger" directly under Start, Programs.

#### Scenario: Start menu entry
- **GIVEN** the system has booted
- **WHEN** the user opens Start, then Programs
- **THEN** an entry "MSN Messenger" with the Messenger icon is present and launches the app

### Requirement: Double click opens MSN in a window
The system SHALL open a Windows 98 window titled "MSN Messenger" that contains the MSN app in a frame filling the window content, when the user double-clicks the desktop icon.

#### Scenario: Launch from the desktop
- **GIVEN** the desktop is visible
- **WHEN** the user double-clicks "MSN Messenger"
- **THEN** a window titled "MSN Messenger" opens with a taskbar button and a frame that loads the configured MSN URL

#### Scenario: Launch with the keyboard
- **GIVEN** the "MSN Messenger" desktop icon is selected
- **WHEN** the user presses Enter
- **THEN** the same window opens

#### Scenario: Launch from Start menu
- **GIVEN** the Start menu is open on Programs
- **WHEN** the user clicks "MSN Messenger"
- **THEN** the same window opens

### Requirement: Single instance
The system SHALL allow at most one MSN Messenger window at a time.

#### Scenario: Launched twice
- **GIVEN** an open MSN Messenger window
- **WHEN** the user launches MSN Messenger again from the desktop or Start menu
- **THEN** no second window is created and the existing window is focused

#### Scenario: Launched while minimized
- **GIVEN** a minimized MSN Messenger window
- **WHEN** the user launches MSN Messenger again
- **THEN** the existing window is restored and focused and the framed MSN session is not reloaded

### Requirement: MSN URL is configurable per build
The framed URL SHALL be the value of the build-time variable `VITE_MSN_URL` when set, and `/` otherwise.

#### Scenario: Default URL
- **GIVEN** a build without `VITE_MSN_URL`
- **WHEN** the window opens
- **THEN** the frame loads `/` of the current origin

#### Scenario: Custom URL
- **GIVEN** a build with `VITE_MSN_URL=http://localhost:5179`
- **WHEN** the window opens
- **THEN** the frame loads `http://localhost:5179`

### Requirement: Window opens compact like the original Messenger
The window SHALL open smaller than the desktop work area and not maximized, taller than it is wide like the original Messenger contact list, so other desktop content stays visible around it. The user MUST be able to enlarge it.

#### Scenario: Default size
- **GIVEN** a desktop of at least 1440x900
- **WHEN** the user opens MSN Messenger
- **THEN** the window is 529x796, not maximized, narrower than half of the desktop width and shorter than the desktop height, and desktop icons remain visible beside it

#### Scenario: Enlarging
- **GIVEN** the compact MSN Messenger window
- **WHEN** the user drags a window edge or clicks the maximize button
- **THEN** the window grows and the frame content resizes to fill it

### Requirement: Window lifecycle matches other apps
The window SHALL be resizable, minimizable and maximizable, and closing it SHALL remove the frame and its taskbar button.

#### Scenario: Resize and maximize
- **GIVEN** an open MSN Messenger window
- **WHEN** the user resizes or maximizes it
- **THEN** the frame fills the new content area with no border or scrollbar of its own

#### Scenario: Close and reopen
- **GIVEN** a signed-in MSN session in the open window
- **WHEN** the user closes the window and opens MSN Messenger again
- **THEN** a new frame loads MSN and the user is still signed in (the MSN session lives in browser storage)

#### Scenario: Drag over the frame
- **GIVEN** an open MSN Messenger window
- **WHEN** the user drags the window by its title bar across the screen
- **THEN** the window follows the pointer without the frame swallowing the drag

### Requirement: Frame stays usable and accessible
The frame SHALL expose the accessible name "MSN Messenger" and SHALL NOT be sandboxed, so MSN sign-in popups, storage and audio keep working.

#### Scenario: Accessible name
- **GIVEN** an open MSN Messenger window
- **WHEN** assistive technology reads the frame
- **THEN** its title is "MSN Messenger"

#### Scenario: Microsoft sign-in popup
- **GIVEN** the MSN login page is shown in the frame on the same origin as the desktop
- **WHEN** the user clicks "Sign In with Microsoft"
- **THEN** the sign-in popup opens and, once completed, the signed-in MSN view replaces the login page in the frame

### Requirement: MSN being unavailable does not break the desktop
The desktop and all other apps SHALL keep working when the MSN URL cannot be loaded.

#### Scenario: MSN server unreachable
- **GIVEN** the MSN URL returns an error or does not respond
- **WHEN** the user opens MSN Messenger
- **THEN** the window opens and shows the browser's frame error content, the rest of the desktop stays responsive and the window can be closed normally

### Requirement: Inactivity timer follows user activity in the frame
Typing or moving the mouse inside the frame SHALL reset the desktop inactivity timer when the frame is same-origin, so the screensaver does not start during use.

#### Scenario: Active in a same-origin frame
- **GIVEN** an open same-origin MSN Messenger window and a short screensaver timeout
- **WHEN** the user keeps typing in the frame for longer than the timeout
- **THEN** the screensaver does not start

#### Scenario: Cross-origin frame in development
- **GIVEN** `VITE_MSN_URL` points to a different origin
- **WHEN** the user interacts with the frame
- **THEN** the app logs a warning that inactivity listeners could not be attached and keeps working
