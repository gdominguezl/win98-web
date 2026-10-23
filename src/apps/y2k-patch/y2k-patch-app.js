import { Application } from "../../system/application.js";
import { ICONS } from "../../config/icons.js";
import { codesMatch } from "./code.js";
import "./y2k-patch.css";

const APPLIED_KEY = "y2k-patch-applied";
const INSTALL_MS = 2000;

const FORM_HTML = `
  <form class="y2k-patch" id="y2k-form">
    <p>Enter the patch code recovered from the system records.</p>
    <label for="y2k-code">Code:
      <input id="y2k-code" type="text" maxlength="32" autocomplete="off" spellcheck="false">
    </label>
    <p id="y2k-status" class="y2k-status" role="alert" hidden>The code was not accepted.</p>
    <div class="y2k-buttons">
      <button type="submit" id="y2k-ok">OK</button>
    </div>
  </form>
`;

const INSTALLED_HTML = `
  <div class="y2k-patch">
    <p id="y2k-installed">The Y2K patch is already installed on this computer.</p>
  </div>
`;

function isApplied() {
  try {
    return sessionStorage.getItem(APPLIED_KEY) === "1";
  } catch {
    return false;
  }
}

export class Y2kPatchApp extends Application {
  static config = {
    id: "y2k-patch",
    title: "Y2K Patch",
    description: "Install the patch before midnight.",
    icon: ICONS.key,
    category: "",
    width: 360,
    height: 200,
    resizable: false,
    isSingleton: true,
  };

  constructor(config) {
    super(config);
    this._timer = null;
    this._installing = false;
  }

  _createWindow() {
    const win = new $Window({
      title: this.title,
      outerWidth: this.width,
      outerHeight: this.height,
      resizable: false,
      icons: this.icon,
    });
    win.$content.html(isApplied() ? INSTALLED_HTML : FORM_HTML);
    return win;
  }

  _onLaunch() {
    if (isApplied()) return;

    const root = this.win.$content[0];
    const form = root.querySelector("#y2k-form");
    const field = root.querySelector("#y2k-code");
    const status = root.querySelector("#y2k-status");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (codesMatch(field.value)) {
        this._apply();
        return;
      }
      status.hidden = false;
      field.focus();
      field.select();
    });

    field.focus();
  }

  _onClose() {
    if (this._installing) this._clearInstall(true);
  }

  _apply() {
    sessionStorage.setItem(APPLIED_KEY, "1");
    this.win.$content.html(INSTALLED_HTML);
    this._showOverlay();
  }

  _showOverlay() {
    this._clearInstall(true);
    const screen = document.getElementById("screen");
    if (!screen) return;

    const overlay = document.createElement("div");
    overlay.id = "y2k-overlay";
    overlay.innerHTML = `
      <div class="y2k-overlay-panel">
        <p id="y2k-overlay-progress">Installing the Y2K patch...</p>
        <div class="progress-indicator" id="y2k-progress">
          <span class="progress-indicator-bar"></span>
        </div>
        <p id="y2k-overlay-message" hidden>The patch is installed. Files, memories, and messages will survive midnight.</p>
        <div class="y2k-buttons">
          <button type="button" id="y2k-overlay-ok" hidden>OK</button>
        </div>
      </div>
    `;
    screen.appendChild(overlay);
    this._installing = true;
    this._timer = setTimeout(() => {
      this._installing = false;
      this._timer = null;
      const progress = overlay.querySelector("#y2k-overlay-progress");
      const bar = overlay.querySelector("#y2k-progress");
      const message = overlay.querySelector("#y2k-overlay-message");
      const ok = overlay.querySelector("#y2k-overlay-ok");
      if (progress) progress.hidden = true;
      if (bar) bar.hidden = true;
      if (message) message.hidden = false;
      if (ok) {
        ok.hidden = false;
        ok.addEventListener("click", () => this._removeOverlay());
        ok.focus();
      }
    }, INSTALL_MS);
  }

  _clearInstall(removeOverlay) {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._installing = false;
    if (removeOverlay) this._removeOverlay();
  }

  _removeOverlay() {
    const overlay = document.getElementById("y2k-overlay");
    if (overlay) overlay.remove();
  }
}
