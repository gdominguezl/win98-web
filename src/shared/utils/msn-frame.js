const MSN_APP_IDS = {
  "/": "msn-messenger",
  "/winamp": "winamp",
  "/fotolog": "fotolog",
};

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
  const win = new $Window({
    title: app.title,
    outerWidth: app.width,
    outerHeight: app.height,
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

  return win;
}
