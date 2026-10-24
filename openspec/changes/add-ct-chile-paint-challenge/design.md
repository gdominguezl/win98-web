# Design

## Decisions

1. **Spike first (task 1).** In the running app, open a BMP from ZenFS in Paint, use Fill With Color on a flat region and confirm the pixel result and that the near-white letters stay distinct (Paint's fill is exact-color with no tolerance; verify with a canvas pixel read in Playwright). Outcome recorded in the change.
2. **Image.** About 640x240, 24-bit uncompressed BMP so no palette quantization merges the two near colors. Message in a bold sans font on 2 lines, doorbell sketch at the right. Letters `É` must render. The message color differs from the background by 1 level per channel so the page looks blank and the "invert colors" fallback also works.
3. **Fallbacks if the fill fails** (decided with the user only if the spike fails): zoom plus Image > Invert Colors on the same file; otherwise a second revealing image. The spike result decides; no extra work is done before it.
4. **Station.** `apply` writes the asset bytes (`?url` + fetch like `argentina-recycle.js`) to `/C:/My Documents/PUERTA.BMP`; `remove` unlinks it. Manifest holds the path.
5. Opening: double click in Explorer must open Paint via the existing association; if the `.bmp` association is the image viewer, the clue is still reachable via "Open with Paint"; spike reports which. If it opens in the viewer by default, the plan asks the user before changing associations (no association change is made here).

## Risks

- A visually near-white image may be invisible in the file icon preview; fine.
- Screens that crush near-white colors: verify on screenshot and on pixel read.
