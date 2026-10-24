export const STATIONS = {
  argentina: [
    { id: "recycle-clue", load: () => import("./argentina-recycle.js") },
    {
      id: "throwback-folder",
      load: () => import("./argentina-throwback.js"),
    },
    { id: "signals-file", load: () => import("./argentina-signals.js") },
    { id: "minesweeper", load: () => import("./minesweeper.js") },
  ],
  chile: [
    { id: "throwback-folder", load: () => import("./chile-throwback.js") },
    { id: "morse-file", load: () => import("./chile-morse.js") },
    { id: "minesweeper", load: () => import("./minesweeper.js") },
    { id: "recycle-clue", load: () => import("./chile-recycle.js") },
    { id: "y2k-memory", load: () => import("./chile-y2k.js") },
  ],
};
