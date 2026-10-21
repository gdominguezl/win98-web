# Graph Report - win98-web  (2026-10-21)

## Corpus Check
- 337 files · ~463,647 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 471 file(s) not represented in the graph (top: .cur 196, .ico 96, .css 80)

## Summary
- 3759 nodes · 8370 edges · 210 communities (111 shown, 99 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 278 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e7ddf164`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- desktop-context-menu-builder.js
- @zenfs/core
- getItem
- ShowDialogWindow
- ShellManager
- releaseBusyState
- explorer-app.js
- zenfs-init.js
- theme-manager.js
- image-manipulation.js
- desktop-themes-app.js
- ZenExplorerApp
- FreeCellApp
- app.js
- functions.js
- StartMenu
- start-menu/start-menu.js
- releaseBusyState
- helpers.js
- os-init.js
- edit-colors.js
- DesktopThemesApp
- app-state.js
- ms-agent.js
- AddressBar
- MenuBarBuilder
- NotepadApp
- MediaPlayerApp
- Architecture
- color-data.js
- asset-preloader.js
- taskbar.js
- DesktopExtension
- ._showSingleProperties
- RecycleBinExtension
- WindowManager
- IconManager
- os-init.js
- Image Resizer
- view_bitmap
- AboutApp
- CalculatorLogic
- ReportABugApp
- TaskManagerApp
- Sidebar
- BuyMeACoffeeApp
- electron-main.js
- about.js
- help.js
- parse-theme.js
- VirtualStats
- MinesweeperApp
- Proposal: Semantic HTML Improvements for Windows 98 Web Edition
- DiabloApp
- SpiderSolitaireApp
- Changelog
- globals.d.ts
- DoomApp
- eye-gaze-mode.js
- NavigationHistory
- Windows 98 Web Edition
- CalculatorApp
- DOSShell
- Pile
- HelpApp
- @playwright/test
- Tool
- DosGamesDownloaderApp
- Game
- agent.js
- DefragApp
- ImageViewerApp
- make_canvas
- SolitaireApp
- WordPadApp
- color-schemes.js
- busy-state-manager.js
- KeenApp
- PaintApp
- Game
- Windows 98 Web Edition: AI Agent Development Guidelines
- openspec-explore/SKILL.md
- $Window
- ask
- loadSpriteSheet
- Tooltip
- How to Add a New Desktop Theme
- enqueueRequest
- Toolbar
- spider-solitaire/game.js
- Windows 98 Web Edition: AI Agent Development Guidelines
- emit
- app-localization.js
- apps/README.md
- Pile
- dependencies
- theme.js
- ImageResizerApp
- discord-activity-client.js
- PdfViewerApp
- speak
- constructor
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
- PinballApp
- Card
- InternetExplorerExtension
- DragDropManager
- Screensaver
- SEO and Search Discovery Guide
- Buggy Program
- Support the Project
- MS-DOS Prompt
- CursorExplorerApp
- esheep.js
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
- SoundSchemeExplorerApp
- TableauPile
- Spider Solitaire
- Tip of the Day App
- Webamp App
- package.json
- utils.js
- batch_update_readmes.sh
- App Maker
- Calculator
- Desktop Themes
- Image Viewer
- Paint
- Window
- Sound Scheme Explorer
- Task Manager (Close Program)
- Theme to CSS App
- WordPad
- toolbar-icons.js
- IconScheme
- About App
- Display Properties
- QuakeApp
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
- CLAUDE.md
- .claude/CLAUDE.md
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
2. `Application` - 93 edges
3. `getItem()` - 77 edges
4. `ICONS` - 67 edges
5. `setItem()` - 66 edges
6. `ZenExplorerApp` - 51 edges
7. `CalculatorLogic` - 50 edges
8. `joinPath()` - 46 edges
9. `launchApp()` - 44 edges
10. `@zenfs/core` - 40 edges

## Surprising Connections (you probably didn't know these)
- `Proposed Changes:` --references--> `ShowDialogWindow()`  [INFERRED]
  public/docs/semantic-html-proposal.md → src/shared/components/dialog-window.js
- `Core Systems (`src/system/`)` --references--> `RecycleBinManager`  [INFERRED]
  AGENTS.md → src/shell/explorer/file-operations/recycle-bin-manager.js
- `Phase 4: Shell Icons & Advanced Settings` --references--> `getThemedIconObj()`  [INFERRED]
  THEME_IMPROVEMENT_PLAN.md → src/shell/explorer/interface/file-icon-renderer.js
- `Adding a New Application` --references--> `Application`  [INFERRED]
  AGENTS.md → src/system/application.js
- `Adding a New Application` --references--> `Application`  [INFERRED]
  .github/copilot-instructions.md → src/system/application.js

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

## Communities (210 total, 99 thin omitted)

### Community 2 - "desktop-context-menu-builder.js"
Cohesion: 0.08
Nodes (23): appearanceTab, backgroundTab, DisplayPropertiesApp, launchDisplayPropertiesApp(), screensaverTab, PALETTES, settingsTab, DesktopContextMenuBuilder (+15 more)

### Community 3 - "@zenfs/core"
Cohesion: 0.11
Nodes (14): @zenfs/core, FlashPlayerApp, HIGHLIGHT_JS_THEMES, languages, ShowFilePicker(), browseForWallpaper(), formatWallpaperName(), populateWallpaperList() (+6 more)

### Community 4 - "getItem"
Cohesion: 0.08
Nodes (35): animatedCardBacks, findBestDropTarget(), DEFAULTS, getAllOptions(), getOption(), options, OPTIONS_KEYS, setAllOptions() (+27 more)

### Community 5 - "ShowDialogWindow"
Cohesion: 0.06
Nodes (17): @zenfs/emscripten, BuggyProgramApp, WAD_NAMES, EPISODE_NAMES, createPdfViewerContent(), cursors, iconSchemes, ICONS (+9 more)

### Community 6 - "ShellManager"
Cohesion: 0.11
Nodes (5): DesktopController, refreshIcons(), ShellManager, sortFileInfos(), FilePicker

### Community 7 - "releaseBusyState"
Cohesion: 0.12
Nodes (6): updateScreensaverPreview(), DriveManager, ContextMenuBuilder, KeyboardHandler, releaseBusyState(), requestBusyState()

### Community 8 - "explorer-app.js"
Cohesion: 0.14
Nodes (21): fileAssociations, SHORTCUT_OVERLAY, networkNeighborhood, AnimatedLogo(), ClipboardManager, UndoManager, getIconForFile(), getIconObjForFile() (+13 more)

### Community 9 - "zenfs-init.js"
Cohesion: 0.23
Nodes (13): @zenfs/dom, CDManager, FloppyManager, mountedDisks, RemovableDiskManager, migrateToZenFS(), DriveService, migrateShortcuts() (+5 more)

### Community 10 - "theme-manager.js"
Cohesion: 0.22
Nodes (17): applyCustomColorScheme(), applyStylesheet(), applyTheme(), deleteCustomTheme(), getActiveThemeId(), getColorSchemeId(), getCurrentTheme(), getCursorSchemeId() (+9 more)

### Community 11 - "image-manipulation.js"
Cohesion: 0.04
Nodes (62): extra_tools, set_magnification(), from_canvas_coords(), memoize_synchronous_function(), bresenham_dense_line(), bresenham_line(), clamp_brush_sizes(), compute_bezier() (+54 more)

### Community 12 - "desktop-themes-app.js"
Cohesion: 0.26
Nodes (11): applyCssVariables(), applyPropertiesToPreview(), applyThemeToPreview(), fetchThemeCss(), parseCssVariables(), themeCssCache, getActiveTheme(), getColorSchemes() (+3 more)

### Community 13 - "ZenExplorerApp"
Cohesion: 0.08
Nodes (3): StatusBar, ZenExplorerApp, DirectoryView

### Community 14 - "FreeCellApp"
Cohesion: 0.06
Nodes (9): Card, RANKS, FreeCellApp, Game, RANKS, SUITS, DEFAULTS, OptionsManager (+1 more)

### Community 15 - "app.js"
Cohesion: 0.04
Nodes (50): $app, $bottom, $canvas, $canvas_area, canvas_handles, canvas_pointer_move(), $colorbox, $H (+42 more)

### Community 16 - "functions.js"
Cohesion: 0.05
Nodes (90): reset_for_next_test(), default_palette, $about_paint_content, apply_file_format_and_palette_info(), are_you_sure(), cancel(), change_some_url_params(), change_url_param() (+82 more)

### Community 17 - "StartMenu"
Cohesion: 0.07
Nodes (3): showShutdownScreen(), StartMenu, Taskbar

### Community 18 - "start-menu/start-menu.js"
Cohesion: 0.09
Nodes (32): TipOfTheDayApp, tipOfTheDayContent, appRegistry, apps, staticConfigs, systemApps, SPECIAL_FOLDER_PATHS, startMenuConfig (+24 more)

### Community 19 - "releaseBusyState"
Cohesion: 0.11
Nodes (5): handleFileSystemError(), FileOperations, RecycleBinManager, ProgressBarShowDialogWindow, joinPath()

### Community 20 - "helpers.js"
Cohesion: 0.11
Nodes (20): adjust_segments(), apply_segments(), $Component(), get_segments(), eachFont(), $FontBox(), $Toggle(), select_tools() (+12 more)

### Community 21 - "os-init.js"
Cohesion: 0.16
Nodes (11): appClasses, profiles, renderHTML(), createMainUI(), appManager, deleteCustomApp(), registerCustomApp(), setupIcons() (+3 more)

### Community 22 - "edit-colors.js"
Cohesion: 0.25
Nodes (17): $ColorBox(), $Swatch(), update_$swatch(), choose_color(), show_edit_colors_window(), detect_monochrome(), handle_keyshortcuts(), image_attributes() (+9 more)

### Community 24 - "app-state.js"
Cohesion: 0.04
Nodes (49): airbrush_size, aliasing, brush_shape, brush_size, current_history_node, default_airbrush_size, default_brush_shape, default_brush_size (+41 more)

### Community 25 - "ms-agent.js"
Cohesion: 0.04
Nodes (23): decode(), decodeBlock(), decodeMonoBlock(), draw(), executeTransition(), getTTSVoices(), parse(), parseAnimationSection() (+15 more)

### Community 28 - "NotepadApp"
Cohesion: 0.08
Nodes (4): AppMakerApp, NotepadApp, NotepadEditor, ThemeToCssApp

### Community 30 - "Architecture"
Cohesion: 0.18
Nodes (10): Architecture, Core Logic, Development, Features, File Operations, Media Support, System Integration, UI Components (+2 more)

### Community 31 - "color-data.js"
Cohesion: 0.31
Nodes (7): basic_colors, color_ramp(), custom_colors, get_winter_palette(), lerp(), monochrome_palette_as_colors, make_stripe_pattern()

### Community 32 - "asset-preloader.js"
Cohesion: 0.33
Nodes (7): themes, wallpapers, audioPreloadMap, preloadAudio(), preloadCursor(), preloadImage(), preloadThemeAssets()

### Community 33 - "taskbar.js"
Cohesion: 0.08
Nodes (17): WebampApp, getWebampMenuItems(), CLASSES, createTaskbarButton(), createTrayIcon(), destroy(), hideStartMenu(), removeTaskbarButton() (+9 more)

### Community 39 - "os-init.js"
Cohesion: 0.15
Nodes (23): @xterm/addon-fit, @xterm/xterm, drawBIOSFooter(), drawBIOSHeader(), finalizeBootProcessStep(), getBase64Image(), getTerminal(), hideBootScreen() (+15 more)

### Community 40 - "Image Resizer"
Cohesion: 0.33
Nodes (5): How to Use, Image Resizer, Key Features, Purpose, Screenshot

### Community 41 - "view_bitmap"
Cohesion: 0.60
Nodes (6): cleanup_bitmap_view(), view_bitmap(), onContextMenu(), onFullscreenChange(), onKeyDown(), onMouseDown()

### Community 48 - "electron-main.js"
Cohesion: 0.05
Nodes (24): vite, vite-plugin-pwa, appsDirs, extractConfig(), generateRegistry(), { /*contextBridge,*/ ipcRenderer }, { isDev, isMacOS, initialFilePath }, menuFunctions (+16 more)

### Community 60 - "help.js"
Cohesion: 0.27
Nodes (6): $Iframe(), open_help_viewer(), renderItem(), show_help(), exports, showMessageBox_implementation()

### Community 63 - "parse-theme.js"
Cohesion: 0.09
Nodes (22): applyCSSProperties(), generateThemePropertiesFromColors(), getColorsFromThemeFile(), getCursorsFromThemeFile(), getDesktopConfigFromThemeFile(), getIconsFromThemeFile(), getSoundsFromThemeFile(), getThemeCSSProperties() (+14 more)

### Community 65 - "VirtualStats"
Cohesion: 0.08
Nodes (3): ControlPanelExtension, NetworkNeighborhoodExtension, VirtualStats

### Community 68 - "MinesweeperApp"
Cohesion: 0.12
Nodes (4): MinesweeperApp, MinesweeperGame, CHAR_MAP, SpriteDisplay

### Community 71 - "Proposal: Semantic HTML Improvements for Windows 98 Web Edition"
Cohesion: 0.06
Nodes (30): 10. Desktop Icons (`src/shell/desktop/desktop.js`, `src/shell/desktop/icon-manager.js`), 11. Specialized Dialogs (`src/shell/run-dialog.js`, `src/shell/shutdown-dialog.js`), 12. Status Bars (`src/shared/components/status-bar.js`), 1. Main Shell Structure (`src/shell/ui.js`), 2. Taskbar Components (`src/shell/taskbar/taskbar.js`), 3. Start Menu (`src/shell/start-menu/start-menu.js`), 4. Boot Screen (`index.html`), 5. Desktop Area (`src/shell/ui.js`) (+22 more)

### Community 72 - "DiabloApp"
Cohesion: 0.13
Nodes (3): DiabloApp, DiabloProgressDialog, DiabloStorage

### Community 75 - "Changelog"
Cohesion: 0.07
Nodes (29): [0.2.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.1.0...win98-web-v0.2.0) (2026-02-04), [0.3.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.2.0...win98-web-v0.3.0) (2026-02-05), [0.3.1](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.3.0...win98-web-v0.3.1) (2026-02-06), [0.4.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.3.1...win98-web-v0.4.0) (2026-02-06), [0.5.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.4.0...win98-web-v0.5.0) (2026-02-09), [0.6.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.5.0...win98-web-v0.6.0) (2026-02-12), [0.7.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.6.0...win98-web-v0.7.0) (2026-02-15), [0.8.0](https://github.com/azayrahmad/win98-web/compare/win98-web-v0.7.0...win98-web-v0.8.0) (2026-02-18) (+21 more)

### Community 78 - "globals.d.ts"
Cohesion: 0.07
Nodes (26): ActionMetadata, ActionMetadataUpdate, BrushShape, ColorSelectionSlot, Document, FileFormat, FontData, Handles (+18 more)

### Community 80 - "DoomApp"
Cohesion: 0.11
Nodes (9): DoomApp, DoomProgressDialog, Doom, How to Use, Key Features, Purpose, Screenshot, Technical Implementation (+1 more)

### Community 85 - "eye-gaze-mode.js"
Cohesion: 0.09
Nodes (10): apply_scale(), dwell_clicker, dwell_clicker_config, init_dwell_clicker(), init_tracky_mouse_ui(), update_auto_scaling(), update_floating_buttons(), undo() (+2 more)

### Community 88 - "Windows 98 Web Edition"
Cohesion: 0.06
Nodes (32): Applications, Asset Sources, Assets, Core System, Credits, Development & Build Tools, Games, AI Assistant (+24 more)

### Community 91 - "Pile"
Cohesion: 0.11
Nodes (7): RANKS, FoundationPile, Pile, StockPile, TableauPile, WastePile, SUIT_MAP

### Community 94 - "HelpApp"
Cohesion: 0.15
Nodes (7): HelpApp, How to Use, Implementation Details, Key Features, Purpose, Technologies Used, Windows Help

### Community 102 - "agent.js"
Cohesion: 0.17
Nodes (14): AgentApp, askAgent(), findAndOpenFromStartMenu(), findIcon(), findWindowCloseButton(), getAgentMenuItems(), getElementCenter(), launchAgentApp() (+6 more)

### Community 107 - "make_canvas"
Cohesion: 0.20
Nodes (8): render_canvas_view(), toggle_thumbnail(), update_helper_layer(), update_helper_layer_immediately(), get_rgba_from_color_implementation(), make_canvas(), draw_grid(), OnCanvasSelection

### Community 110 - "color-schemes.js"
Cohesion: 0.10
Nodes (20): colorSchemes, ../shared/styles/color-schemes/60s-usa.css?inline, ../shared/styles/color-schemes/baseball.css?inline, ../shared/styles/color-schemes/blue.css?inline, ../shared/styles/color-schemes/dangerous-creatures.css?inline, ../shared/styles/color-schemes/inside-your-computer.css?inline, ../shared/styles/color-schemes/jungle.css?inline, ../shared/styles/color-schemes/leonardo-da-vinci.css?inline (+12 more)

### Community 111 - "busy-state-manager.js"
Cohesion: 0.15
Nodes (18): CursorItem, CursorScheme, getCursorThemes(), busyStateRequesters, releaseState(), releaseWaitState(), requestState(), requestWaitState() (+10 more)

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

### Community 127 - "loadSpriteSheet"
Cohesion: 0.15
Nodes (19): bmpToCanvas(), getAudioBuffer(), getContext(), getPaletteColor(), getSprite(), init(), isMSADPCM(), loadInternal() (+11 more)

### Community 131 - "Tooltip"
Cohesion: 0.17
Nodes (7): blue, buttonDefinitions, magenta, red, scientificControlStyle, CalculatorButton, Tooltip

### Community 132 - "How to Add a New Desktop Theme"
Cohesion: 0.12
Nodes (15): 1\. `src/components/screensaver.js`, 1\. `src/config/wallpapers.js`, 2\. `src/config/sound-schemes.js`, 2\. `src/config/themes.js`, 3\. `src/config/icon-schemes.js`, 4\. `src/config/themes.js`, Before You Start: Required Assets, How to Add a New Desktop Theme (+7 more)

### Community 133 - "enqueueRequest"
Cohesion: 0.20
Nodes (15): animate(), animations(), delay(), enqueueRequest(), gestureAt(), getDirection(), hasAnimation(), interrupt() (+7 more)

### Community 144 - "spider-solitaire/game.js"
Cohesion: 0.25
Nodes (4): Card, Deck, RANKS, SUITS

### Community 145 - "Windows 98 Web Edition: AI Agent Development Guidelines"
Cohesion: 0.15
Nodes (12): 1. Project Architecture, 2. Key Dependencies, 3. Development Patterns, 4. Development Workflow, Adding a New Application, Application Integration, Centralized Configuration, Core Components & Systems (+4 more)

### Community 146 - "emit"
Cohesion: 0.17
Nodes (16): checkAndPlaySound(), checkAnimationCompletion(), completeAnimation(), emit(), getDefinition(), getNextFrameDetails(), handleVisibilityChange(), load() (+8 more)

### Community 147 - "app-localization.js"
Cohesion: 0.20
Nodes (4): get_direction(), load_language(), localize(), set_language()

### Community 152 - "apps/README.md"
Cohesion: 0.29
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

### Community 164 - "constructor"
Cohesion: 0.17
Nodes (16): a(), constructor(), getSpriteHeight(), getSpriteWidth(), getStyles(), handleIdleTick(), handleVisibilityChangeInternal(), i() (+8 more)

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

### Community 213 - "esheep.js"
Cohesion: 0.17
Nodes (14): ESheepApp, closeAllESheep(), getESheepMenuItems(), launchESheepApp(), makeDraggable(), calculateClickOffset(), dragMove(), finishDrag() (+6 more)

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
Cohesion: 0.29
Nodes (6): How to Use, Key Features, Purpose, Screenshot, Technologies Used, Webamp App

### Community 233 - "package.json"
Cohesion: 0.10
Nodes (20): devDependencies, @playwright/test, vite, vite-plugin-pwa, name, private, scripts, build (+12 more)

### Community 240 - "batch_update_readmes.sh"
Cohesion: 0.33
Nodes (5): custom_apps, file_apps, iframe_apps, batch_update_readmes.sh script, windowless_apps

### Community 241 - "App Maker"
Cohesion: 0.33
Nodes (5): App Maker, How to Use, Key Features, Purpose, Screenshot

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

### Community 249 - "Theme to CSS App"
Cohesion: 0.33
Nodes (5): How to Use, Key Features, Purpose, Screenshot, Theme to CSS App

### Community 250 - "WordPad"
Cohesion: 0.33
Nodes (5): How to Use, Key Features, Purpose, Technologies Used, WordPad

### Community 251 - "toolbar-icons.js"
Cohesion: 0.33
Nodes (3): BROWSE_UI_ICONS, BROWSE_UI_ICONS_GRAYSCALE, TOOLBAR_ICON_CONFIG

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1554 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **99 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Application` connect `ShowDialogWindow` to `desktop-context-menu-builder.js`, `@zenfs/core`, `getItem`, `QuakeApp`, `explorer-app.js`, `desktop-themes-app.js`, `ZenExplorerApp`, `FreeCellApp`, `Windows 98 Web Edition: AI Agent Development Guidelines`, `start-menu/start-menu.js`, `os-init.js`, `DesktopThemesApp`, `NotepadApp`, `MediaPlayerApp`, `ImageResizerApp`, `taskbar.js`, `PdfViewerApp`, `Adding New Applications`, `AboutApp`, `ReportABugApp`, `TaskManagerApp`, `DosBoxApp`, `DXBallApp`, `MinesweeperApp`, `DiabloApp`, `SpiderSolitaireApp`, `DoomApp`, `CursorExplorerApp`, `esheep.js`, `CalculatorApp`, `DOSShell`, `HelpApp`, `PrinceOfPersiaApp`, `DosGamesDownloaderApp`, `SoundSchemeExplorerApp`, `agent.js`, `DefragApp`, `ImageViewerApp`, `SolitaireApp`, `WordPadApp`, `KeenApp`, `PaintApp`, `Image Viewer`, `Windows 98 Web Edition: AI Agent Development Guidelines`?**
  _High betweenness centrality (0.204) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ShowDialogWindow()` (e.g. with `Proposed Changes:` and `Technologies Used`) actually correct?**
  _`ShowDialogWindow()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `os-gui`, `windowless_apps`, `iframe_apps` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sound-schemes.js` be split into smaller, more focused modules?**
  _Cohesion score 0.008264462809917356 - nodes in this community are weakly interconnected._
- **Why does `ShowDialogWindow()` connect `ShowDialogWindow` to `@zenfs/core`, `getItem`, `ShellManager`, `releaseBusyState`, `explorer-app.js`, `zenfs-init.js`, `theme-manager.js`, `desktop-themes-app.js`, `FreeCellApp`, `functions.js`, `StartMenu`, `start-menu/start-menu.js`, `releaseBusyState`, `os-init.js`, `edit-colors.js`, `DesktopThemesApp`, `MenuBarBuilder`, `NotepadApp`, `MediaPlayerApp`, `discord-activity-client.js`, `._showSingleProperties`, `Statistics`, `ReportABugApp`, `help.js`, `PinballApp`, `Proposal: Semantic HTML Improvements for Windows 98 Web Edition`, `DiabloApp`, `SpiderSolitaireApp`, `DragDropManager`, `DoomApp`, `CalculatorApp`, `PrinceOfPersiaApp`, `Report a Bug`, `DosGamesDownloaderApp`, `DefragApp`, `ImageViewerApp`, `SolitaireApp`, `WordPadApp`, `KeenApp`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Application` (e.g. with `Adding a New Application` and `Adding a New Application`) actually correct?**
  _`Application` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Should `cursors.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0091324200913242 - nodes in this community are weakly interconnected._