# Design

## Context

- Station engine (`add-ct-station-engine`): a station is `{ id, apply(ctx) -> manifest, remove(ctx, manifest) }`, applied once the session of the office is running and removed when it stops running. `apply` runs again once per page load, so it must be idempotent.
- The Recycle Bin is ZenFS based (`src/shell/explorer/file-operations/recycle-bin-manager.js`). For drive C items live in `/C:/Recycled/<id>` and `/C:/Recycled/.metadata.json` maps `id -> { id, originalPath, originalName, deletionDate }`. `RecycleBinManager.getMetadata(recyclePath)` and `saveMetadata(recyclePath, metadata)` read and write it; `refreshFullState()` updates the icon; `document.dispatchEvent(new CustomEvent("recycle-bin-change"))` refreshes open views. `restoreItems` moves the item to `originalPath`.
- `src/config/recyclebin.js` and `recycle-bin-utils.js` are an older localStorage-based list (`recycleBinContent = []`); the shell uses the ZenFS manager above, which is what this station targets.
- `C:\My Documents` (`/C:/My Documents`) exists on every profile.

## Goals / Non-Goals

**Goals:** while an Argentina team runs, the Recycle Bin holds the clue image; it can be restored and opened; everything disappears when the session stops running.

**Non-Goals:** see proposal.

## Decisions

**1. Fixed id, idempotent apply.** Item id `ct-argentina-clue`. `apply`:
1. Ensure `/C:/Recycled` exists (`mkdir` recursive) and `.metadata.json` exists (`{}`), the same way `moveItemsToRecycleBin` does.
2. Fetch the bundled image (`import url from "./assets/<file>?url"` inside the station module, which the engine loads dynamically) and write its bytes to `/C:/Recycled/ct-argentina-clue` (overwrite).
3. `getMetadata`, set `ct-argentina-clue: { id, originalPath: "/C:/My Documents/<name>", originalName: "<name>", deletionDate: <now ISO> }`, `saveMetadata`.
4. `RecycleBinManager.refreshFullState()` and dispatch `recycle-bin-change`.
5. Return the manifest `{ id: "ct-argentina-clue", originalPath: "/C:/My Documents/<name>" }`.
Running it again changes nothing visible (same item, one entry).

**2. Remove.** From the manifest: delete `/C:/Recycled/ct-argentina-clue` if it exists; remove its metadata key; delete the file at `originalPath` if it exists (the restored copy); `refreshFullState()` and `recycle-bin-change`. Each step ignores "not found". If the team restored and renamed or moved the file, that copy is not found by name and stays (accepted; documented).

**3. Name and location.** `<name>` is a neutral file name with the image's extension (default `IMG_0001.<ext>`), original location `C:\My Documents`. These are the defaults used because they were not specified; they are two constants at the top of the station.

**4. Image asset.** Stored under `src/apps/improving-ct-october/stations/assets/` using the image the user provides; imported with Vite `?url` from inside the station module only, so it is code-split and fetched only for Argentina sessions. PWA precache does not include it by default (only js, css and html are precached), so Chile and no-session users never download it.

**5. Registry.** `registry.js` adds `argentina: [{ id: "recycle-clue", load: () => import("./argentina-recycle.js") }]`.

**6. Tests (Playwright, written first)** in `e2e/ct_station_argentina.spec.js` with the CT mock and the real ZenFS:
- Argentina team starts: the Recycle Bin (desktop icon shows full, and the Recycle Bin window lists the item with the neutral name) holds the clue.
- Restore: `RecycleBinManager`-level restore (through the window context menu or `window.System` helpers used by the Explorer) puts the file in `C:\My Documents` and it opens in the image viewer window.
- Finish (patch accepted): the item and any restored copy are gone and the icon returns to empty.
- Chile team start and no session: the Recycle Bin stays as it was (empty) and no `ct-argentina-clue` file exists.
- Rejoin and reload: one item only.
- A pre-existing user item in the Recycle Bin is not touched by apply or remove.
- Existing Recycle Bin behavior (delete a file to the bin, restore it) still works while no session runs; `e2e` specs for the explorer and desktop keep their baseline status.

**7. Docs.** README of the CT window: a line under "Stations" listing Argentina's station.

## Risks / Trade-offs

- **[Risk] Writing into the Recycle Bin internals.** The format is internal. → Mitigation: only the documented fields written by the manager itself; a test deletes and restores a normal file to guard the shared format.
- **[Risk] The team empties the Recycle Bin.** → Accepted; restart plus a new start re-applies.
- **[Risk] A restored copy renamed or moved by the team stays.** → Accepted; it is only a copy of the clue image.
- **[Risk] Name collision at `C:\My Documents`.** A user file named like the clue would be overwritten on restore and removed at cleanup. → Mitigation: a distinctive neutral name and a one-time check in `apply` that logs a warning and picks the `_1` variant if the target name already exists.
- **[Trade-off] The bundle gains one image file.** Fetched on demand, not in the initial load.

## Open Questions

The image was received afterwards: a 1024x576 PNG (954 KB, a Fotolog page screenshot), at `/tmp/ct-assets/argentina-clue.png`. Defaults used and to confirm:
- Name `IMG_0001.png`; original location `C:\My Documents`.
- The restored copy is also removed when the session stops running.
