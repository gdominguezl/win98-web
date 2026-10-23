# Proposal

## Why

Argentina teams must be able to find a clue by looking in the Windows 98 Recycle Bin: an image that looks deleted and that they can restore and open. This is the first station built on the engine from `add-ct-station-engine` (apply while the team runs, remove when the session stops running).

## What Changes

- New station `recycle-clue` for office `argentina` (`src/apps/improving-ct-october/stations/argentina-recycle.js`), registered in `registry.js`.
- While an Argentina team is running, the Recycle Bin contains one extra item: the clue image, with its original location set to `C:\My Documents` and a neutral file name. The Recycle Bin icon shows as full. Restoring it puts the image back in `C:\My Documents`, where it opens in the Win98 image viewer.
- When the engine removes stations, the item is removed from the Recycle Bin and, if the team restored it, the restored copy is removed too, so the next session starts clean.
- The image asset ships in the bundle and is only fetched when an Argentina session starts (dynamic import).
- No server, MSN or nginx change.

## Capabilities

### New Capabilities

- `apps/ct-station-argentina`: the hidden Recycle Bin image for Argentina teams.

### Modified Capabilities

None.

## Impact

- **Layers affected**: an app (`improving-ct-october/stations/`), one image asset, tests and README. It uses the Recycle Bin manager of the shell (`RecycleBinManager`) through its public static methods; nothing in the shell is edited.
- **Concrete files**: `src/apps/improving-ct-october/stations/argentina-recycle.js`, `src/apps/improving-ct-october/stations/registry.js`, `src/apps/improving-ct-october/stations/assets/` (the clue image), `e2e/ct_station_argentina.spec.js`, `src/apps/improving-ct-october/README.md`.
- **Blast radius** (`graphify affected`): `RecycleBinManager` is used by the Explorer, the Recycle Bin shell extension and the desktop; this change only reads and writes its documented data (`/C:/Recycled/.metadata.json` and one item file) and fires its existing `recycle-bin-change` event. No other app imports the new station.
- **Persistence impact**: ZenFS only. One item file `/C:/Recycled/ct-argentina-clue` and one entry in `/C:/Recycled/.metadata.json` while the station is applied, listed in the engine marker `/C:/.ct_stations.json`. If restored, the image sits at `C:\My Documents\<name>` until removal. No localStorage or sessionStorage key. Nothing is written for users without an Argentina session.
- **Authenticity impact**: deleted files in the Win98 Recycle Bin keep their original name and location and can be restored with Restore or drag and drop; the station uses exactly that data model, so it looks like any deleted file.
- **Rollout and compatibility (EC2)**: win98-web image only, after `add-ct-station-engine`. No MSN, API or env change. Argentina's station never runs for MSN, Fotolog or Winamp users, and Chile and no-session users see an untouched Recycle Bin.

## Non-goals

- The Chile station and any other station.
- Preventing the team from emptying the Recycle Bin or deleting the restored image (an admin restart and a new start re-applies it).
- Hiding the image from someone reading the app bundle.
- A viewer or clue text of our own: the restored image opens with the existing image viewer.
