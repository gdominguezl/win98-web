import { getRole, getSession, getToken } from "./api.js";
import "./improving-ct-october.css";

const LIMIT_MS = 60 * 60 * 1000;

let panel = null;
let snapshot = null;
let pollTimer = null;
let tickTimer = null;

function teamToken() {
  return getRole() === "team" && getToken();
}

function ensurePanel() {
  if (panel?.isConnected) return panel;
  const area = document.getElementById("desktop-area");
  if (!area) return null;
  panel = document.createElement("div");
  panel.id = "ct-timer";
  panel.innerHTML = `
    <div id="ct-timer-time">60:00</div>
    <p id="ct-timer-over" hidden>Game over</p>
  `;
  area.appendChild(panel);
  return panel;
}

function removePanel() {
  if (!panel) return;
  panel.remove();
  panel = null;
  snapshot = null;
}

function formatRemaining(ms) {
  const capped = Math.min(LIMIT_MS, Math.max(0, ms));
  const totalSeconds = Math.ceil(capped / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function remainingMs() {
  if (!snapshot?.startedAt) return LIMIT_MS;
  const started = Date.parse(snapshot.startedAt);
  const end =
    snapshot.status === "finished" && snapshot.finishedAt
      ? Date.parse(snapshot.finishedAt)
      : Date.parse(snapshot.serverNow) + (Date.now() - snapshot.localNow);
  return Math.max(0, LIMIT_MS - Math.max(0, end - started));
}

function render() {
  if (!panel) return;
  const remaining = remainingMs();
  const time = panel.querySelector("#ct-timer-time");
  const over = panel.querySelector("#ct-timer-over");
  if (time) time.textContent = formatRemaining(remaining);
  const gameOver = snapshot?.status === "running" && remaining === 0;
  if (over) over.hidden = !gameOver;
  panel.dataset.status = snapshot?.status || "ready";
}

async function poll() {
  if (!teamToken()) return;
  const result = await getSession();
  if (!teamToken()) {
    stopLoops();
    return;
  }
  if (result.status !== 200 || !result.body?.session) return;
  const session = result.body.session;
  if (session.status !== "running" && session.status !== "finished") {
    removePanel();
    return;
  }
  snapshot = { ...session, localNow: Date.now() };
  if (!ensurePanel()) return;
  render();
}

function stopLoops() {
  if (pollTimer) clearInterval(pollTimer);
  if (tickTimer) clearInterval(tickTimer);
  pollTimer = null;
  tickTimer = null;
  removePanel();
}

function bootLoops() {
  if (pollTimer) return;
  poll();
  pollTimer = setInterval(poll, 5000);
  tickTimer = setInterval(render, 1000);
}

export function startCtTimer() {
  const watch = () => {
    if (!teamToken()) {
      if (panel || pollTimer) stopLoops();
      return;
    }
    bootLoops();
    if (snapshot && !panel && ensurePanel()) render();
  };
  watch();
  setInterval(watch, 1000);
}

export async function refreshCtTimer() {
  if (!teamToken()) return;
  bootLoops();
  await poll();
}
