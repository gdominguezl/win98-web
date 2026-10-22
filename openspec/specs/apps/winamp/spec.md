# apps/winamp Specification

## Purpose
Lets users open the running Winamp web app of the MSN project from the Windows 98 desktop inside a Win98 window, while keeping the classic Webamp player as a hidden backup.

## Requirements

### Requirement: Winamp on the desktop opens the MSN Winamp
The desktop SHALL show a "Winamp" shortcut that opens the MSN app's `/winamp` page in a Win98 window.

#### Scenario: Fresh profile
- **GIVEN** a browser with no previous Windows 98 state
- **WHEN** the system finishes booting
- **THEN** the desktop shows one icon labeled "Winamp" that targets the MSN Winamp app

#### Scenario: Double click
- **GIVEN** the desktop is visible
- **WHEN** the user double-clicks "Winamp"
- **THEN** a window titled "Winamp" opens with a taskbar button and a frame that loads the MSN app at `/winamp`

#### Scenario: Keyboard and Start menu
- **GIVEN** the "Winamp" icon is selected, or Start, Programs is open
- **WHEN** the user presses Enter or clicks "Winamp" in Programs
- **THEN** the same window opens

#### Scenario: User deleted the shortcut
- **GIVEN** a user who deleted the "Winamp" desktop icon
- **WHEN** the system boots again
- **THEN** the icon is restored and targets the MSN Winamp

### Requirement: Existing users are migrated without losing layout
The system SHALL, once per profile, repoint the default "Winamp" desktop shortcut and the "Winamp" entry under Start, Programs from the classic player to the MSN Winamp, preserving the icon's position on the desktop.

#### Scenario: Returning user with the old shortcut
- **GIVEN** a persisted desktop and Programs menu whose "Winamp" shortcuts launch the classic player, and no migration marker
- **WHEN** the system boots
- **THEN** both shortcuts launch the MSN Winamp, the icon keeps its desktop position and no duplicate "Winamp" icon appears

#### Scenario: Already migrated
- **GIVEN** a profile with the migration marker
- **WHEN** the user pointed a "Winamp" shortcut back at the classic player and the system boots
- **THEN** that shortcut is not changed

#### Scenario: Shortcuts outside the defaults
- **GIVEN** a StartUp or user-created shortcut to the classic player
- **WHEN** the migration runs
- **THEN** that shortcut still launches the classic player

#### Scenario: Unreadable shortcut
- **GIVEN** a "Winamp" shortcut file that is not valid JSON
- **WHEN** the migration runs
- **THEN** boot continues normally and the file is skipped

### Requirement: Classic Webamp is archived, not removed
The system SHALL keep the classic Webamp player registered and launchable, titled "Winamp Classic", but SHALL NOT list it on the desktop or in Start, Programs by default.

#### Scenario: Not listed
- **GIVEN** a fresh or migrated profile
- **WHEN** the user looks at the desktop and opens Start, Programs
- **THEN** only "Winamp" (the MSN one) is shown, not "Winamp Classic"

#### Scenario: Playlist files still open in the classic player
- **GIVEN** an `.m3u` file in the file system
- **WHEN** the user opens it
- **THEN** the classic Webamp player opens and plays it

#### Scenario: Launch by id
- **GIVEN** the system has booted
- **WHEN** `window.System.launchApp("webamp")` runs
- **THEN** the classic player opens in `#webamp-container`

#### Scenario: Assistant tour
- **GIVEN** the Agent tour reaches the Winamp step
- **WHEN** the step opens the app
- **THEN** it opens the MSN Winamp window

### Requirement: Winamp window size and lifecycle
The window SHALL open at 640x480, not maximized, SHALL be resizable, minimizable and maximizable, SHALL allow only one instance, and closing it SHALL remove the frame and taskbar button.

#### Scenario: Default size
- **GIVEN** a desktop of at least 1440x900
- **WHEN** the user opens Winamp
- **THEN** the window is 640x480 and not maximized

#### Scenario: Launched twice or minimized
- **GIVEN** an open or minimized Winamp window
- **WHEN** the user launches Winamp again
- **THEN** no second window is created, the existing one is focused or restored and the frame is not reloaded

#### Scenario: Close
- **GIVEN** an open Winamp window with a track playing
- **WHEN** the user closes the window
- **THEN** the frame is removed with its taskbar button and playback stops

### Requirement: Winamp URL follows the MSN base URL and session
The framed URL SHALL be the MSN base URL (`VITE_MSN_URL` or `/`) joined with `/winamp`, and a same-origin frame SHALL share the MSN session.

#### Scenario: Signed in
- **GIVEN** a user signed in to MSN on the same origin
- **WHEN** the user opens Winamp
- **THEN** the Winamp page loads without asking to sign in

#### Scenario: Signed out
- **GIVEN** a browser with no MSN session
- **WHEN** the user opens Winamp
- **THEN** the window shows the MSN login page and the desktop stays usable

#### Scenario: Signing in inside the window
- **GIVEN** a signed-out Winamp window showing the MSN login page
- **WHEN** the user completes the sign-in
- **THEN** the frame shows what MSN shows after login (its home), and closing and reopening Winamp loads the Winamp page signed in

#### Scenario: Winamp disabled in MSN
- **GIVEN** an MSN build with `VITE_ENABLE_WINAMP=false`
- **WHEN** the user opens Winamp
- **THEN** the window shows whatever MSN shows for the unknown route and the desktop stays usable

### Requirement: Frame is usable, accessible and visually consistent
The frame SHALL be named "Winamp", SHALL NOT be sandboxed, SHALL allow autoplay, and SHALL have a white background behind transparent pages.

#### Scenario: Accessible name
- **GIVEN** an open Winamp window
- **WHEN** assistive technology reads the frame
- **THEN** its title is "Winamp"

#### Scenario: MSN unavailable
- **GIVEN** the URL cannot be loaded
- **WHEN** the user opens Winamp
- **THEN** the window shows the browser's frame error, the desktop stays responsive and the window closes normally

#### Scenario: Inactivity
- **GIVEN** an open same-origin Winamp window and a short screensaver timeout
- **WHEN** the user keeps interacting in the frame
- **THEN** the screensaver does not start
