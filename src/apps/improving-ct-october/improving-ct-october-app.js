import { Application } from "../../system/application.js";
import { ICONS } from "../../config/icons.js";
import {
  adminBoard,
  adminLogin,
  adminPatchCode,
  adminReset,
  adminRestartTeam,
  adminSetPatchCode,
  adminTeams,
  createTeam,
  deleteTeam,
  clearSession,
  getRole,
  getSession,
  getToken,
  listTeams,
  saveSession,
  teamLogin,
  teamStart,
  updateTeam,
} from "./api.js";
import { refreshCtTimer, sessionStatusText } from "./timer.js";
import "./improving-ct-october.css";

function escapeText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function elapsedLabel(ms) {
  if (ms == null) return "";
  const total = Math.floor(Number(ms) / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function statusLabel(status) {
  if (status === "running") return "Running";
  if (status === "finished") return "Finished";
  return "Not started";
}

const SHELL = `
  <div class="ct-app" id="ct-app">
    <div class="ct-modes">
      <button type="button" id="ct-mode-team">Team</button>
      <button type="button" id="ct-mode-admin">Admin</button>
    </div>
    <p id="ct-error" class="ct-error" role="alert" hidden></p>
    <div id="ct-team-panel">
    <form id="ct-crew">
      <label>Office
        <select id="ct-office">
          <option value="argentina">Argentina</option>
          <option value="chile">Chile</option>
        </select>
      </label>
      <label>Team <select id="ct-team"></select></label>
      <label>Keyword <input id="ct-keyword" type="text" autocomplete="off" spellcheck="false"></label>
      <div class="ct-actions"><button type="submit" id="ct-start">Start</button></div>
    </form>
    <p id="ct-status" hidden></p>
    <div class="ct-actions" id="ct-new-game" hidden>
      <button type="button" id="ct-new-game-button">Start a new game</button>
    </div>
    </div>
    <form id="ct-admin-login" hidden>
      <label>Office
        <select id="ct-admin-office">
          <option value="argentina">Argentina</option>
          <option value="chile">Chile</option>
        </select>
      </label>
      <label>Password <input id="ct-password" type="password" autocomplete="off"></label>
      <div class="ct-actions"><button type="submit" id="ct-admin-enter">Sign in</button></div>
    </form>
    <div id="ct-admin" hidden>
      <h2>Patch code</h2>
      <form id="ct-patch-code-form">
        <div class="ct-row">
          <input id="ct-patch-code" type="text" maxlength="48" autocomplete="off" spellcheck="false" aria-label="Patch code">
          <button type="submit" id="ct-patch-code-save">Save code</button>
        </div>
        <p id="ct-patch-code-note" role="status"></p>
      </form>
      <h2>Teams</h2>
      <div id="ct-teams"></div>
      <div class="ct-row">
        <input id="ct-new-name" type="text" placeholder="Name" autocomplete="off">
        <input id="ct-new-keyword" type="text" placeholder="Keyword" autocomplete="off">
        <button type="button" id="ct-create">Create</button>
      </div>
      <h2>Board</h2>
      <div class="ct-actions"><button type="button" id="ct-refresh">Refresh</button></div>
      <ul id="ct-board" class="ct-board-rows"></ul>
      <h2>Podium</h2>
      <ol id="ct-podium" class="ct-podium"></ol>
      <div class="ct-actions"><button type="button" id="ct-reset">Reset all</button></div>
    </div>
  </div>
`;

export class ImprovingCtOctoberApp extends Application {
  static config = {
    id: "improving-ct-october",
    title: "Improving CT October",
    description: "Start the office session.",
    icon: ICONS.improvingCtOctober,
    category: "",
    width: 440,
    height: 380,
    resizable: false,
    isSingleton: true,
  };

  _createWindow() {
    const win = new $Window({
      title: this.title,
      outerWidth: this.width,
      outerHeight: this.height,
      resizable: false,
      icons: this.icon,
    });
    win.$content.html(SHELL);
    return win;
  }

  _onLaunch() {
    const root = this.win.$content[0];
    this._root = root;
    root.querySelector("#ct-mode-team").addEventListener("click", () => this._showCrew());
    root.querySelector("#ct-mode-admin").addEventListener("click", () => this._showAdminLogin());
    root.querySelector("#ct-office").addEventListener("change", () => this._loadTeams());
    root.querySelector("#ct-crew").addEventListener("submit", (event) => {
      event.preventDefault();
      this._start();
    });
    root.querySelector("#ct-admin-login").addEventListener("submit", (event) => {
      event.preventDefault();
      this._adminEnter();
    });
    root.querySelector("#ct-patch-code-form").addEventListener("submit", (event) => {
      event.preventDefault();
      this._savePatchCode();
    });
    root.querySelector("#ct-create").addEventListener("click", () => this._createTeam());
    root.querySelector("#ct-refresh").addEventListener("click", () => this._loadBoard());
    root.querySelector("#ct-reset").addEventListener("click", () => this._reset());
    root.querySelector("#ct-new-game-button").addEventListener("click", () => this._newGame());
    this._onSession = (event) => {
      const session = event.detail?.session;
      if (!session || !this._root?.isConnected) return;
      if (!this._teamTab()) return;
      if (session.status === "running" || session.status === "finished") this._showStatus(session);
    };
    window.addEventListener("ct-october-session", this._onSession);
    if (getRole() === "admin" && getToken()) {
      this._showAdmin();
      return;
    }
    this._showCrew();
  }

  _onClose() {
    if (this._onSession) window.removeEventListener("ct-october-session", this._onSession);
  }

  _error(message) {
    const error = this._root.querySelector("#ct-error");
    error.hidden = !message;
    error.textContent = message || "";
  }

  _teamTab() {
    return !this._root.querySelector("#ct-team-panel").hidden;
  }

  _showCrew() {
    this._error("");
    this._root.querySelector("#ct-team-panel").hidden = false;
    this._root.querySelector("#ct-admin-login").hidden = true;
    this._root.querySelector("#ct-admin").hidden = true;
    const status = this._root.querySelector("#ct-status");
    if (getRole() === "team" && getToken()) {
      getSession().then((result) => {
        if (!this._teamTab()) return;
        const session = result.body?.session;
        if (session && session.status !== "ready") {
          this._showStatus(session);
          return;
        }
        this._root.querySelector("#ct-crew").hidden = false;
        status.hidden = true;
        this._root.querySelector("#ct-new-game").hidden = true;
        this._loadTeams();
      });
      return;
    }
    this._root.querySelector("#ct-crew").hidden = false;
    status.hidden = true;
    this._root.querySelector("#ct-new-game").hidden = true;
    this._loadTeams();
  }

  async _loadTeams() {
    const office = this._root.querySelector("#ct-office").value;
    const select = this._root.querySelector("#ct-team");
    const result = await listTeams(office);
    const teams = result.body?.teams || [];
    select.innerHTML = teams
      .map((team) => `<option value="${team.id}">${escapeText(team.name)}</option>`)
      .join("");
  }

  async _start() {
    this._error("");
    const office = this._root.querySelector("#ct-office").value;
    const teamId = Number(this._root.querySelector("#ct-team").value);
    const field = this._root.querySelector("#ct-keyword");
    const login = await teamLogin(office, teamId, field.value);
    if (login.status !== 200 || !login.body?.token) {
      this._error("That keyword was not accepted.");
      field.focus();
      field.select();
      return;
    }
    saveSession(login.body.token, "team", office);
    const started = await teamStart();
    if (started.status !== 200) {
      this._error("The session could not be started.");
      return;
    }
    this._showStatus(started.body.session);
    refreshCtTimer();
  }

  _showStatus(session) {
    if (!this._teamTab()) return;
    this._root.querySelector("#ct-crew").hidden = true;
    const status = this._root.querySelector("#ct-status");
    status.hidden = false;
    status.textContent = sessionStatusText(session);
    this._root.querySelector("#ct-new-game").hidden = session?.status !== "finished";
  }

  _newGame() {
    clearSession();
    try {
      sessionStorage.removeItem("y2k-patch-applied");
    } catch {
      // This tab can still show the start form.
    }
    this._error("");
    this._root.querySelector("#ct-status").hidden = true;
    this._root.querySelector("#ct-new-game").hidden = true;
    this._root.querySelector("#ct-crew").hidden = false;
    this._loadTeams();
  }

  _showAdminLogin() {
    this._error("");
    this._root.querySelector("#ct-team-panel").hidden = true;
    this._root.querySelector("#ct-admin").hidden = true;
    this._root.querySelector("#ct-admin-login").hidden = false;
  }

  async _adminEnter() {
    this._error("");
    const office = this._root.querySelector("#ct-admin-office").value;
    const password = this._root.querySelector("#ct-password").value;
    const result = await adminLogin(office, password);
    if (result.status !== 200 || !result.body?.token) {
      this._error("That password was not accepted.");
      return;
    }
    saveSession(result.body.token, "admin");
    this._showAdmin();
  }

  _showAdmin() {
    this._error("");
    this._root.querySelector("#ct-team-panel").hidden = true;
    this._root.querySelector("#ct-admin-login").hidden = true;
    this._root.querySelector("#ct-admin").hidden = false;
    this._loadPatchCode();
    this._loadAdminTeams();
    this._loadBoard();
  }

  async _loadPatchCode() {
    const field = this._root.querySelector("#ct-patch-code");
    const save = this._root.querySelector("#ct-patch-code-save");
    const note = this._root.querySelector("#ct-patch-code-note");
    field.disabled = true;
    save.disabled = true;
    note.textContent = "";
    const result = await adminPatchCode();
    if (!this._root?.isConnected || this._root.querySelector("#ct-admin").hidden) return;
    if (result.status !== 200 || !result.body?.patchCode) {
      note.textContent = "The patch code could not be loaded.";
      return;
    }
    field.value = result.body.patchCode;
    field.disabled = false;
    save.disabled = false;
    if (result.body.isDefault) {
      note.textContent =
        "This office is still using the default code. Save your own code so the default stops working.";
    }
  }

  async _savePatchCode() {
    const field = this._root.querySelector("#ct-patch-code");
    const save = this._root.querySelector("#ct-patch-code-save");
    const note = this._root.querySelector("#ct-patch-code-note");
    save.disabled = true;
    const board = await adminBoard();
    if (board.status === 401) return this._sessionExpired();
    if (Number(board.body?.runningCount || 0) > 0) {
      if (!window.confirm("Someone is still playing. Change the code anyway?")) {
        save.disabled = false;
        field.focus();
        return;
      }
    }
    const result = await adminSetPatchCode(field.value);
    if (result.status === 401) return this._sessionExpired();
    save.disabled = false;
    if (result.status === 200) {
      field.value = result.body.patchCode;
      note.textContent = "Code saved. It applies to the next code teams enter.";
      return;
    }
    note.textContent =
      result.status === 400 && result.body?.error ? result.body.error : "The code could not be saved.";
    field.focus();
  }

  _sessionExpired() {
    this._showAdminLogin();
    this._error("Your admin session expired. Sign in again.");
  }

  async _loadAdminTeams() {
    const result = await adminTeams();
    const list = this._root.querySelector("#ct-teams");
    list.innerHTML = (result.body?.teams || [])
      .map(
        (team) => `
        <div class="ct-row" data-team-id="${team.id}">
          <input class="ct-name" value="${escapeText(team.name)}">
          <input class="ct-team-keyword" value="${escapeText(team.keyword)}">
          <button type="button" class="ct-save">Save</button>
          <button type="button" class="ct-delete">Delete</button>
        </div>`
      )
      .join("");
    list.querySelectorAll(".ct-save").forEach((button) => {
      button.addEventListener("click", () => this._saveTeam(button.closest("[data-team-id]")));
    });
    list.querySelectorAll(".ct-delete").forEach((button) => {
      button.addEventListener("click", () => this._deleteTeam(button.closest("[data-team-id]")));
    });
  }

  async _saveTeam(row) {
    await updateTeam(row.dataset.teamId, {
      name: row.querySelector(".ct-name").value,
      keyword: row.querySelector(".ct-team-keyword").value,
    });
    this._loadAdminTeams();
  }

  async _deleteTeam(row) {
    await deleteTeam(row.dataset.teamId);
    this._loadAdminTeams();
    this._loadBoard();
  }

  async _createTeam() {
    const name = this._root.querySelector("#ct-new-name");
    const keyword = this._root.querySelector("#ct-new-keyword");
    const result = await createTeam(name.value, keyword.value);
    if (result.status !== 201) {
      this._error("The team could not be created.");
      return;
    }
    name.value = "";
    keyword.value = "";
    this._loadAdminTeams();
  }

  async _loadBoard() {
    const result = await adminBoard();
    const board = result.body || { teams: [], podium: [] };
    const boardList = this._root.querySelector("#ct-board");
    boardList.innerHTML = (board.teams || [])
      .map((team) => {
        const time = team.status === "ready" ? "" : ` — ${elapsedLabel(team.elapsedMs)}`;
        const restart = team.status === "ready" ? "" : `<button type="button" class="ct-restart">Restart</button>`;
        return `<li data-team-id="${team.id}"><span>${escapeText(team.name)} — ${statusLabel(team.status)}${time}</span>${restart}</li>`;
      })
      .join("");
    boardList.querySelectorAll(".ct-restart").forEach((button) => {
      const row = button.closest("[data-team-id]");
      const team = (board.teams || []).find((item) => String(item.id) === row.dataset.teamId);
      button.addEventListener("click", () => this._restartTeam(team));
    });
    this._root.querySelector("#ct-podium").innerHTML = (board.podium || [])
      .map((row) => `<li>${row.place}. ${escapeText(row.name)}</li>`)
      .join("");
  }

  async _restartTeam(team) {
    if (!team) return;
    const message =
      team.status === "running"
        ? `${team.name} is still playing. Restart this team anyway?`
        : `Restart ${team.name}? Their time will be cleared.`;
    if (!window.confirm(message)) return;
    await adminRestartTeam(team.id);
    this._loadBoard();
  }

  async _reset() {
    const board = await adminBoard();
    const running = Number(board.body?.runningCount || 0);
    const message =
      running > 0
        ? "Someone is still playing. Reset this office anyway?"
        : "Reset this office? Team names will stay.";
    if (!window.confirm(message)) return;
    await adminReset();
    this._loadAdminTeams();
    this._loadBoard();
  }
}
