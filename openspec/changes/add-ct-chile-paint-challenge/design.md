# Design

## Decisions

1. **Spike first (task 1).** In the running app, open a BMP from ZenFS in Paint, use Fill With Color on a flat region and confirm the pixel result and that the near-white letters stay distinct (Paint's fill is exact-color with no tolerance; verify with a canvas pixel read in Playwright). Outcome recorded in the change.
2. **Image.** About 640x240, 24-bit uncompressed BMP so no palette quantization merges the two near colors. Message in a bold sans font on 2 lines, doorbell sketch at the right. Letters `É` must render. The message color differs from the background by 1 level per channel so the page looks blank and the "invert colors" fallback also works.
3. **Fallbacks if the fill fails** (decided with the user only if the spike fails): zoom plus Image > Invert Colors on the same file; otherwise a second revealing image. The spike result decides; no extra work is done before it.
4. **Station.** `apply` writes the asset bytes (`?url` + fetch like `argentina-recycle.js`) to `/C:/My Documents/PUERTA.BMP`; `remove` unlinks it. Manifest holds the path.
5. Opening: double click in Explorer opens Paint via the existing `.bmp` association (spike confirmed).
6. **Open-dialog default.** During a Chile session, File > Open must preselect `24-bit Bitmap (*.bmp;*.dib)` so the BMP filter is active without a manual switch. `src/apps/paint/challenge.js` exposes `setPaintOpenDefault(extension | null)` / `getPaintOpenDefault()` (same pattern as `src/apps/minesweeper/challenge.js`, no CT knowledge); `paint-app.js`'s `showOpenFileDialog` hook resolves the index of the mapped `fileTypes` entry whose extensions contain the requested extension and whose label contains "24-bit" (falls back to 0) and passes it as `defaultFileTypeIndex` to `ShowFilePicker`. `FilePicker` accepts the optional `defaultFileTypeIndex` (default 0) so every other caller and the Save As dialog are unchanged. `stations/chile-paint.js` sets `"bmp"` in `apply` and `null` in `remove`.

## Risks

- A visually near-white image may be invisible in the file icon preview; fine.
- Screens that crush near-white colors: verify on screenshot and on pixel read.
