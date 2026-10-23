import { registerStation } from "./engine.js";

const STATIONS = {
  argentina: [],
  chile: [],
};

for (const office of Object.keys(STATIONS)) {
  for (const entry of STATIONS[office]) {
    registerStation(office, entry);
  }
}
