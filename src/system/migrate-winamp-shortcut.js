import { fs } from "@zenfs/core";
import { existsAsync } from "./zenfs-utils.js";

const MARKER = "/C:/.winamp_msn_migrated";

const WINAMP_SHORTCUTS = [
  "/C:/WINDOWS/Desktop/Winamp.lnk.json",
  "/C:/WINDOWS/Start Menu/Programs/Winamp.lnk.json",
];

/**
 * One-time migration: repoint the default "Winamp" shortcuts from the
 * classic Webamp player ("webamp") to the MSN Winamp app ("winamp"),
 * rewriting the files in place so the desktop layout (keyed by file name)
 * is preserved. Only the two default locations are migrated; any other
 * shortcut to the classic player is left alone.
 */
export async function migrateWinampShortcuts() {
  if (await existsAsync(MARKER)) {
    return;
  }

  for (const path of WINAMP_SHORTCUTS) {
    try {
      if (!(await existsAsync(path))) {
        continue;
      }
      const text = await fs.promises.readFile(path, "utf8");
      const shortcut = JSON.parse(text);
      if (shortcut.type === "shortcut" && shortcut.appId === "webamp") {
        shortcut.appId = "winamp";
        await fs.promises.writeFile(path, JSON.stringify(shortcut, null, 2));
      }
    } catch (e) {
      console.warn(`Failed to migrate Winamp shortcut ${path}:`, e);
    }
  }

  try {
    await fs.promises.writeFile(MARKER, "done");
  } catch (e) {
    console.warn("Failed to write Winamp migration marker:", e);
  }
}
