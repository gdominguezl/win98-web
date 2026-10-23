import { getRole, getSession, getToken } from "./api.js";
import "./improving-ct-october.css";

const LIMIT_MS = 60 * 60 * 1000;
const FINALE_MS = 2200;

let panel = null;
let snapshot = null;
let pollTimer = null;
let tickTimer = null;
let finaleTimer = null;
let finalePending = false;
let finalePlayed = false;
let announcedOvertime = false;

export function sessionStatusText(session) {
  const late = Number(session?.elapsedMs) >= LIMIT_MS || session?.overtime;
  if (session?.status === "finished") {
    return late
      ? "This team has not completed the challenge on time. The patch was still accepted."
      : "This team has completed the challenge on time.";
  }
  if (session?.status === "running" && late) {
    return "This team has not completed the challenge on time, but you can still try to enter the patch.";
  }
  if (session?.status === "running") return "This team is running.";
  return "";
}

function publish(session) {
  window.dispatchEvent(new CustomEvent("ct-october-session", { detail: { session } }));
}

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
  if (finaleTimer) clearTimeout(finaleTimer);
  finaleTimer = null;
  if (!panel) return;
  panel.remove();
  panel = null;
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
  if (!panel || panel.classList.contains("ct-timer-finale")) return;
  const remaining = remainingMs();
  const time = panel.querySelector("#ct-timer-time");
  const over = panel.querySelector("#ct-timer-over");
  if (time) time.textContent = formatRemaining(remaining);
  const gameOver = snapshot?.status === "running" && remaining === 0;
  if (over) over.hidden = !gameOver;
  if (gameOver && !announcedOvertime) {
    announcedOvertime = true;
    publish({ ...snapshot, overtime: true, elapsedMs: Math.max(LIMIT_MS, Number(snapshot.elapsedMs) || LIMIT_MS) });
  }
  if (!gameOver) announcedOvertime = false;
  panel.dataset.status = snapshot?.status || "ready";
}

function showFinale(session) {
  const node = ensurePanel();
  if (!node) {
    finalePending = false;
    return;
  }
  const onTime = Number(session?.elapsedMs) < LIMIT_MS && !session?.overtime;
  node.dataset.status = "finished";
  node.classList.add("ct-timer-finale");
  node.innerHTML = `
    <p id="ct-timer-finale">${onTime ? "Challenge complete." : "Patch accepted."}</p>
    <div class="ct-finale-bar"><span></span></div>
  `;
  finaleTimer = setTimeout(() => {
    finalePlayed = true;
    finalePending = false;
    finaleTimer = null;
    removePanel();
  }, FINALE_MS);
}

function beginFinale(session) {
  if (finalePlayed || finalePending) return;
  finalePending = true;
  const overlay = document.getElementById("y2k-overlay");
  if (!overlay) {
    showFinale(session);
    return;
  }
  const screen = overlay.parentElement;
  const observer = new MutationObserver(() => {
    if (document.getElementById("y2k-overlay")) return;
    observer.disconnect();
    showFinale(session);
  });
  if (screen) observer.observe(screen, { childList: true });
  else showFinale(session);
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
  snapshot = { ...session, localNow: Date.now() };
  publish(session);
  if (session.status === "finished") {
    beginFinale(session);
    render();
    return;
  }
  if (session.status !== "running") {
    finalePlayed = false;
    finalePending = false;
    announcedOvertime = false;
    removePanel();
    snapshot = null;
    return;
  }
  finalePlayed = false;
  finalePending = false;
  if (!ensurePanel()) return;
  render();
}

function stopLoops() {
  if (pollTimer) clearInterval(pollTimer);
  if (tickTimer) clearInterval(tickTimer);
  pollTimer = null;
  tickTimer = null;
  finalePlayed = false;
  finalePending = false;
  announcedOvertime = false;
  snapshot = null;
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
    if (snapshot?.status === "running" && !finalePlayed && !panel && ensurePanel()) render();
  };
  watch();
  setInterval(watch, 1000);
}

export async function refreshCtTimer() {
  if (!teamToken()) return;
  bootLoops();
  await poll();
}
