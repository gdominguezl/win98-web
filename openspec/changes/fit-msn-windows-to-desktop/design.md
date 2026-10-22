# Design

## Context

- `createMsnFrameWindow` builds `new $Window({ title, outerWidth: app.width, outerHeight: app.height, resizable, icons })`. In the `$Window` constructor, `setDimensions(options)` applies the size and then `$w.center()` places the window inside `#screen` (`getBoundingClientRect` of `#screen`), then `applyBounds` clamps its position to `#screen`.
- `#screen` contains both `#desktop-area` and the taskbar. `.desktop-area` height is `calc(100% - 28px - env(safe-area-inset-bottom) - 1px)`. A window taller than the desktop area but not taller than the screen therefore sits partly under the taskbar. This is the 13 inch laptop bug (the user's screenshot shows the MSN window cut by the taskbar).
- Measured earlier: at 1280x720 the Fotolog 1024x768 window overflows by 67 px, and MSN 529x796 at 1366x768 by about 47 px.
- `$Window.setDimensions({ innerWidth, innerHeight, outerWidth, outerHeight })` already supports sizing by content area; it measures the frame (borders, title bar, menu bar) so the result is theme independent.
- `Application` keeps the whole config in `this.config`, so extra literal keys such as `innerWidth` and `innerHeight` are available as `app.config.innerWidth` and are valid for the registry generator (plain literal).
- Winamp content measurements (from the user's reference screenshot and `winamp.css`): `.winamp-desktop` has `min-height: 580px` and the stacked mobile layout starts below 760 px of viewport width, so a 901x592 content area uses the desktop layout and no scroll.

## Goals / Non-Goals

**Goals:** Winamp opens at a 901x592 iframe; every MSN-family window opens fully visible above the taskbar on small screens; windows that already fit are untouched.

**Non-Goals:** see proposal.

## Decisions

**1. Fit in the shared helper, not per app.** After the size is known and before the window is shown, `createMsnFrameWindow` reads `document.getElementById("desktop-area").getBoundingClientRect()` and limits the outer size to it.
- Order: create the `$Window` with the intended size, then measure its outer size (`win.outerWidth()`, `win.outerHeight()`); if either is larger than the desktop area, call `win.setDimensions({ outerWidth: Math.min(w, area.width), outerHeight: Math.min(h, area.height) })`; finally position the window inside the desktop area (decision 2). Measuring the final outer size also covers content-size configs, because `setDimensions` has already converted them.
- A floor of 240 px in each dimension prevents absurd sizes on tiny viewports; below that the window is simply as large as the area allows.
- If `#desktop-area` is missing the helper does nothing (same as before).
- Alternative: percentage sizes (for example 95 percent of the desktop). Rejected: windows that fit would change, and the user chose specific sizes (529x796, 901x592) that must stay exact on large screens.
- Alternative: change `$Window.center()` to use `#desktop-area`. Rejected: shared by every app, and the project rules mark `public/os-gui` internals as stop-and-ask.
- Alternative: auto-maximize on small screens. Rejected: hides the desktop and breaks the "separate program" feel.

**2. Position inside the work area.** After fitting, set `left = max(0, (area.width - outerWidth) / 2)` and `top = max(0, (area.height - outerHeight) / 2)` using the desktop area rect, so the window is centered in the visible desktop and its bottom edge is never below the taskbar. Windows that fit keep being centered, but now in the work area instead of the full screen, so the vertical position shifts up by half the taskbar height (about 14 px). This is accepted and intended; assertions in the existing specs do not depend on it (checked in task 1.1).

**3. Winamp content-size config.** Config literal for `winamp`: `innerWidth: 901`, `innerHeight: 592`, and no `width` and `height` (the outer size is derived). The helper passes `innerWidth` and `innerHeight` to `$Window` when present, else `outerWidth` and `outerHeight` as now. `app.width` and `app.height` remain `undefined` for Winamp; the only readers found are the helper and `Application`'s own assignment (checked by grep). If another reader appears, stop and report.
- Why content size: the user asked for the iframe to be about 901x592; sizing by content makes that exact regardless of theme borders.
- Why not outer: the outer size would be about 913x618 with the default theme and would drift with other themes.

**4. Unchanged sizes for MSN and Fotolog.** 529x796 and 1024x768 stay as configured outer sizes; they only shrink when the desktop is too small. On such small desktops their content scrolls inside the frame (MSN's own layout).

**5. Proposed solution for the 13 inch MSN report, stated plainly.** On a desktop shorter than 796 px the MSN window now opens as tall as the work area (for example about 650 px on a 1280x720 viewport, 590 px on a short browser window) with its title bar at the top and its bottom edge right above the taskbar. The user can still maximize or resize. The MSN contact list scrolls inside the frame, as its CSS already does. No MSN change is needed.

**6. Tests (Playwright, written first)**, in the three existing specs with `test.use({ viewport })` groups:
- Winamp at 1440x900: window content area (iframe bounding box) is 901x592 within 1 px, window not maximized.
- At a small viewport (1280x600): for each of MSN, Fotolog, Winamp, the window's bounding box is fully inside `#desktop-area` (bottom of window <= bottom of `#desktop-area`, top >= 0, right <= area right), and it is not under the taskbar (window bottom <= taskbar top).
- At 1440x900 MSN is still 529x796 and Fotolog 1024x768 (unchanged for windows that fit).
- A tiny viewport (800x400): window size is limited to the area but not below the 240 px floor, and no exception is thrown.
- Resize after fit: maximize and restore still work and restore returns to the fitted size.

**7. Docs.** README sentence in the three apps about fitting to the desktop; Winamp README size note replaced (no more "scrolls vertically by default").

## Risks / Trade-offs

- **[Risk] Existing specs assert positions or sizes affected by centering in the work area.** → Mitigation: task 1.1 reruns the three app specs and `msn_app_links.spec.js` before changing code and lists assertions that depend on position; any needed update is reported.
- **[Risk] Measuring right after construction may read a size before layout settles.** → Mitigation: the helper measures after `$Window` is constructed and the iframe is injected; the small-viewport e2e cases would fail if this were wrong.
- **[Risk] Short viewports make Winamp's 592 px content shrink below its `min-height: 580px` desktop layout.** → Accepted: the page scrolls inside the frame, and the user can maximize.
- **[Trade-off] Windows that fit now sit about 14 px higher than before.** Accepted (decision 2).
- **[Risk] `innerWidth` and `innerHeight` are new config keys.** → They are read only by the helper; the registry generator handles them as plain literal keys, verified by `bun run build:registry`.

## Open Questions

- Is the 901x592 figure the iframe content size (assumed here) or the whole window? If it is the whole window, change two numbers to `width` and `height` and drop the inner keys; the fit logic does not change.
