export const STATIONS = {
  argentina: [
    { id: "recycle-clue", load: () => import("./argentina-recycle.js") },
    {
      id: "throwback-folder",
      load: () => import("./argentina-throwback.js"),
    },
  ],
  chile: [
    { id: "throwback-folder", load: () => import("./chile-throwback.js") },
  ],
};
