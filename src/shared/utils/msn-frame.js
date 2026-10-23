const MSN_APP_IDS = {
  "/": "msn-messenger",
  "/winamp": "winamp",
  "/fotolog": "fotolog",
};

const MIN_EDGE = 240;

function limitEdge(current, available) {
  if (!(available > 0) || current <= available) {
    return current;
  }
  if (available < MIN_EDGE) {
    return available;
  }
  return available;
}

function positionInDesktop(win) {
  const areaEl = document.getElementById("desktop-area");
  if (!areaEl) {
    return;
  }
  const area = areaEl.getBoundingClientRect();
  const screen = document.getElementById("screen").getBoundingClientRect();
  const width = win.outerWidth();
  const height = win.outerHeight();
  win.css({
    left: area.left - screen.left + Math.max(0, (area.width - width) / 2),
    top: area.top - screen.top + Math.max(0, (area.height - height) / 2),
  });
}

function fitToDesktop(win) {
  const areaEl = document.getElementById("desktop-area");
  if (!areaEl) {
    return;
  }
  const area = areaEl.getBoundingClientRect();
  const outerWidth = limitEdge(win.outerWidth(), area.width);
  const outerHeight = limitEdge(win.outerHeight(), area.height);
  if (outerWidth !== win.outerWidth() || outerHeight !== win.outerHeight()) {
    win.setDimensions({ outerWidth, outerHeight });
  }
  positionInDesktop(win);
  const centerInScreen = win.center.bind(win);
  win.center = () => {
    centerInScreen();
    positionInDesktop(win);
  };
}

export function msnUrl(path) {
  const base = (import.meta.env.VITE_MSN_URL || "/").replace(/\/+$/, "");
  return base + path;
}

export function interceptAppShortcuts(iframe) {
  let warned = false;

  const onClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const link = event.target.closest("a.app-shortcuts__link");
    if (!link) {
      return;
    }
    const pathname = new URL(link.getAttribute("href"), link.baseURI).pathname;
    const appId = MSN_APP_IDS[pathname];
    if (!appId || !window.System.appManager.getAppConfig(appId)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    window.System.launchApp(appId);
  };

  const attach = () => {
    try {
      iframe.contentDocument.addEventListener("click", onClick, true);
    } catch (e) {
      if (!warned) {
        warned = true;
        console.warn(
          `Could not attach app shortcut interception for ${iframe.title}`,
          e,
        );
      }
    }
  };

  iframe.addEventListener("load", attach);

  if (
    iframe.contentWindow &&
    iframe.contentWindow.document.readyState === "complete"
  ) {
    attach();
  }
}

export function createMsnFrameWindow(app, { path, title }) {
  const hasInner =
    app.config.innerWidth != null && app.config.innerHeight != null;
  const win = new $Window({
    title: app.title,
    ...(hasInner
      ? {
          innerWidth: app.config.innerWidth,
          innerHeight: app.config.innerHeight,
        }
      : {
          outerWidth: app.width,
          outerHeight: app.height,
        }),
    resizable: app.resizable,
    icons: app.icon,
  });

  const iframe = document.createElement("iframe");
  iframe.src = msnUrl(path);
  iframe.title = title;
  iframe.setAttribute("allow", "autoplay; fullscreen; clipboard-write");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.backgroundColor = "#fff";

  // Instead of appending, set the inner HTML to allow $Window.js to observe
  win.$content.html(iframe.outerHTML);

  // Get the actual iframe element that was added to the DOM
  app.iframe = win.$content.find("iframe")[0];
  app._setupIframeForInactivity(app.iframe);
  interceptAppShortcuts(app.iframe);
  fitToDesktop(win);

  return win;
}
