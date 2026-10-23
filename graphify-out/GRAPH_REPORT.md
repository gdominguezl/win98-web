# Graph Report - win98-web  (2026-10-23)

## Corpus Check
- 407 files · ~542,700 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 477 file(s) not represented in the graph (top: .cur 196, .ico 97, .css 82)

## Summary
- 4642 nodes · 9528 edges · 259 communities (163 shown, 96 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 364 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a550b74d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- desktop-context-menu-builder.js
- ADDED Requirements
- ADDED Requirements
- Application
- IconManager
- Requirements
- explorer-app.js
- initDesktop
- theme-manager.js
- image-manipulation.js
- ADDED Requirements
- ZenExplorerApp
- FreeCellApp
- app.js
- functions.js
- StartMenu
- launchApp
- releaseBusyState
- helpers.js
- os-init.js
- edit-colors.js
- Requirements
- app-state.js
- ms-agent.js
- resume
- MenuBarBuilder
- NotepadApp
- ADDED Requirements
- Requirements
- improving-ct-october-app.js
- enqueueRequest
- taskbar.js
- verify_container.sh
- about-app.js
- DisplayPropertiesApp
- msn_app_links.spec.js
- Tasks
- Image Resizer
- help.js
- zenfs-utils.js
- CalculatorLogic
- ADDED Requirements
- drive-manager.js
- Requirement: An admin manages the office
- Tasks
- electron-main.js
- Proposal
- DragDropManager
- Requirement: An admin manages the office
- joinPath
- MSN Messenger
- Requirements
- createMsnFrameWindow
- Requirements
- Design
- Proposal
- make_canvas
- .stat
- ADDED Requirements
- Requirement: An admin sets the office patch code
- parse-theme.js
- Requirement: A correct code saves the system
- getPathName
- Proposal
- improving_ct_october.spec.js
- MinesweeperApp
- simulate-random-gestures.js
- Tasks
- Proposal: Semantic HTML Improvements for Windows 98 Web Edition
- DiabloApp
- SpiderSolitaireApp
- wallpapers.js
- Changelog
- getItem
- Winamp
- globals.d.ts
- Theme to CSS App
- DoomApp
- DesktopThemesApp
- esheep.js
- Fotolog
- load
- eye-gaze-mode.js
- NavigationHistory
- Requirement: A correct code saves the system
- Windows 98 Web Edition
- CalculatorApp
- DOSShell
- Pile
- App Maker
- Proposal
- HelpApp
- @playwright/test
- Proposal
- Tool
- Requirement: Windows never open under the taskbar
- Requirement: Windows never open under the taskbar
- DosGamesDownloaderApp
- Game
- agent.js
- Architecture
- ct-mock.js
- DefragApp
- ImageViewerApp
- Proposal
- SolitaireApp
- WordPadApp
- color-schemes.js
- FlashPlayerApp
- TableauPile
- IconScheme
- KeenApp
- PaintApp
- Tasks
- Tasks
- Proposal
- Game
- Windows 98 Web Edition: AI Agent Development Guidelines
- openspec-explore/SKILL.md
- $Window
- ask
- Screensaver
- Application
- winamp.spec.js
- loadSpriteSheet
- CursorItem
- Proposal
- constructor
- Tooltip
- How to Add a New Desktop Theme
- emit
- Requirement: Winamp window size and lifecycle
- Toolbar
- InternetExplorerExtension
- FotologApp
- Tasks
- makeDraggable
- Tasks
- SoundSchemeExplorerApp
- Y2K Patch
- Improving CT October
- spider-solitaire/game.js
- Windows 98 Web Edition: AI Agent Development Guidelines
- Design
- app-localization.js
- Design
- view_bitmap
- Tasks
- MsnMessengerApp
- apps/README.md
- Pile
- dependencies
- theme.js
- WinampApp
- system/floppy-manager.js
- ImageResizerApp
- discord-activity-client.js
- PdfViewerApp
- speak
- AddressBar
- Adding New Applications
- .showWinDialog
- Statistics
- MenuBar
- DosBoxApp
- Windows 98 Web Edition
- OnCanvasObject
- OnCanvasSelection
- Disk Defragmenter
- DXBallApp
- Minesweeper
- Notepad App
- Card
- ._showSingleProperties
- SEO and Search Discovery Guide
- Buggy Program
- Support the Project
- MS-DOS Prompt
- CursorExplorerApp
- eSheep
- Flash Player
- FreeCell
- Media Player
- I$Component
- SystemHooks
- vaporwave-fun.js
- PDF Viewer App
- 3D Pinball
- PrinceOfPersiaApp
- Prince of Persia
- Quake
- Report a Bug
- Solitaire
- PinballApp
- Spider Solitaire
- Tip of the Day App
- Webamp App
- package.json
- utils.js
- batch_update_readmes.sh
- Calculator
- Desktop Themes
- Image Viewer
- Paint
- Window
- Sound Scheme Explorer
- Task Manager (Close Program)
- WordPad
- toolbar-icons.js
- busy-state-manager.js
- About App
- Display Properties
- SoundItem
- How to Add a New Screensaver
- MenuPopup
- Cursor Explorer
- DOS Games Downloader
- PixelContext
- test-news.js
- copy-inkscape-labels.js
- LocalStore
- file-downloader.js
- verify_changes.sh
- I$ColorBox
- I$ToolBox
- agents.js
- system/clipboard-manager.js
- button
- ctrl
- file_format
- file_name
- fill_color
- helper_layer
- pointer
- pointer_buttons
- pointer_previous
- pointer_start
- pointer_type
- reverse
- selection
- shift
- stroke_color
- system_file_handle
- textbox
- thumbnail_canvas
- $thumbnail_window

## God Nodes (most connected - your core abstractions)
1. `ShowDialogWindow()` - 144 edges
2. `Application` - 102 edges
3. `getItem()` - 77 edges
4. `ICONS` - 72 edges
5. `setItem()` - 66 edges
6. `ZenExplorerApp` - 51 edges
7. `CalculatorLogic` - 50 edges
8. `joinPath()` - 46 edges
9. `launchApp()` - 44 edges
10. `@zenfs/core` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: Known profile path` --references--> `resume()`  [INFERRED]
  openspec/changes/archive/2026-10-21-add-container-image/specs/container-delivery/spec.md → ms-agent.js
- `Proposed Changes:` --references--> `ShowDialogWindow()`  [INFERRED]
  public/docs/semantic-html-proposal.md → src/shared/components/dialog-window.js
- `Open Questions` --references--> `createMsnFrameWindow()`  [INFERRED]
  openspec/changes/archive/2026-10-22-add-fotolog-app/design.md → src/shared/utils/msn-frame.js
- `What Changes` --references--> `createMsnFrameWindow()`  [INFERRED]
  openspec/changes/archive/2026-10-22-fit-msn-windows-to-desktop/proposal.md → src/shared/utils/msn-frame.js
- `Core Systems (`src/system/`)` --references--> `RecycleBinManager`  [INFERRED]
  AGENTS.md → src/shell/explorer/file-operations/recycle-bin-manager.js

## Import Cycles
- 3-file cycle: `src/apps/paint/src/functions.js -> src/apps/paint/src/tools.js -> src/apps/paint/src/tool-options.js -> src/apps/paint/src/functions.js`
- 3-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/system/directory.js -> src/config/apps.js`
- 3-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/start-menu/start-menu-utils.js -> src/config/apps.js`
- 3-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/explorer/extensions/control-panel-extension.js -> src/config/apps.js`
- 3-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/explorer/interface/file-icon-renderer.js -> src/config/apps.js`
- 3-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/system/app-manager.js -> src/config/apps.js`
- 3-file cycle: `src/shell/taskbar/taskbar.js -> src/system/app-manager.js -> src/system/application.js -> src/shell/taskbar/taskbar.js`
- 3-file cycle: `src/system/busy-state-manager.js -> src/system/cursor-manager.js -> src/system/theme-manager.js -> src/system/busy-state-manager.js`
- 4-file cycle: `src/apps/paint/src/OnCanvasSelection.js -> src/apps/paint/src/tools.js -> src/apps/paint/src/tool-options.js -> src/apps/paint/src/functions.js -> src/apps/paint/src/OnCanvasSelection.js`
- 4-file cycle: `src/apps/webamp/webamp.js -> src/system/app-manager.js -> src/config/apps.js -> src/config/app-registry.js -> src/apps/webamp/webamp.js`
- 4-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/explorer/extensions/desktop-extension.js -> src/system/directory.js -> src/config/apps.js`
- 4-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/explorer/file-operations/properties-manager.js -> src/system/directory.js -> src/config/apps.js`
- 4-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/explorer/file-operations/sort-utils.js -> src/system/directory.js -> src/config/apps.js`
- 4-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/explorer/interface/directory-view.js -> src/system/directory.js -> src/config/apps.js`
- 4-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/explorer/interface/file-icon-renderer.js -> src/system/directory.js -> src/config/apps.js`
- 4-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/start-menu/start-menu-utils.js -> src/system/directory.js -> src/config/apps.js`
- 4-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/explorer/interface/menu-bar-builder.js -> src/shell/start-menu/start-menu-utils.js -> src/config/apps.js`
- 4-file cycle: `src/config/apps.js -> src/shell/explorer/explorer-app.js -> src/shell/start-menu/start-menu-utils.js -> src/system/app-manager.js -> src/config/apps.js`
- 4-file cycle: `src/shell/start-menu/start-menu-utils.js -> src/system/app-manager.js -> src/system/application.js -> src/shell/taskbar/taskbar.js -> src/shell/start-menu/start-menu-utils.js`
- 4-file cycle: `src/apps/agent/agent.js -> src/system/app-manager.js -> src/config/apps.js -> src/config/app-registry.js -> src/apps/agent/agent.js`

## Communities (259 total, 96 thin omitted)

### Community 2 - "desktop-context-menu-builder.js"
Cohesion: 0.15
Nodes (20): launchDisplayPropertiesApp(), PALETTES, settingsTab, DesktopContextMenuBuilder, applyColorMode(), COLOR_MODES, getColorModes(), getCurrentColorMode() (+12 more)

### Community 3 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Purpose, Requirement: Double click opens Fotolog in a window, Requirement: Fotolog appears on the desktop, Requirement: Fotolog is listed under Start menu Programs, Requirement: Fotolog URL follows the MSN base URL, Requirement: Frame is usable, accessible and visually consistent, Requirement: Inactivity timer follows user activity in the frame (+29 more)

### Community 4 - "ADDED Requirements"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Purpose, Requirement: Cache policy keeps the PWA updatable, Requirement: Health endpoint for orchestration, Requirement: Missing files return the Blue Screen page, Requirement: Prefix redirect is host-agnostic, Requirement: Profile deep links boot the app, Requirement: Reproducible image build (+17 more)

### Community 5 - "Application"
Cohesion: 0.07
Nodes (17): @zenfs/emscripten, BuyMeACoffeeApp, WAD_NAMES, EPISODE_NAMES, showMessageBox_implementation(), appRegistry, cursors, iconSchemes (+9 more)

### Community 7 - "Requirements"
Cohesion: 0.05
Nodes (37): apps/fotolog Specification, Purpose, Requirement: Double click opens Fotolog in a window, Requirement: Fotolog appears on the desktop, Requirement: Fotolog is listed under Start menu Programs, Requirement: Fotolog URL follows the MSN base URL, Requirement: Frame is usable, accessible and visually consistent, Requirement: Inactivity timer follows user activity in the frame (+29 more)

### Community 8 - "explorer-app.js"
Cohesion: 0.13
Nodes (23): @zenfs/core, fileAssociations, SHORTCUT_OVERLAY, AnimatedLogo(), mountedDisks, RemovableDiskManager, ClipboardManager, sortFileInfos() (+15 more)

### Community 9 - "initDesktop"
Cohesion: 0.12
Nodes (9): applyMonitorType(), DesktopController, getMonitorType(), initDesktop(), refreshIcons(), setupIcons(), updateCutIcons(), ShellManager (+1 more)

### Community 10 - "theme-manager.js"
Cohesion: 0.15
Nodes (27): applyCssVariables(), applyPropertiesToPreview(), applyThemeToPreview(), fetchThemeCss(), parseCssVariables(), themeCssCache, applyCustomColorScheme(), applyStylesheet() (+19 more)

### Community 11 - "image-manipulation.js"
Cohesion: 0.05
Nodes (59): extra_tools, memoize_synchronous_function(), bresenham_dense_line(), bresenham_line(), clamp_brush_sizes(), compute_bezier(), copy_contents_within_polygon(), createShaderProgram() (+51 more)

### Community 12 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Purpose, Requirement: Double click opens MSN in a window, Requirement: Frame stays usable and accessible, Requirement: Inactivity timer follows user activity in the frame, Requirement: MSN being unavailable does not break the desktop, Requirement: MSN Messenger appears on the desktop, Requirement: MSN Messenger is listed under Start menu Programs (+26 more)

### Community 13 - "ZenExplorerApp"
Cohesion: 0.06
Nodes (5): StatusBar, ZenExplorerApp, DirectoryView, KeyboardHandler, Sidebar

### Community 14 - "FreeCellApp"
Cohesion: 0.06
Nodes (9): Card, RANKS, FreeCellApp, Game, RANKS, SUITS, DEFAULTS, OptionsManager (+1 more)

### Community 15 - "app.js"
Cohesion: 0.04
Nodes (44): $app, $bottom, $canvas, $canvas_area, canvas_handles, canvas_pointer_move(), $colorbox, $H (+36 more)

### Community 16 - "functions.js"
Cohesion: 0.05
Nodes (92): reset_for_next_test(), $about_paint_content, apply_file_format_and_palette_info(), are_you_sure(), cancel(), change_some_url_params(), change_url_param(), choose_file_to_paste() (+84 more)

### Community 17 - "StartMenu"
Cohesion: 0.08
Nodes (3): showShutdownScreen(), StartMenu, Taskbar

### Community 18 - "launchApp"
Cohesion: 0.09
Nodes (37): Decisions, 3. System, BuggyProgramApp, TipOfTheDayApp, tipOfTheDayContent, apps, staticConfigs, systemApps (+29 more)

### Community 19 - "releaseBusyState"
Cohesion: 0.10
Nodes (7): updateScreensaverPreview(), DriveManager, handleFileSystemError(), FileOperations, ProgressBarShowDialogWindow, releaseBusyState(), requestBusyState()

### Community 20 - "helpers.js"
Cohesion: 0.10
Nodes (21): adjust_segments(), apply_segments(), $Component(), get_segments(), eachFont(), $FontBox(), $Toggle(), select_tool() (+13 more)

### Community 21 - "os-init.js"
Cohesion: 0.09
Nodes (18): profiles, createMainUI(), audioPreloadMap, preloadAudio(), preloadCursor(), preloadImage(), preloadThemeAssets(), finalizeBootProcessStep() (+10 more)

### Community 22 - "edit-colors.js"
Cohesion: 0.15
Nodes (21): update_palette_from_theme(), basic_colors, color_ramp(), custom_colors, default_palette, get_winter_palette(), lerp(), monochrome_palette_as_colors (+13 more)

### Community 23 - "Requirements"
Cohesion: 0.06
Nodes (34): apps/msn-messenger Specification, Purpose, Requirement: Double click opens MSN in a window, Requirement: Frame stays usable and accessible, Requirement: Inactivity timer follows user activity in the frame, Requirement: MSN being unavailable does not break the desktop, Requirement: MSN Messenger appears on the desktop, Requirement: MSN Messenger is listed under Start menu Programs (+26 more)

### Community 24 - "app-state.js"
Cohesion: 0.04
Nodes (49): airbrush_size, aliasing, brush_shape, brush_size, current_history_node, default_airbrush_size, default_brush_shape, default_brush_size (+41 more)

### Community 25 - "ms-agent.js"
Cohesion: 0.04
Nodes (20): draw(), executeTransition(), getTTSVoices(), parse(), parseAnimationSection(), parseBalloonSection(), parseBranchingSection(), parseCharacterInfo() (+12 more)

### Community 26 - "resume"
Cohesion: 0.11
Nodes (18): resume(), Context, Decisions, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs, 1. Container smoke test (written first) (+10 more)

### Community 28 - "NotepadApp"
Cohesion: 0.10
Nodes (3): NotepadApp, NotepadEditor, ThemeToCssApp

### Community 29 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Purpose, Requirement: Classic Webamp is archived, not removed, Requirement: Existing users are migrated without losing layout, Requirement: Frame is usable, accessible and visually consistent, Requirement: Winamp on the desktop opens the MSN Winamp, Requirement: Winamp URL follows the MSN base URL and session, Requirement: Winamp window size and lifecycle (+23 more)

### Community 30 - "Requirements"
Cohesion: 0.06
Nodes (32): apps/winamp Specification, Purpose, Requirement: Classic Webamp is archived, not removed, Requirement: Existing users are migrated without losing layout, Requirement: Frame is usable, accessible and visually consistent, Requirement: Winamp on the desktop opens the MSN Winamp, Requirement: Winamp URL follows the MSN base URL and session, Requirement: Winamp window size and lifecycle (+24 more)

### Community 31 - "improving-ct-october-app.js"
Cohesion: 0.06
Nodes (57): Context, Decisions, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs, Capabilities, Impact (+49 more)

### Community 32 - "enqueueRequest"
Cohesion: 0.20
Nodes (15): animate(), animations(), delay(), enqueueRequest(), gestureAt(), getDirection(), hasAnimation(), interrupt() (+7 more)

### Community 33 - "taskbar.js"
Cohesion: 0.06
Nodes (22): Decisions, MediaPlayerApp, WebampApp, getWebampMenuItems(), CLASSES, createTaskbarButton(), createTrayIcon(), destroy() (+14 more)

### Community 34 - "verify_container.sh"
Cohesion: 0.46
Nodes (7): body_of(), fail(), header_value(), headers_of(), pass(), verify_container.sh script, status_of()

### Community 35 - "about-app.js"
Cohesion: 0.19
Nodes (3): aboutContent, AboutApp, launchAboutApp()

### Community 38 - "msn_app_links.spec.js"
Cohesion: 0.20
Nodes (6): clickLink(), FOTOLOG_LINK, frameDoc(), MSN_LINK, STUBS, WINAMP_LINK

### Community 39 - "Tasks"
Cohesion: 0.14
Nodes (15): 1. Code check, 2. Patch window, 3. Docs, 4. Validation, Tasks, Workflow follow-up, Context, Decisions (+7 more)

### Community 40 - "Image Resizer"
Cohesion: 0.33
Nodes (5): How to Use, Image Resizer, Key Features, Purpose, Screenshot

### Community 41 - "help.js"
Cohesion: 0.31
Nodes (5): $Iframe(), open_help_viewer(), renderItem(), show_help(), exports

### Community 42 - "zenfs-utils.js"
Cohesion: 0.08
Nodes (22): AppMakerApp, createPdfViewerContent(), appClasses, HIGHLIGHT_JS_THEMES, languages, SPECIAL_FOLDER_PATHS, renderHTML(), ShowFilePicker() (+14 more)

### Community 44 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Purpose, Requirement: Existing windows are reused, Requirement: Failure falls back to the original behavior, Requirement: Interception survives frame reloads, Requirement: Keyboard access keeps working, Requirement: Other interactions are not changed, Requirement: Switcher buttons open separate windows (+15 more)

### Community 45 - "drive-manager.js"
Cohesion: 0.38
Nodes (7): CDManager, FloppyManager, DriveService, getAllDiskHandles(), openDB(), removeDiskHandle(), saveDiskHandle()

### Community 46 - "Requirement: An admin manages the office"
Cohesion: 0.08
Nodes (25): ADDED Requirements, Purpose, Requirement: A crew starts or resumes a team, Requirement: An admin manages the office, Requirement: Improving CT October is on the desktop, Requirement: The desktop countdown, Scenario: Admin login, Scenario: Edit a team (+17 more)

### Community 47 - "Tasks"
Cohesion: 0.20
Nodes (9): 1. Failing e2e spec (RED), 2. Config, 3. System, 5. Docs and screenshot, 6. Manual verification, 7. Final validation, 8. Size update requested after review, Tasks (+1 more)

### Community 48 - "electron-main.js"
Cohesion: 0.05
Nodes (24): vite, vite-plugin-pwa, appsDirs, extractConfig(), generateRegistry(), { /*contextBridge,*/ ipcRenderer }, { isDev, isMacOS, initialFilePath }, menuFunctions (+16 more)

### Community 49 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 51 - "Requirement: An admin manages the office"
Cohesion: 0.08
Nodes (25): apps/improving-ct-october Specification, Purpose, Requirement: A crew starts or resumes a team, Requirement: An admin manages the office, Requirement: Improving CT October is on the desktop, Requirement: The desktop countdown, Requirements, Scenario: Admin login (+17 more)

### Community 52 - "joinPath"
Cohesion: 0.16
Nodes (3): RecycleBinExtension, RecycleBinManager, joinPath()

### Community 53 - "MSN Messenger"
Cohesion: 0.29
Nodes (7): Development, How to Use, Key Features, MSN Messenger, Purpose, Screenshot, Technologies Used

### Community 54 - "Requirements"
Cohesion: 0.08
Nodes (23): apps/msn-shortcut-windows Specification, Purpose, Requirement: Existing windows are reused, Requirement: Failure falls back to the original behavior, Requirement: Interception survives frame reloads, Requirement: Keyboard access keeps working, Requirement: Other interactions are not changed, Requirement: Switcher buttons open separate windows (+15 more)

### Community 55 - "createMsnFrameWindow"
Cohesion: 0.22
Nodes (12): Context, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs, createMsnFrameWindow(), fitToDesktop(), interceptAppShortcuts() (+4 more)

### Community 56 - "Requirements"
Cohesion: 0.09
Nodes (21): container-delivery Specification, Purpose, Requirement: Cache policy keeps the PWA updatable, Requirement: Health endpoint for orchestration, Requirement: Missing files return the Blue Screen page, Requirement: Prefix redirect is host-agnostic, Requirement: Reproducible image build, Requirement: Site is served under the /win98-web/ prefix (+13 more)

### Community 57 - "Design"
Cohesion: 0.22
Nodes (8): Context, 4. The app, Context, Decisions, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs

### Community 58 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 59 - "make_canvas"
Cohesion: 0.19
Nodes (9): render_canvas_view(), toggle_thumbnail(), update_helper_layer(), update_helper_layer_immediately(), get_rgba_from_color_implementation(), make_canvas(), draw_grid(), OnCanvasHelperLayer (+1 more)

### Community 61 - "ADDED Requirements"
Cohesion: 0.10
Nodes (19): ADDED Requirements, Purpose, Requirement: A correct code saves the system, Requirement: A wrong code is rejected, Requirement: One patch window, Requirement: Y2K Patch is on the desktop and in Programs, Scenario: Empty code, Scenario: Exact code (+11 more)

### Community 62 - "Requirement: An admin sets the office patch code"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: An admin sets the office patch code, Scenario: Another office, Scenario: Code can not be loaded, Scenario: Current code is shown, Scenario: Default code notice, Scenario: Each office keeps its own code, Scenario: Expired admin session (+8 more)

### Community 63 - "parse-theme.js"
Cohesion: 0.09
Nodes (22): applyCSSProperties(), generateThemePropertiesFromColors(), getColorsFromThemeFile(), getCursorsFromThemeFile(), getDesktopConfigFromThemeFile(), getIconsFromThemeFile(), getSoundsFromThemeFile(), getThemeCSSProperties() (+14 more)

### Community 64 - "Requirement: A correct code saves the system"
Cohesion: 0.08
Nodes (23): apps/y2k-patch Specification, Purpose, Requirement: A correct code saves the system, Requirement: A wrong code is rejected, Requirement: One patch window, Requirement: The patch needs a live session, Requirement: Y2K Patch is on the desktop and in Programs, Requirements (+15 more)

### Community 65 - "getPathName"
Cohesion: 0.07
Nodes (6): networkNeighborhood, ControlPanelExtension, DesktopExtension, NetworkNeighborhoodExtension, VirtualStats, getPathName()

### Community 66 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 67 - "improving_ct_october.spec.js"
Cohesion: 0.22
Nodes (3): freshCtState(), state(), 1. Mock and failing e2e specs (RED)

### Community 68 - "MinesweeperApp"
Cohesion: 0.12
Nodes (4): MinesweeperApp, MinesweeperGame, CHAR_MAP, SpriteDisplay

### Community 69 - "simulate-random-gestures.js"
Cohesion: 0.42
Nodes (8): choose(), $cursor, cursor_image, isAnyMenuOpen(), seededRandom(), simulateRandomGesture(), simulateRandomGesturesPeriodically(), simulatingGestures

### Community 70 - "Tasks"
Cohesion: 0.22
Nodes (8): 1. Failing e2e spec (RED), 2. Shared helper and icon (config and shared), 3. Apps, 4. System, 5. Docs, 6. Verification, 7. Final validation, Tasks

### Community 71 - "Proposal: Semantic HTML Improvements for Windows 98 Web Edition"
Cohesion: 0.06
Nodes (30): 10. Desktop Icons (`src/shell/desktop/desktop.js`, `src/shell/desktop/icon-manager.js`), 11. Specialized Dialogs (`src/shell/run-dialog.js`, `src/shell/shutdown-dialog.js`), 12. Status Bars (`src/shared/components/status-bar.js`), 1. Main Shell Structure (`src/shell/ui.js`), 2. Taskbar Components (`src/shell/taskbar/taskbar.js`), 3. Start Menu (`src/shell/start-menu/start-menu.js`), 4. Boot Screen (`index.html`), 5. Desktop Area (`src/shell/ui.js`) (+22 more)

### Community 72 - "DiabloApp"
Cohesion: 0.13
Nodes (3): DiabloApp, DiabloProgressDialog, DiabloStorage

### Community 75 - "Changelog"
Cohesion: 0.07
Nodes (29): [0.2.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.1.0...win98-web-v0.2.0) (2026-02-04), [0.3.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.2.0...win98-web-v0.3.0) (2026-02-05), [0.3.1](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.3.0...win98-web-v0.3.1) (2026-02-06), [0.4.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.3.1...win98-web-v0.4.0) (2026-02-06), [0.5.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.4.0...win98-web-v0.5.0) (2026-02-09), [0.6.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.5.0...win98-web-v0.6.0) (2026-02-12), [0.7.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.6.0...win98-web-v0.7.0) (2026-02-15), [0.8.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.7.0...win98-web-v0.8.0) (2026-02-18) (+21 more)

### Community 76 - "getItem"
Cohesion: 0.06
Nodes (29): animatedCardBacks, findBestDropTarget(), DEFAULTS, getAllOptions(), getOption(), options, OPTIONS_KEYS, setAllOptions() (+21 more)

### Community 77 - "Winamp"
Cohesion: 0.29
Nodes (7): Development, How to Use, Key Features, Purpose, Screenshot, Technologies Used, Winamp

### Community 78 - "globals.d.ts"
Cohesion: 0.07
Nodes (26): ActionMetadata, ActionMetadataUpdate, BrushShape, ColorSelectionSlot, Document, FileFormat, FontData, Handles (+18 more)

### Community 79 - "Theme to CSS App"
Cohesion: 0.33
Nodes (5): How to Use, Key Features, Purpose, Screenshot, Theme to CSS App

### Community 80 - "DoomApp"
Cohesion: 0.11
Nodes (9): DoomApp, DoomProgressDialog, Doom, How to Use, Key Features, Purpose, Screenshot, Technical Implementation (+1 more)

### Community 82 - "esheep.js"
Cohesion: 0.24
Nodes (7): ESheepApp, closeAllESheep(), getESheepMenuItems(), launchESheepApp(), setupObserver(), sheepInstances, showESheepContextMenu()

### Community 83 - "Fotolog"
Cohesion: 0.29
Nodes (7): Development, Fotolog, How to Use, Key Features, Purpose, Screenshot, Technologies Used

### Community 84 - "load"
Cohesion: 0.20
Nodes (11): getDefinition(), getSpriteHeight(), getSpriteWidth(), i(), normalizeDefinition(), setDefinition(), setInstantPosition(), setScale() (+3 more)

### Community 85 - "eye-gaze-mode.js"
Cohesion: 0.09
Nodes (10): apply_scale(), dwell_clicker, dwell_clicker_config, init_dwell_clicker(), init_tracky_mouse_ui(), update_auto_scaling(), update_floating_buttons(), undo() (+2 more)

### Community 87 - "Requirement: A correct code saves the system"
Cohesion: 0.15
Nodes (12): ADDED Requirements, MODIFIED Requirements, Requirement: A correct code saves the system, Requirement: The patch needs a live session, Scenario: Exact code, Scenario: Loose typing, Scenario: New tab, Scenario: No session (+4 more)

### Community 88 - "Windows 98 Web Edition"
Cohesion: 0.06
Nodes (33): Applications, Asset Sources, Assets, Core System, Credits, Development & Build Tools, Games, AI Assistant (+25 more)

### Community 91 - "Pile"
Cohesion: 0.12
Nodes (6): RANKS, FoundationPile, Pile, TableauPile, WastePile, SUIT_MAP

### Community 92 - "App Maker"
Cohesion: 0.33
Nodes (5): App Maker, How to Use, Key Features, Purpose, Screenshot

### Community 93 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 94 - "HelpApp"
Cohesion: 0.15
Nodes (7): HelpApp, How to Use, Implementation Details, Key Features, Purpose, Technologies Used, Windows Help

### Community 96 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 98 - "Requirement: Windows never open under the taskbar"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Fitted windows stay fully usable, Requirement: Windows never open under the taskbar, Scenario: Enlarging, Scenario: Maximize and restore, Scenario: Small laptop screen, Scenario: Very small desktop (+3 more)

### Community 99 - "Requirement: Windows never open under the taskbar"
Cohesion: 0.17
Nodes (11): apps/msn-frame-sizing Specification, Purpose, Requirement: Fitted windows stay fully usable, Requirement: Windows never open under the taskbar, Requirements, Scenario: Enlarging, Scenario: Maximize and restore, Scenario: Small laptop screen (+3 more)

### Community 102 - "agent.js"
Cohesion: 0.17
Nodes (14): AgentApp, askAgent(), findAndOpenFromStartMenu(), findIcon(), findWindowCloseButton(), getAgentMenuItems(), getElementCenter(), launchAgentApp() (+6 more)

### Community 103 - "Architecture"
Cohesion: 0.18
Nodes (10): Architecture, Core Logic, Development, Features, File Operations, Media Support, System Integration, UI Components (+2 more)

### Community 104 - "ct-mock.js"
Cohesion: 0.47
Nodes (8): activeId(), board(), handle(), installCt(), json(), normalizeCode(), sessionFor(), validatePatchCode()

### Community 107 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 110 - "color-schemes.js"
Cohesion: 0.10
Nodes (20): colorSchemes, ../shared/styles/color-schemes/60s-usa.css?inline, ../shared/styles/color-schemes/baseball.css?inline, ../shared/styles/color-schemes/blue.css?inline, ../shared/styles/color-schemes/dangerous-creatures.css?inline, ../shared/styles/color-schemes/inside-your-computer.css?inline, ../shared/styles/color-schemes/jungle.css?inline, ../shared/styles/color-schemes/leonardo-da-vinci.css?inline (+12 more)

### Community 116 - "Tasks"
Cohesion: 0.25
Nodes (7): 1. Failing e2e specs (RED), 2. App (iframe) and archive of classic, 4. Docs, 5. Verification, 6. Manual verification, 7. Final validation, Tasks

### Community 117 - "Tasks"
Cohesion: 0.25
Nodes (7): 1. Failing e2e spec (RED), 2. Shared helper, 3. Docs, 4. Verification, 5. Manual verification, 6. Final validation, Tasks

### Community 118 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 120 - "Windows 98 Web Edition: AI Agent Development Guidelines"
Cohesion: 0.11
Nodes (17): 1. Project Architecture, 2. Key Dependencies, 3. Development Patterns, 4. Development Workflow, 5. Release Management and Commit Guidelines, Adding a New Application, Application Integration, Automated Releases (+9 more)

### Community 121 - "openspec-explore/SKILL.md"
Cohesion: 0.16
Nodes (12): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, Planning a Change, The Stance, What You Don't Have To Do (+4 more)

### Community 122 - "$Window"
Cohesion: 0.16
Nodes (11): element_to_string(), find_tabstops(), $FormWindow(), $Window(), end_resize(), get_direction(), handle_pointermove(), make_focus_in_out_handler() (+3 more)

### Community 123 - "ask"
Cohesion: 0.26
Nodes (19): What You Might Do, add(), ask(), b(), f(), g(), h(), m() (+11 more)

### Community 125 - "Application"
Cohesion: 0.07
Nodes (16): Context, Decisions, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs, Context, Decisions (+8 more)

### Community 127 - "loadSpriteSheet"
Cohesion: 0.12
Nodes (21): bmpToCanvas(), decode(), decodeBlock(), decodeMonoBlock(), getAudioBuffer(), getContext(), getPaletteColor(), getSprite() (+13 more)

### Community 129 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 130 - "constructor"
Cohesion: 0.36
Nodes (8): a(), constructor(), getStyles(), handleIdleTick(), handleVisibilityChangeInternal(), isIdleState(), playRandomAnimation(), updateStateAnimation()

### Community 131 - "Tooltip"
Cohesion: 0.17
Nodes (7): blue, buttonDefinitions, magenta, red, scientificControlStyle, CalculatorButton, Tooltip

### Community 132 - "How to Add a New Desktop Theme"
Cohesion: 0.12
Nodes (15): 1\. `src/components/screensaver.js`, 1\. `src/config/wallpapers.js`, 2\. `src/config/sound-schemes.js`, 2\. `src/config/themes.js`, 3\. `src/config/icon-schemes.js`, 4\. `src/config/themes.js`, Before You Start: Required Assets, How to Add a New Desktop Theme (+7 more)

### Community 133 - "emit"
Cohesion: 0.22
Nodes (13): checkAndPlaySound(), checkAnimationCompletion(), completeAnimation(), emit(), getNextFrameDetails(), handleVisibilityChange(), load(), setAnimation() (+5 more)

### Community 134 - "Requirement: Winamp window size and lifecycle"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: Winamp window size and lifecycle, Scenario: Close, Scenario: Default size, Scenario: Launched twice or minimized, Scenario: Small screen, Spec Delta

### Community 138 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Client and countdown, 2. Window and patch, 3. Docs, 4. Validation, Tasks, Workflow follow-up

### Community 139 - "makeDraggable"
Cohesion: 0.62
Nodes (7): makeDraggable(), calculateClickOffset(), dragMove(), finishDrag(), getEventCoords(), startDrag(), updateLocation()

### Community 140 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Failing e2e specs (RED), 2. Shared helper and app config, 3. Docs, 4. Verification, 5. Final validation, Tasks

### Community 141 - "SoundSchemeExplorerApp"
Cohesion: 0.33
Nodes (4): SoundSchemeExplorerApp, soundSchemes, getSoundSchemeName(), setSoundScheme()

### Community 142 - "Y2K Patch"
Cohesion: 0.29
Nodes (6): Development, How to Use, Key Features, Purpose, Screenshot, Y2K Patch

### Community 143 - "Improving CT October"
Cohesion: 0.29
Nodes (6): Development, How to Use, Improving CT October, Key Features, Purpose, Screenshot

### Community 144 - "spider-solitaire/game.js"
Cohesion: 0.25
Nodes (4): Card, Deck, RANKS, SUITS

### Community 145 - "Windows 98 Web Edition: AI Agent Development Guidelines"
Cohesion: 0.15
Nodes (12): 1. Project Architecture, 2. Key Dependencies, 3. Development Patterns, 4. Development Workflow, Adding a New Application, Application Integration, Centralized Configuration, Core Components & Systems (+4 more)

### Community 146 - "Design"
Cohesion: 0.33
Nodes (5): Decisions, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs

### Community 147 - "app-localization.js"
Cohesion: 0.20
Nodes (4): get_direction(), load_language(), localize(), set_language()

### Community 148 - "Design"
Cohesion: 0.33
Nodes (5): Context, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs

### Community 149 - "view_bitmap"
Cohesion: 0.60
Nodes (6): cleanup_bitmap_view(), view_bitmap(), onContextMenu(), onFullscreenChange(), onKeyDown(), onMouseDown()

### Community 150 - "Tasks"
Cohesion: 0.40
Nodes (4): 3. Docs, 4. Verification, 5. Final validation, Tasks

### Community 152 - "apps/README.md"
Cohesion: 0.24
Nodes (4): diablo, Screenshot, keen, Screenshot

### Community 154 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, ani-cursor, html2canvas, music-metadata-browser, os-gui, @xterm/addon-fit, @xterm/addon-image, @xterm/xterm (+4 more)

### Community 155 - "theme.js"
Cohesion: 0.31
Nodes (10): href_for(), make_grinch_button(), animate(), document_touchmove(), on_zoom_etc(), steal_christmas(), set_theme(), theme_link (+2 more)

### Community 160 - "ImageResizerApp"
Cohesion: 0.27
Nodes (3): ImageResizerApp, drawOriginal(), loadImage()

### Community 161 - "discord-activity-client.js"
Cohesion: 0.33
Nodes (3): discordActivitySystemHooks, discordSdk, save_as_prompt()

### Community 163 - "speak"
Cohesion: 0.33
Nodes (12): _callComplete(), close(), _finishHideBalloon(), hide(), _sayChars(), _sayCharsWithTTS(), speak(), _speakTTS() (+4 more)

### Community 169 - "Adding New Applications"
Cohesion: 0.18
Nodes (11): 1. Create the Application Class, 2. Static Configuration, 3. Dynamic Loading, 4. Integrating with the Shell, Accessories & Tools, Adding New Applications, Application Development Guide, Applications (+3 more)

### Community 175 - "MenuBar"
Cohesion: 0.33
Nodes (7): MenuBar(), handleKeyDown(), keyboard_scope_keydown(), open_top_level_menu(), send_info_event(), set_keyboard_scope(), setActiveMenuPopup()

### Community 178 - "Windows 98 Web Edition"
Cohesion: 0.22
Nodes (8): Asset Sources, Featured Applications, Features, Getting Started, Live Demo, Screenshots, Technologies Used, Windows 98 Web Edition

### Community 187 - "OnCanvasObject"
Cohesion: 0.22
Nodes (3): OnCanvasHelperLayer, OnCanvasObject, OnCanvasTextBox

### Community 194 - "Disk Defragmenter"
Cohesion: 0.25
Nodes (7): Credits, Disk Defragmenter, How to Use, Key Features, Purpose, Screenshot, Technologies Used

### Community 196 - "Minesweeper"
Cohesion: 0.25
Nodes (7): Credits, How to Use, Key Features, Minesweeper, Purpose, Screenshot, Technologies Used

### Community 197 - "Notepad App"
Cohesion: 0.25
Nodes (7): How to Use, Key Features, Notepad App, Purpose, Screenshot, Technologies Used, What's next

### Community 205 - "SEO and Search Discovery Guide"
Cohesion: 0.29
Nodes (6): 1. Google Search Console Registration, 2. Submit the Sitemap, 3. Social Media Sharing, 4. Content Updates, 5. Summary of Changes Made, SEO and Search Discovery Guide

### Community 209 - "Buggy Program"
Cohesion: 0.29
Nodes (6): Buggy Program, How to Use, Key Features, Purpose, Screenshot, Technologies Used

### Community 210 - "Support the Project"
Cohesion: 0.29
Nodes (6): How to Use, Key Features, Purpose, Screenshot, Support the Project, Technologies Used

### Community 211 - "MS-DOS Prompt"
Cohesion: 0.29
Nodes (6): How to Use, Implementation Details, Key Features, MS-DOS Prompt, Purpose, Technologies Used

### Community 214 - "eSheep"
Cohesion: 0.29
Nodes (6): eSheep, How to Use, Key Features, Purpose, Screenshot, Technologies Used

### Community 215 - "Flash Player"
Cohesion: 0.29
Nodes (6): Flash Player, How to Use, Implementation Details, Key Features, Purpose, Technologies Used

### Community 216 - "FreeCell"
Cohesion: 0.29
Nodes (6): FreeCell, How to Use, Key Features, Purpose, Screenshot, Technologies Used

### Community 217 - "Media Player"
Cohesion: 0.29
Nodes (6): How to Use, Key Features, Media Player, Purpose, Screenshot, Technologies Used

### Community 221 - "PDF Viewer App"
Cohesion: 0.29
Nodes (6): How to Use, Key Features, PDF Viewer App, Purpose, Screenshot, Technologies Used

### Community 222 - "3D Pinball"
Cohesion: 0.29
Nodes (6): 3D Pinball, How to Use, Key Features, Purpose, Screenshot, Technologies Used

### Community 224 - "Prince of Persia"
Cohesion: 0.29
Nodes (6): How to Use, Key Features, Prince of Persia, Purpose, Screenshot, Technologies Used

### Community 225 - "Quake"
Cohesion: 0.29
Nodes (6): How to Use, Key Features, Purpose, Quake, Screenshot, Technologies Used

### Community 226 - "Report a Bug"
Cohesion: 0.29
Nodes (6): How to Use, Implementation Details, Key Features, Purpose, Report a Bug, Technologies Used

### Community 227 - "Solitaire"
Cohesion: 0.29
Nodes (6): How to Use, Key Features, Purpose, Screenshot, Solitaire, Technologies Used

### Community 230 - "Spider Solitaire"
Cohesion: 0.29
Nodes (6): How to Use, Key Features, Purpose, Screenshot, Spider Solitaire, Technologies Used

### Community 231 - "Tip of the Day App"
Cohesion: 0.29
Nodes (6): How to Use, Key Features, Purpose, Screenshot, Technologies Used, Tip of the Day App

### Community 232 - "Webamp App"
Cohesion: 0.33
Nodes (6): How to Use, Key Features, Purpose, Screenshot, Technologies Used, Webamp App

### Community 233 - "package.json"
Cohesion: 0.07
Nodes (34): devDependencies, @playwright/test, vite, vite-plugin-pwa, name, private, scripts, build (+26 more)

### Community 240 - "batch_update_readmes.sh"
Cohesion: 0.33
Nodes (5): custom_apps, file_apps, iframe_apps, batch_update_readmes.sh script, windowless_apps

### Community 242 - "Calculator"
Cohesion: 0.33
Nodes (5): Calculator, How to Use, Key Features, Purpose, Screenshot

### Community 243 - "Desktop Themes"
Cohesion: 0.33
Nodes (5): Desktop Themes, How to Use, Key Features, Purpose, Screenshot

### Community 244 - "Image Viewer"
Cohesion: 0.33
Nodes (5): Development Notes, Features, File Support, How to Use, Image Viewer

### Community 245 - "Paint"
Cohesion: 0.33
Nodes (5): How to Use, Key Features, Paint, Purpose, Screenshot

### Community 247 - "Sound Scheme Explorer"
Cohesion: 0.33
Nodes (5): How to Use, Key Features, Purpose, Screenshot, Sound Scheme Explorer

### Community 248 - "Task Manager (Close Program)"
Cohesion: 0.33
Nodes (5): How to Use, Key Features, Purpose, Screenshot, Task Manager (Close Program)

### Community 250 - "WordPad"
Cohesion: 0.33
Nodes (5): How to Use, Key Features, Purpose, Technologies Used, WordPad

### Community 251 - "toolbar-icons.js"
Cohesion: 0.33
Nodes (3): BROWSE_UI_ICONS, BROWSE_UI_ICONS_GRAYSCALE, TOOLBAR_ICON_CONFIG

### Community 252 - "busy-state-manager.js"
Cohesion: 0.18
Nodes (17): CursorScheme, getCursorThemes(), busyStateRequesters, releaseState(), releaseWaitState(), requestState(), requestWaitState(), waitStateRequesters (+9 more)

### Community 253 - "About App"
Cohesion: 0.33
Nodes (5): About App, How to Use, Key Features, Purpose, Screenshot

### Community 254 - "Display Properties"
Cohesion: 0.33
Nodes (5): Display Properties, How to Use, Key Features, Purpose, Screenshot

### Community 266 - "How to Add a New Screensaver"
Cohesion: 0.40
Nodes (4): Compatible Screensavers, How to Add a New Screensaver, Prerequisites, Steps

### Community 276 - "Cursor Explorer"
Cohesion: 0.50
Nodes (3): Cursor Explorer, Screenshot, TODO

### Community 277 - "DOS Games Downloader"
Cohesion: 0.50
Nodes (3): DOS Games Downloader, How to Install a Game, How to Play an Installed Game

### Community 279 - "test-news.js"
Cohesion: 0.50
Nodes (3): articleIDs, articles, newsEl

## Knowledge Gaps
- **43 isolated node(s):** `os-gui`, `windowless_apps`, `iframe_apps`, `custom_apps`, `file_apps` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2069 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **96 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Application` connect `Application` to `Application`, `explorer-app.js`, `theme-manager.js`, `Tasks`, `SoundSchemeExplorerApp`, `FreeCellApp`, `ZenExplorerApp`, `Windows 98 Web Edition: AI Agent Development Guidelines`, `launchApp`, `Design`, `NotepadApp`, `improving-ct-october-app.js`, `ImageResizerApp`, `taskbar.js`, `PdfViewerApp`, `about-app.js`, `DisplayPropertiesApp`, `Adding New Applications`, `zenfs-utils.js`, `DosBoxApp`, `DXBallApp`, `MinesweeperApp`, `DiabloApp`, `SpiderSolitaireApp`, `getItem`, `DoomApp`, `DesktopThemesApp`, `esheep.js`, `CursorExplorerApp`, `CalculatorApp`, `DOSShell`, `HelpApp`, `PrinceOfPersiaApp`, `DosGamesDownloaderApp`, `agent.js`, `DefragApp`, `ImageViewerApp`, `SolitaireApp`, `WordPadApp`, `FlashPlayerApp`, `KeenApp`, `PaintApp`, `Image Viewer`, `Windows 98 Web Edition: AI Agent Development Guidelines`?**
  _High betweenness centrality (0.222) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `ShowDialogWindow()` (e.g. with `Decisions` and `Proposed Changes:`) actually correct?**
  _`ShowDialogWindow()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `os-gui`, `windowless_apps`, `iframe_apps` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sound-schemes.js` be split into smaller, more focused modules?**
  _Cohesion score 0.008264462809917356 - nodes in this community are weakly interconnected._
- **Why does `ShowDialogWindow()` connect `Application` to `explorer-app.js`, `theme-manager.js`, `FreeCellApp`, `functions.js`, `StartMenu`, `launchApp`, `releaseBusyState`, `os-init.js`, `edit-colors.js`, `MenuBarBuilder`, `NotepadApp`, `taskbar.js`, `discord-activity-client.js`, `._updateMenuBar`, `help.js`, `zenfs-utils.js`, `.showWinDialog`, `Statistics`, `drive-manager.js`, `DragDropManager`, `.stat`, `Proposal: Semantic HTML Improvements for Windows 98 Web Edition`, `DiabloApp`, `SpiderSolitaireApp`, `._showSingleProperties`, `getItem`, `DoomApp`, `DesktopThemesApp`, `CalculatorApp`, `PrinceOfPersiaApp`, `Report a Bug`, `DosGamesDownloaderApp`, `PinballApp`, `DefragApp`, `ImageViewerApp`, `WordPadApp`, `FlashPlayerApp`, `KeenApp`, `Application`?**
  _High betweenness centrality (0.148) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `Application` (e.g. with `Adding a New Application` and `Adding a New Application`) actually correct?**
  _`Application` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `cursors.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0091324200913242 - nodes in this community are weakly interconnected._