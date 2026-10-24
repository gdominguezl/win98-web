export const STATIONS = {
  argentina: [
    { id: "recycle-clue", load: () => import("./argentina-recycle.js") },
    {
      id: "throwback-folder",
      load: () => import("./argentina-throwback.js"),
    },
    { id: "signals-file", load: () => import("./argentina-signals.js") },
  ],
  chile: [
    { id: "throwback-folder", load: () => import("./chile-throwback.js") },
    { id: "morse-file", load: () => import("./chile-morse.js") },
  ],
};
