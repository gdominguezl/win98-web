# Graph Report - win98-web  (2026-10-22)

## Corpus Check
- 381 files · ~526,402 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 475 file(s) not represented in the graph (top: .cur 196, .ico 97, .css 80)

## Summary
- 4315 nodes · 8986 edges · 248 communities (152 shown, 96 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 325 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68a70d0e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- desktop-context-menu-builder.js
- ADDED Requirements
- display-properties-app.js
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
- Requirements
- enqueueRequest
- taskbar.js
- verify_container.sh
- about-app.js
- DisplayPropertiesApp
- msn_app_links.spec.js
- solitaire-app.js
- Image Resizer
- help.js
- zenfs-utils.js
- CalculatorLogic
- ADDED Requirements
- zenfs-init.js
- Sidebar
- Tasks
- electron-main.js
- Proposal
- DragDropManager
- generate_registry.js
- MediaPlayerApp
- MSN Messenger
- Requirements
- createMsnFrameWindow
- DesktopThemesApp
- Design
- Proposal
- asset-preloader.js
- Requirement: Windows never open under the taskbar
- PinballApp
- AppMakerApp
- parse-theme.js
- color-data.js
- getPathName
- Proposal
- IconScheme
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
- QuakeApp
- makeDraggable
- Fotolog
- load
- eye-gaze-mode.js
- NavigationHistory
- scripts
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
- Proposal
- tip-of-the-day-app.js
- DosGamesDownloaderApp
- Game
- agent.js
- electron-injected.js
- InternetExplorerExtension
- DefragApp
- ImageViewerApp
- RecycleBinExtension
- SolitaireApp
- WordPadApp
- color-schemes.js
- releaseBusyState
- TableauPile
- IconScheme
- KeenApp
- PaintApp
- Tasks
- Tasks
- Requirement: Winamp window size and lifecycle
- Game
- Windows 98 Web Edition: AI Agent Development Guidelines
- openspec-explore/SKILL.md
- $Window
- ask
- Screensaver
- Design
- winamp.spec.js
- loadSpriteSheet
- CursorItem
- Tasks
- setInstantPosition
- Tooltip
- How to Add a New Desktop Theme
- constructor
- Design
- Toolbar
- view_bitmap
- FotologApp
- MsnMessengerApp
- WinampApp
- spider-solitaire/game.js
- Windows 98 Web Edition: AI Agent Development Guidelines
- app-localization.js
- apps/README.md
- Pile
- dependencies
- theme.js
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
- .renderDirectoryContents
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
- ShowDialogWindow
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
- cursor-manager.js
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
1. `ShowDialogWindow()` - 143 edges
2. `Application` - 97 edges
3. `getItem()` - 77 edges
4. `ICONS` - 70 edges
5. `setItem()` - 66 edges
6. `ZenExplorerApp` - 51 edges
7. `CalculatorLogic` - 50 edges
8. `joinPath()` - 46 edges
9. `launchApp()` - 44 edges
10. `@zenfs/core` - 41 edges

## Surprising Connections (you probably didn't know these)
- `Scenario: Known profile path` --references--> `resume()`  [INFERRED]
  openspec/specs/container-delivery/spec.md → ms-agent.js
- `Proposed Changes:` --references--> `ShowDialogWindow()`  [INFERRED]
  public/docs/semantic-html-proposal.md → src/shared/components/dialog-window.js
- `Open Questions` --references--> `createMsnFrameWindow()`  [INFERRED]
  openspec/changes/archive/2026-10-22-add-fotolog-app/design.md → src/shared/utils/msn-frame.js
- `What Changes` --references--> `createMsnFrameWindow()`  [INFERRED]
  openspec/changes/fit-msn-windows-to-desktop/proposal.md → src/shared/utils/msn-frame.js
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

## Communities (248 total, 96 thin omitted)

### Community 2 - "desktop-context-menu-builder.js"
Cohesion: 0.16
Nodes (19): launchDisplayPropertiesApp(), PALETTES, settingsTab, applyColorMode(), COLOR_MODES, getColorModes(), getCurrentColorMode(), initColorModeManager() (+11 more)

### Community 3 - "ADDED Requirements"
Cohesion: 0.05
Nodes (37): ADDED Requirements, Purpose, Requirement: Double click opens Fotolog in a window, Requirement: Fotolog appears on the desktop, Requirement: Fotolog is listed under Start menu Programs, Requirement: Fotolog URL follows the MSN base URL, Requirement: Frame is usable, accessible and visually consistent, Requirement: Inactivity timer follows user activity in the frame (+29 more)

### Community 4 - "display-properties-app.js"
Cohesion: 0.17
Nodes (3): appearanceTab, backgroundTab, screensaverTab

### Community 5 - "Application"
Cohesion: 0.05
Nodes (23): Decisions, @zenfs/emscripten, BuggyProgramApp, BuyMeACoffeeApp, CommandPromptApp, WAD_NAMES, ESheepApp, closeAllESheep() (+15 more)

### Community 6 - "IconManager"
Cohesion: 0.08
Nodes (3): IconManager, AddressBar, FilePicker

### Community 7 - "Requirements"
Cohesion: 0.05
Nodes (37): apps/fotolog Specification, Purpose, Requirement: Double click opens Fotolog in a window, Requirement: Fotolog appears on the desktop, Requirement: Fotolog is listed under Start menu Programs, Requirement: Fotolog URL follows the MSN base URL, Requirement: Frame is usable, accessible and visually consistent, Requirement: Inactivity timer follows user activity in the frame (+29 more)

### Community 8 - "explorer-app.js"
Cohesion: 0.15
Nodes (20): @zenfs/core, applyMonitorType(), getMonitorType(), NetworkNeighborhoodExtension, ShellManager, ClipboardManager, UndoManager, getIconForFile() (+12 more)

### Community 9 - "initDesktop"
Cohesion: 0.13
Nodes (8): DesktopController, initDesktop(), refreshIcons(), setupIcons(), updateCutIcons(), PropertiesManager, sortFileInfos(), DesktopContextMenuBuilder

### Community 10 - "theme-manager.js"
Cohesion: 0.17
Nodes (27): applyCssVariables(), applyPropertiesToPreview(), applyThemeToPreview(), fetchThemeCss(), parseCssVariables(), themeCssCache, applyCustomColorScheme(), applyStylesheet() (+19 more)

### Community 11 - "image-manipulation.js"
Cohesion: 0.04
Nodes (63): extra_tools, render_canvas_view(), set_magnification(), from_canvas_coords(), bresenham_dense_line(), bresenham_line(), clamp_brush_sizes(), compute_bezier() (+55 more)

### Community 12 - "ADDED Requirements"
Cohesion: 0.06
Nodes (34): ADDED Requirements, Purpose, Requirement: Double click opens MSN in a window, Requirement: Frame stays usable and accessible, Requirement: Inactivity timer follows user activity in the frame, Requirement: MSN being unavailable does not break the desktop, Requirement: MSN Messenger appears on the desktop, Requirement: MSN Messenger is listed under Start menu Programs (+26 more)

### Community 13 - "ZenExplorerApp"
Cohesion: 0.08
Nodes (4): AnimatedLogo(), StatusBar, ZenExplorerApp, NavigationController

### Community 14 - "FreeCellApp"
Cohesion: 0.06
Nodes (9): Card, RANKS, FreeCellApp, Game, RANKS, SUITS, DEFAULTS, OptionsManager (+1 more)

### Community 15 - "app.js"
Cohesion: 0.04
Nodes (50): $app, $bottom, $canvas, $canvas_area, canvas_handles, canvas_pointer_move(), $colorbox, $H (+42 more)

### Community 16 - "functions.js"
Cohesion: 0.06
Nodes (80): $about_paint_content, apply_file_format_and_palette_info(), are_you_sure(), change_some_url_params(), change_url_param(), choose_file_to_paste(), clear(), delete_selection() (+72 more)

### Community 17 - "StartMenu"
Cohesion: 0.08
Nodes (5): AccessKeys, createShutdownDialogContent(), showShutdownScreen(), StartMenu, Taskbar

### Community 18 - "launchApp"
Cohesion: 0.13
Nodes (22): apps, staticConfigs, systemApps, networkNeighborhood, SPECIAL_FOLDER_PATHS, startMenuConfig, ShowRunDialog(), CLASSES (+14 more)

### Community 19 - "releaseBusyState"
Cohesion: 0.11
Nodes (5): handleFileSystemError(), FileOperations, RecycleBinManager, ProgressBarShowDialogWindow, joinPath()

### Community 20 - "helpers.js"
Cohesion: 0.07
Nodes (31): adjust_segments(), apply_segments(), $Component(), get_segments(), eachFont(), $FontBox(), $Toggle(), select_tools() (+23 more)

### Community 21 - "os-init.js"
Cohesion: 0.09
Nodes (24): profiles, createMainUI(), drawBIOSFooter(), drawBIOSHeader(), finalizeBootProcessStep(), getBase64Image(), getTerminal(), hideBootScreen() (+16 more)

### Community 22 - "edit-colors.js"
Cohesion: 0.33
Nodes (12): $ColorBox(), $Swatch(), update_$swatch(), choose_color(), show_edit_colors_window(), detect_monochrome(), image_invert_colors(), get_rgba_from_color (+4 more)

### Community 23 - "Requirements"
Cohesion: 0.06
Nodes (34): apps/msn-messenger Specification, Purpose, Requirement: Double click opens MSN in a window, Requirement: Frame stays usable and accessible, Requirement: Inactivity timer follows user activity in the frame, Requirement: MSN being unavailable does not break the desktop, Requirement: MSN Messenger appears on the desktop, Requirement: MSN Messenger is listed under Start menu Programs (+26 more)

### Community 24 - "app-state.js"
Cohesion: 0.04
Nodes (49): airbrush_size, aliasing, brush_shape, brush_size, current_history_node, default_airbrush_size, default_brush_shape, default_brush_size (+41 more)

### Community 25 - "ms-agent.js"
Cohesion: 0.04
Nodes (23): decode(), decodeBlock(), decodeMonoBlock(), draw(), executeTransition(), getTTSVoices(), parse(), parseAnimationSection() (+15 more)

### Community 26 - "resume"
Cohesion: 0.11
Nodes (18): resume(), Context, Decisions, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs, Requirement: Profile deep links boot the app (+10 more)

### Community 28 - "NotepadApp"
Cohesion: 0.10
Nodes (3): NotepadApp, NotepadEditor, ThemeToCssApp

### Community 29 - "ADDED Requirements"
Cohesion: 0.06
Nodes (31): ADDED Requirements, Purpose, Requirement: Classic Webamp is archived, not removed, Requirement: Existing users are migrated without losing layout, Requirement: Frame is usable, accessible and visually consistent, Requirement: Winamp on the desktop opens the MSN Winamp, Requirement: Winamp URL follows the MSN base URL and session, Requirement: Winamp window size and lifecycle (+23 more)

### Community 30 - "Requirements"
Cohesion: 0.06
Nodes (31): apps/winamp Specification, Purpose, Requirement: Classic Webamp is archived, not removed, Requirement: Existing users are migrated without losing layout, Requirement: Frame is usable, accessible and visually consistent, Requirement: Winamp on the desktop opens the MSN Winamp, Requirement: Winamp URL follows the MSN base URL and session, Requirement: Winamp window size and lifecycle (+23 more)

### Community 31 - "Requirements"
Cohesion: 0.04
Nodes (46): ADDED Requirements, Purpose, Requirement: Cache policy keeps the PWA updatable, Requirement: Health endpoint for orchestration, Requirement: Missing files return the Blue Screen page, Requirement: Prefix redirect is host-agnostic, Requirement: Reproducible image build, Requirement: Site is served under the /win98-web/ prefix (+38 more)

### Community 32 - "enqueueRequest"
Cohesion: 0.17
Nodes (17): animate(), animations(), delay(), enqueueRequest(), gestureAt(), getDirection(), hasAnimation(), interrupt() (+9 more)

### Community 33 - "taskbar.js"
Cohesion: 0.08
Nodes (21): WebampApp, CLASSES, createTaskbarButton(), createTrayIcon(), destroy(), hideStartMenu(), init(), removeTaskbarButton() (+13 more)

### Community 34 - "verify_container.sh"
Cohesion: 0.46
Nodes (7): body_of(), fail(), header_value(), headers_of(), pass(), verify_container.sh script, status_of()

### Community 35 - "about-app.js"
Cohesion: 0.19
Nodes (3): aboutContent, AboutApp, launchAboutApp()

### Community 38 - "msn_app_links.spec.js"
Cohesion: 0.20
Nodes (6): clickLink(), FOTOLOG_LINK, frameDoc(), MSN_LINK, STUBS, WINAMP_LINK

### Community 39 - "solitaire-app.js"
Cohesion: 0.10
Nodes (9): animatedCardBacks, findBestDropTarget(), DEFAULTS, getAllOptions(), getOption(), options, OPTIONS_KEYS, setAllOptions() (+1 more)

### Community 40 - "Image Resizer"
Cohesion: 0.33
Nodes (5): How to Use, Image Resizer, Key Features, Purpose, Screenshot

### Community 41 - "help.js"
Cohesion: 0.27
Nodes (6): $Iframe(), open_help_viewer(), renderItem(), show_help(), exports, showMessageBox_implementation()

### Community 42 - "zenfs-utils.js"
Cohesion: 0.13
Nodes (13): FlashPlayerApp, createPdfViewerContent(), ShowFilePicker(), applyWallpaper(), getWallpaperMode(), browseForWallpaper(), formatWallpaperName(), populateWallpaperList() (+5 more)

### Community 44 - "ADDED Requirements"
Cohesion: 0.08
Nodes (23): ADDED Requirements, Purpose, Requirement: Existing windows are reused, Requirement: Failure falls back to the original behavior, Requirement: Interception survives frame reloads, Requirement: Keyboard access keeps working, Requirement: Other interactions are not changed, Requirement: Switcher buttons open separate windows (+15 more)

### Community 45 - "zenfs-init.js"
Cohesion: 0.16
Nodes (21): Decisions, 3. System, @zenfs/dom, CDManager, FloppyManager, mountedDisks, RemovableDiskManager, migrateToZenFS() (+13 more)

### Community 47 - "Tasks"
Cohesion: 0.20
Nodes (9): 1. Failing e2e spec (RED), 2. Config, 3. System, 5. Docs and screenshot, 6. Manual verification, 7. Final validation, 8. Size update requested after review, Tasks (+1 more)

### Community 48 - "electron-main.js"
Cohesion: 0.10
Nodes (15): activate_app(), allowed_file_paths, { app, shell, session, dialog, ipcMain, BrowserWindow, Menu, MenuItem }, args, args_array, { ArgumentParser, SUPPRESS }, createWindow(), handle_one_drop() (+7 more)

### Community 49 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 51 - "generate_registry.js"
Cohesion: 0.22
Nodes (6): vite, vite-plugin-pwa, appsDirs, extractConfig(), generateRegistry(), packageJson

### Community 53 - "MSN Messenger"
Cohesion: 0.29
Nodes (7): Development, How to Use, Key Features, MSN Messenger, Purpose, Screenshot, Technologies Used

### Community 54 - "Requirements"
Cohesion: 0.08
Nodes (23): apps/msn-shortcut-windows Specification, Purpose, Requirement: Existing windows are reused, Requirement: Failure falls back to the original behavior, Requirement: Interception survives frame reloads, Requirement: Keyboard access keeps working, Requirement: Other interactions are not changed, Requirement: Switcher buttons open separate windows (+15 more)

### Community 55 - "createMsnFrameWindow"
Cohesion: 0.22
Nodes (12): Context, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs, createMsnFrameWindow(), fitToDesktop(), interceptAppShortcuts() (+4 more)

### Community 57 - "Design"
Cohesion: 0.13
Nodes (13): Context, Decisions, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs, 4. The app, Context (+5 more)

### Community 58 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 59 - "asset-preloader.js"
Cohesion: 0.53
Nodes (5): audioPreloadMap, preloadAudio(), preloadCursor(), preloadImage(), preloadThemeAssets()

### Community 60 - "Requirement: Windows never open under the taskbar"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Purpose, Requirement: Fitted windows stay fully usable, Requirement: Windows never open under the taskbar, Scenario: Enlarging, Scenario: Maximize and restore, Scenario: Small laptop screen, Scenario: Very small desktop (+3 more)

### Community 63 - "parse-theme.js"
Cohesion: 0.09
Nodes (22): applyCSSProperties(), generateThemePropertiesFromColors(), getColorsFromThemeFile(), getCursorsFromThemeFile(), getDesktopConfigFromThemeFile(), getIconsFromThemeFile(), getSoundsFromThemeFile(), getThemeCSSProperties() (+14 more)

### Community 64 - "color-data.js"
Cohesion: 0.27
Nodes (8): update_palette_from_theme(), basic_colors, color_ramp(), custom_colors, get_winter_palette(), lerp(), monochrome_palette_as_colors, make_stripe_pattern()

### Community 65 - "getPathName"
Cohesion: 0.08
Nodes (3): ControlPanelExtension, DesktopExtension, VirtualStats

### Community 66 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 67 - "IconScheme"
Cohesion: 0.24
Nodes (5): cursors, iconSchemes, SCREENSAVERS, soundSchemes, getIcon()

### Community 68 - "MinesweeperApp"
Cohesion: 0.12
Nodes (4): MinesweeperApp, MinesweeperGame, CHAR_MAP, SpriteDisplay

### Community 69 - "simulate-random-gestures.js"
Cohesion: 0.33
Nodes (10): cancel(), choose(), $cursor, cursor_image, isAnyMenuOpen(), seededRandom(), simulateRandomGesture(), simulateRandomGesturesPeriodically() (+2 more)

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
Cohesion: 0.10
Nodes (25): appClasses, HIGHLIGHT_JS_THEMES, languages, recycleBinContent, renderHTML(), handleDroppedFiles(), getItemFromIcon(), deleteCustomApp() (+17 more)

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

### Community 81 - "QuakeApp"
Cohesion: 0.16
Nodes (3): QuakeApp, ReportABugApp, TaskManagerApp

### Community 82 - "makeDraggable"
Cohesion: 0.62
Nodes (7): makeDraggable(), calculateClickOffset(), dragMove(), finishDrag(), getEventCoords(), startDrag(), updateLocation()

### Community 83 - "Fotolog"
Cohesion: 0.29
Nodes (7): Development, Fotolog, How to Use, Key Features, Purpose, Screenshot, Technologies Used

### Community 84 - "load"
Cohesion: 0.25
Nodes (8): getDefinition(), getPaletteColor(), init(), load(), loadTransparencyColor(), normalizeDefinition(), setDefinition(), startLoop()

### Community 85 - "eye-gaze-mode.js"
Cohesion: 0.09
Nodes (10): apply_scale(), dwell_clicker, dwell_clicker_config, init_dwell_clicker(), init_tracky_mouse_ui(), update_auto_scaling(), update_floating_buttons(), undo() (+2 more)

### Community 86 - "NavigationHistory"
Cohesion: 0.08
Nodes (11): NavigationHistory, Architecture, Core Logic, Development, Features, File Operations, Media Support, System Integration (+3 more)

### Community 87 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, build:registry, dev, preview, test

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

### Community 98 - "Proposal"
Cohesion: 0.22
Nodes (8): Capabilities, Impact, Modified Capabilities, New Capabilities, Non-goals, Proposal, What Changes, Why

### Community 102 - "agent.js"
Cohesion: 0.17
Nodes (14): AgentApp, askAgent(), findAndOpenFromStartMenu(), findIcon(), findWindowCloseButton(), getAgentMenuItems(), getElementCenter(), launchAgentApp() (+6 more)

### Community 103 - "electron-injected.js"
Cohesion: 0.25
Nodes (3): { /*contextBridge,*/ ipcRenderer }, { isDev, isMacOS, initialFilePath }, menuFunctions

### Community 110 - "color-schemes.js"
Cohesion: 0.10
Nodes (20): colorSchemes, ../shared/styles/color-schemes/60s-usa.css?inline, ../shared/styles/color-schemes/baseball.css?inline, ../shared/styles/color-schemes/blue.css?inline, ../shared/styles/color-schemes/dangerous-creatures.css?inline, ../shared/styles/color-schemes/inside-your-computer.css?inline, ../shared/styles/color-schemes/jungle.css?inline, ../shared/styles/color-schemes/leonardo-da-vinci.css?inline (+12 more)

### Community 111 - "releaseBusyState"
Cohesion: 0.10
Nodes (14): updateScreensaverPreview(), DriveManager, ContextMenuBuilder, KeyboardHandler, busyStateRequesters, releaseBusyState(), releaseState(), releaseWaitState() (+6 more)

### Community 116 - "Tasks"
Cohesion: 0.25
Nodes (7): 1. Failing e2e specs (RED), 2. App (iframe) and archive of classic, 4. Docs, 5. Verification, 6. Manual verification, 7. Final validation, Tasks

### Community 117 - "Tasks"
Cohesion: 0.25
Nodes (7): 1. Failing e2e spec (RED), 2. Shared helper, 3. Docs, 4. Verification, 5. Manual verification, 6. Final validation, Tasks

### Community 118 - "Requirement: Winamp window size and lifecycle"
Cohesion: 0.25
Nodes (7): MODIFIED Requirements, Requirement: Winamp window size and lifecycle, Scenario: Close, Scenario: Default size, Scenario: Launched twice or minimized, Scenario: Small screen, Spec Delta

### Community 120 - "Windows 98 Web Edition: AI Agent Development Guidelines"
Cohesion: 0.11
Nodes (17): 1. Project Architecture, 2. Key Dependencies, 3. Development Patterns, 4. Development Workflow, 5. Release Management and Commit Guidelines, Adding a New Application, Application Integration, Automated Releases (+9 more)

### Community 121 - "openspec-explore/SKILL.md"
Cohesion: 0.13
Nodes (11): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, Planning a Change, The Stance, What You Don't Have To Do (+3 more)

### Community 122 - "$Window"
Cohesion: 0.16
Nodes (11): element_to_string(), find_tabstops(), $FormWindow(), $Window(), end_resize(), get_direction(), handle_pointermove(), make_focus_in_out_handler() (+3 more)

### Community 123 - "ask"
Cohesion: 0.26
Nodes (19): What You Might Do, add(), ask(), b(), f(), g(), h(), m() (+11 more)

### Community 125 - "Design"
Cohesion: 0.29
Nodes (6): Context, Decisions, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs

### Community 127 - "loadSpriteSheet"
Cohesion: 0.19
Nodes (15): bmpToCanvas(), getAudioBuffer(), getContext(), getSprite(), isMSADPCM(), loadInternal(), loadSounds(), loadSprite() (+7 more)

### Community 129 - "Tasks"
Cohesion: 0.29
Nodes (6): 1. Failing e2e specs (RED), 2. Shared helper and app config, 3. Docs, 4. Verification, 5. Final validation, Tasks

### Community 130 - "setInstantPosition"
Cohesion: 0.40
Nodes (6): getSpriteHeight(), getSpriteWidth(), setInstantPosition(), setScale(), setupCanvas(), updateCanvasSize()

### Community 131 - "Tooltip"
Cohesion: 0.17
Nodes (7): blue, buttonDefinitions, magenta, red, scientificControlStyle, CalculatorButton, Tooltip

### Community 132 - "How to Add a New Desktop Theme"
Cohesion: 0.12
Nodes (15): 1\. `src/components/screensaver.js`, 1\. `src/config/wallpapers.js`, 2\. `src/config/sound-schemes.js`, 2\. `src/config/themes.js`, 3\. `src/config/icon-schemes.js`, 4\. `src/config/themes.js`, Before You Start: Required Assets, How to Add a New Desktop Theme (+7 more)

### Community 133 - "constructor"
Cohesion: 0.18
Nodes (17): a(), checkAndPlaySound(), checkAnimationCompletion(), completeAnimation(), constructor(), emit(), getNextFrameDetails(), getStyles() (+9 more)

### Community 134 - "Design"
Cohesion: 0.33
Nodes (5): Context, Design, Goals / Non-Goals, Open Questions, Risks / Trade-offs

### Community 136 - "view_bitmap"
Cohesion: 0.60
Nodes (6): cleanup_bitmap_view(), view_bitmap(), onContextMenu(), onFullscreenChange(), onKeyDown(), onMouseDown()

### Community 144 - "spider-solitaire/game.js"
Cohesion: 0.25
Nodes (4): Card, Deck, RANKS, SUITS

### Community 145 - "Windows 98 Web Edition: AI Agent Development Guidelines"
Cohesion: 0.15
Nodes (12): 1. Project Architecture, 2. Key Dependencies, 3. Development Patterns, 4. Development Workflow, Adding a New Application, Application Integration, Centralized Configuration, Core Components & Systems (+4 more)

### Community 147 - "app-localization.js"
Cohesion: 0.20
Nodes (4): get_direction(), load_language(), localize(), set_language()

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
Cohesion: 0.27
Nodes (14): _callComplete(), close(), _finishHideBalloon(), handleVisibilityChange(), hide(), _sayChars(), _sayCharsWithTTS(), show() (+6 more)

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

### Community 228 - "ShowDialogWindow"
Cohesion: 0.14
Nodes (9): SoundSchemeExplorerApp, ShowComingSoonDialog(), ShowDialogWindow(), showError(), showInputDialog(), playSound(), getSoundSchemeName(), setSoundScheme() (+1 more)

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
Cohesion: 0.12
Nodes (16): devDependencies, @playwright/test, vite, vite-plugin-pwa, name, private, type, version (+8 more)

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

### Community 252 - "cursor-manager.js"
Cohesion: 0.32
Nodes (9): CursorScheme, getCursorThemes(), applyAniCursorTheme(), applyBusyCursor(), applyCursorTheme(), applyWaitCursor(), clearAniCursor(), ensureGlobalStyles() (+1 more)

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1907 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **96 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Application` connect `Application` to `Tasks`, `display-properties-app.js`, `Design`, `explorer-app.js`, `theme-manager.js`, `ZenExplorerApp`, `FreeCellApp`, `Windows 98 Web Edition: AI Agent Development Guidelines`, `NotepadApp`, `ImageResizerApp`, `taskbar.js`, `PdfViewerApp`, `about-app.js`, `DisplayPropertiesApp`, `solitaire-app.js`, `Adding New Applications`, `zenfs-utils.js`, `DosBoxApp`, `MediaPlayerApp`, `DesktopThemesApp`, `AppMakerApp`, `DXBallApp`, `MinesweeperApp`, `DiabloApp`, `SpiderSolitaireApp`, `getItem`, `DoomApp`, `QuakeApp`, `CursorExplorerApp`, `CalculatorApp`, `HelpApp`, `PrinceOfPersiaApp`, `tip-of-the-day-app.js`, `ShowDialogWindow`, `DosGamesDownloaderApp`, `agent.js`, `DefragApp`, `ImageViewerApp`, `SolitaireApp`, `WordPadApp`, `KeenApp`, `PaintApp`, `Image Viewer`, `Windows 98 Web Edition: AI Agent Development Guidelines`, `Design`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ShowDialogWindow()` (e.g. with `Proposed Changes:` and `Technologies Used`) actually correct?**
  _`ShowDialogWindow()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `os-gui`, `windowless_apps`, `iframe_apps` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sound-schemes.js` be split into smaller, more focused modules?**
  _Cohesion score 0.008264462809917356 - nodes in this community are weakly interconnected._
- **Why does `ShowDialogWindow()` connect `ShowDialogWindow` to `Application`, `IconManager`, `explorer-app.js`, `initDesktop`, `theme-manager.js`, `FreeCellApp`, `functions.js`, `StartMenu`, `launchApp`, `releaseBusyState`, `os-init.js`, `edit-colors.js`, `MenuBarBuilder`, `NotepadApp`, `taskbar.js`, `discord-activity-client.js`, `._updateMenuBar`, `solitaire-app.js`, `help.js`, `zenfs-utils.js`, `.showWinDialog`, `Statistics`, `zenfs-init.js`, `DragDropManager`, `MediaPlayerApp`, `DesktopThemesApp`, `PinballApp`, `AppMakerApp`, `Proposal: Semantic HTML Improvements for Windows 98 Web Edition`, `DiabloApp`, `SpiderSolitaireApp`, `getItem`, `DoomApp`, `QuakeApp`, `CalculatorApp`, `PrinceOfPersiaApp`, `Report a Bug`, `DosGamesDownloaderApp`, `DefragApp`, `ImageViewerApp`, `WordPadApp`, `releaseBusyState`, `KeenApp`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `Application` (e.g. with `Adding a New Application` and `Adding a New Application`) actually correct?**
  _`Application` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Should `cursors.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0091324200913242 - nodes in this community are weakly interconnected._