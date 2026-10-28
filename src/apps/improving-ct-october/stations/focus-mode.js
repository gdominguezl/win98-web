import {
  setHiddenApps,
  setHiddenDesktopItems,
  setPinnedProgram,
} from "../../../system/app-visibility.js";

const HIDDEN_APPS = [
  "desktop-themes",
  "agent",
  "diablo",
  "keen",
  "doom",
  "quake",
  "app-maker",
  "dos-games-downloader",
  "task-manager",
  "report-a-bug",
  "cursor-explorer",
  "sound-scheme-explorer",
  "flash-player",
  "media-player",
];

const HIDDEN_DESKTOP_ITEMS = ["Network Neighborhood"];
const PINNED_PROGRAM = "command-prompt";

export const id = "focus-mode";

export async function apply() {
  setHiddenApps(HIDDEN_APPS);
  setHiddenDesktopItems(HIDDEN_DESKTOP_ITEMS);
  setPinnedProgram(PINNED_PROGRAM);
  return {};
}

export async function remove() {
  setHiddenApps(null);
  setHiddenDesktopItems(null);
  setPinnedProgram(null);
}
