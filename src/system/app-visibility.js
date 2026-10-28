export const ALWAYS_HIDDEN = ["buy-me-a-coffee"];

let hiddenApps = new Set();
let hiddenDesktopItems = new Set();
let pinnedProgram = null;

function refresh() {
  document.dispatchEvent(new CustomEvent("desktop-refresh"));
}

export function setHiddenApps(ids) {
  hiddenApps = new Set(ids || []);
  refresh();
}

export function setHiddenDesktopItems(names) {
  hiddenDesktopItems = new Set(names || []);
  refresh();
}

export function setPinnedProgram(appId) {
  pinnedProgram = appId || null;
  refresh();
}

export function isAppHidden(appId) {
  return ALWAYS_HIDDEN.includes(appId) || hiddenApps.has(appId);
}

export function isDesktopItemHidden(name) {
  return hiddenDesktopItems.has(name);
}

export function getPinnedProgram() {
  return pinnedProgram;
}
