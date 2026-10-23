# Y2K Patch

## Purpose

The **Y2K Patch** window is where a team types the code recovered from the office game. A correct code confirms that the system was saved before midnight on December 31, 1999.

## Key Features

- **Desktop and Start menu entry**: A "Y2K Patch" shortcut on the desktop, restored for returning users, and an entry directly under Start > Programs.
- **One shared code**: About 10 letters or digits. The expected code is `VITE_Y2K_PATCH_CODE`, or `Y2KPATCH99` when that variable is unset. Letter case, spaces, and dashes are ignored.
- **Wrong code**: The window shows an error and the field stays editable. There is no lockout.
- **Success**: A short install sequence covers the desktop, then says the patch is installed and files, memories, and messages will survive midnight. The same browser tab remembers that and does not play it again. A new tab asks for the code again.

## How to Use

1. Double-click **Y2K Patch** on the desktop, or open Start > Programs > Y2K Patch.
2. Type the recovered code and press Enter or click OK.

## Development

```bash
VITE_Y2K_PATCH_CODE=Y2KPATCH99 bun run dev
```

The code is read in the client. A later change can select one code per office inside `code.js` without rewriting the window. Game sessions that show or hide the app are also a later change.

## Screenshot

![Screenshot of the Y2K Patch app](./screenshot.png)
