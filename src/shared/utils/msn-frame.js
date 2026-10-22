export function msnUrl(path) {
  const base = (import.meta.env.VITE_MSN_URL || "/").replace(/\/+$/, "");
  return base + path;
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

  return win;
}
