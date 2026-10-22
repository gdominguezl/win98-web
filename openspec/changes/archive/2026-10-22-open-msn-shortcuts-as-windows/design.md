# Design

## Context

- `AppShortcuts.jsx` (MSN) renders `<nav class="app-shortcuts">` with `<Link class="app-shortcuts__link" to=... aria-label="Abrir <App>">` for the two other apps. It shows MSN (`/`), Fotolog (`/fotolog`) and Winamp (`/winamp`), hiding the one that matches the current route, and hides Winamp when `VITE_ENABLE_WINAMP === 'false'`. It renders on `/`, `/chat/:id`, `/winamp` and `/fotolog*`, never on `/login`. `Link` renders a real `<a href>` and handles the click through React Router's `onClick` (SPA navigation).
- `IFrameApplication._setupIframeForInactivity` already shows the pattern for same-origin frame documents: attach listeners on `iframe.load` and when already loaded, with a `try/catch` that warns on cross-origin.
- The frames are same-origin in production, so `iframe.contentDocument` is reachable from the Win98 page.
- `launchApp(appId)` for singleton apps already focuses or restores the running instance.

## Goals / Non-Goals

**Goals:** a click on an app switcher button inside any of the three windows opens the matching separate window; zero MSN change; every other behavior unchanged.

**Non-Goals:** see proposal.

## Decisions

**1. Intercept from Win98 with one delegated capture listener.** The frame document keeps its listener across React Router navigations because SPA navigation does not replace the document. A full page load (for example after login via `window.location`, a reload or navigating to another URL) creates a new document, so the listener is attached again from the iframe's `load` event.
- Capture phase on `document` runs before React's root listener (React 17+ attaches to the root container in the bubble phase), so `stopPropagation()` prevents React Router's `onClick` from navigating. `preventDefault()` also blocks the native navigation.
- Alternative: MSN `postMessage` to the parent. Rejected by the user (touches MSN logic).
- Alternative: add `data-app` to the links in MSN. Rejected by the user (no MSN change); remains the more robust future step.
- Alternative: rewrite the links' `href` after render with a MutationObserver. Rejected: more moving parts than one delegated listener.

**2. Matching rule.** In the handler: ignore if `event.defaultPrevented`, `event.button !== 0` or any of `ctrlKey`, `metaKey`, `shiftKey`, `altKey` is pressed (so open-in-new-tab and similar keep native behavior); find `event.target.closest("a.app-shortcuts__link")`; read `new URL(link.getAttribute("href"), link.baseURI).pathname` and map `"/"` → `msn-messenger`, `"/winamp"` → `winamp`, `"/fotolog"` → `fotolog`; if there is no mapping or the app is not in the registry (`window.System.appManager` or the apps list), do nothing and let the click proceed. Otherwise `preventDefault()`, `stopPropagation()` and `window.System.launchApp(appId)`.
- Keyboard: Enter or Space on a focused link produces a click event, so it is covered by the same handler.
- The map lives in one constant at the top of `msn-frame.js`, so adding a future MSN app is one line.

**3. Hook point.** `createMsnFrameWindow` calls `interceptAppShortcuts(iframe)` after re-querying the live iframe, next to `_setupIframeForInactivity`. So all three apps get it with no per-app code. The listener is bound to the frame document and dies with the frame on close; no global state, timers or observers remain, so nothing to clean up.

**4. Cross-origin and unreadable frames.** Reading `iframe.contentDocument` is wrapped in `try/catch` and warns once (`Could not attach app shortcut interception for <app>`), same as the inactivity helper. Nothing breaks: the buttons navigate inside the frame as before.

**5. Resulting UX.** In the MSN window, the Winamp and Fotolog buttons open those windows; in the Winamp window, the MSN and Fotolog buttons open MSN Messenger and Fotolog; in the Fotolog window, MSN and Winamp. The buttons that point to the current app are already hidden by MSN. Because each frame never navigates to another app, each window keeps its own app.

**6. Tests (Playwright, written first)** in `e2e/msn_app_links.spec.js`: stub the three frame URLs (`/`, `/winamp`, `/fotolog`) with HTML that reproduces the MSN contract (`<nav class="app-shortcuts"><a class="app-shortcuts__link" href="/winamp"> ... </nav>` plus a counter that records whether the page navigated). Cases: (a) in the MSN window, clicking the Winamp button opens `.window[data-app-id="winamp"]` and the MSN frame does not navigate; (b) same for Fotolog; (c) from the Winamp window, the MSN button focuses the existing MSN window instead of creating a second one; (d) clicking while the target is minimized restores it; (e) Ctrl+click and middle click are not intercepted; (f) Enter on a focused button opens the window; (g) a plain link such as `href="/other"` is not intercepted; (h) the interception survives an in-frame reload (listener reattached on `load`); (i) with a stub missing the switcher, nothing throws. A manual check against the real MSN (task 5.2) proves the real markup matches the stub.

**7. Docs.** A short "Opening other MSN apps" paragraph in the three app READMEs, including the dependency on the MSN markup (class and hrefs).

## Risks / Trade-offs

- **[Risk] Coupling to MSN markup.** If MSN renames `app-shortcuts__link` or changes the hrefs, the interception silently stops (buttons navigate in the frame again). → Mitigation: graceful fallback; contract documented in the README and the spec; a future MSN `data-app` attribute is the upgrade path.
- **[Risk] Capture-phase ordering assumption (React 17+ root listener).** → Mitigation: e2e case (a) and (b) assert that the frame does not navigate; manual check against the real MSN (5.2) and the deployed host.
- **[Risk] After signing in inside a Winamp or Fotolog window MSN navigates to its home (MSN `LoginPage.jsx` always calls `navigate('/')`).** The frame then shows the MSN home with its Winamp and Fotolog buttons, which open their own windows. → Accepted and documented; no MSN change in scope; a return-to-page fix would be a separate MSN change.
- **[Risk] A user can end up with Winamp, Fotolog and MSN all open, each with its own WebSocket and audio.** → Accepted: the MSN server keeps a set of sockets per user and the real apps behave the same in separate tabs.
- **[Trade-off] Win98 reaches into the frame document.** Already done for inactivity listeners and only possible same-origin, which is accepted for this deployment.

## Open Questions

- Do we later want a tiny MSN change (a `data-app` attribute) so the contract does not depend on class and href? Out of scope now.
