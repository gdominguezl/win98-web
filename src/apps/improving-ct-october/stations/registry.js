export const STATIONS = {
  argentina: [{ id: "recycle-clue", load: () => import("./argentina-recycle.js") }],
  chile: [
    { id: "throwback-folder", load: () => import("./chile-throwback.js") },
  ],
};
