import { fs, mounts } from "@zenfs/core";
import { getOffice, getRole, getToken } from "../api.js";
import "./registry.js";

const MARKER = "/C:/.ct_stations.json";
const OFFICES = ["argentina", "chile"];

const registry = { argentina: [], chile: [] };
const activated = new Set();
let lastSession = null;
let chain = Promise.resolve();

export function registerStation(office, entry) {
  if (!OFFICES.includes(office) || !entry?.id || typeof entry.load !== "function") return;
  registry[office].push(entry);
}

function teamSession() {
  return getRole() === "team" && !!getToken();
}

function desiredOffice() {
  const office = getOffice();
  if (!teamSession() || !OFFICES.includes(office)) return null;
  return lastSession?.status === "running" ? office : null;
}

async function readMarker() {
  try {
    const raw = await fs.promises.readFile(MARKER, "utf8");
    const marker = JSON.parse(raw);
    return marker && typeof marker === "object" ? marker : null;
  } catch {
    return null;
  }
}

async function writeMarker(office, stations) {
  await fs.promises.writeFile(MARKER, JSON.stringify({ office, stations }));
}

async function deleteMarker() {
  try {
    await fs.promises.unlink(MARKER);
  } catch {}
}

async function removeAll(marker) {
  const entries = registry[marker.office] || [];
  const stations = marker.stations || {};
  for (const id of Object.keys(stations)) {
    const entry = entries.find((item) => item.id === id);
    if (!entry) {
      console.warn(`CT station ${id} is no longer known; dropping it from the marker`);
      continue;
    }
    try {
      const station = await entry.load();
      await station.remove({ fs, office: marker.office }, stations[id]);
    } catch (error) {
      console.warn(`CT station ${id} failed to remove`, error);
    }
  }
  await deleteMarker();
}

async function whenMounted() {
  for (let i = 0; i < 240 && !mounts.has("/C:"); i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

async function run() {
  await whenMounted();
  const desired = desiredOffice();
  const marker = await readMarker();
  if (!desired) {
    if (marker) await removeAll(marker);
    activated.clear();
    return;
  }
  if (marker && marker.office !== desired) {
    await removeAll(marker);
    activated.clear();
  }
  const entries = registry[desired] || [];
  const known = new Set(entries.map((entry) => entry.id));
  const stations = { ...(marker?.stations || {}) };
  for (const id of Object.keys(stations)) {
    if (!known.has(id)) {
      console.warn(`CT station ${id} is no longer known; dropping it from the marker`);
      delete stations[id];
    }
  }
  for (const entry of entries) {
    if (activated.has(entry.id)) continue;
    try {
      const station = await entry.load();
      stations[entry.id] = await station.apply({ fs, office: desired });
      activated.add(entry.id);
      await writeMarker(desired, stations);
    } catch (error) {
      console.warn(`CT station ${entry.id} failed to apply`, error);
    }
  }
  if (marker || Object.keys(stations).length > 0) {
    await writeMarker(desired, stations);
  }
}

export function reconcile() {
  chain = chain.then(run).catch(() => {});
  return chain;
}

export function startCtStations() {
  window.addEventListener("ct-october-session", (event) => {
    lastSession = event.detail?.session || null;
    reconcile();
  });
  window.addEventListener("ct-october-auth", () => {
    if (!teamSession()) lastSession = null;
    reconcile();
  });
  if (teamSession()) return;
  setTimeout(reconcile, 0);
}
