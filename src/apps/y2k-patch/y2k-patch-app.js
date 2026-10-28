import { Application } from "../../system/application.js";
import { ICONS } from "../../config/icons.js";
import { finishPatch, getRole, getSession, getToken } from "../improving-ct-october/api.js";
import { refreshCtTimer } from "../improving-ct-october/timer.js";
import globeUrl from "./assets/globe.svg?url";
import fireworksUrl from "./assets/fireworks.svg?url";
import "./y2k-patch.css";

const APPLIED_KEY = "y2k-patch-applied";
const INSTALL_MS = 2000;
const SUCCESS_WIDTH = 640;
const SUCCESS_HEIGHT = 520;

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

const SUCCESS_HTML = `
  <div class="y2k-patch y2k-success" id="y2k-installed">
    <div class="y2k-success-header">
      <img class="y2k-globe" src="${globeUrl}" alt="">
      <div class="y2k-success-headline">
        <h1>Installation complete</h1>
        <p>Code accepted.</p>
        <p>Critical failure avoided.</p>
        <p>System date stabilized.</p>
        <p>All operations restored.</p>
      </div>
    </div>
    <div class="y2k-success-panel">
      <ul class="y2k-checklist">
        <li><span class="y2k-check">✓</span>Millennium crisis avoided</li>
        <li><span class="y2k-check">✓</span>System files patched</li>
        <li><span class="y2k-check">✓</span>Network functions restored</li>
        <li><span class="y2k-check">✓</span>Global systems online</li>
      </ul>
      <div class="y2k-scene">
        <p class="y2k-scene-date">31/12/1999 - 23:59</p>
        <img class="y2k-fireworks" src="${fireworksUrl}" alt="">
      </div>
    </div>
    <div class="y2k-success-progress">
      <div class="progress-indicator segmented"><span class="progress-indicator-bar" style="width:100%"></span></div>
      <span class="y2k-pct">100%</span>
    </div>
    <div class="y2k-banner"><span class="y2k-spark">✦</span><span class="y2k-banner-text">WELCOME TO 2000</span><span class="y2k-spark">✦</span></div>
    <div class="y2k-finish-row">
      <button type="button" id="y2k-finish">Finish</button>
    </div>
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

  _successSize() {
    const area = document.getElementById("desktop-area")?.getBoundingClientRect();
    return {
      outerWidth: area ? Math.min(SUCCESS_WIDTH, Math.max(320, area.width - 32)) : SUCCESS_WIDTH,
      outerHeight: area ? Math.min(SUCCESS_HEIGHT, Math.max(300, area.height - 32)) : SUCCESS_HEIGHT,
    };
  }

  _createWindow() {
    const applied = isApplied();
    const size = applied ? this._successSize() : { outerWidth: this.width, outerHeight: this.height };
    const win = new $Window({
      title: this.title,
      outerWidth: size.outerWidth,
      outerHeight: size.outerHeight,
      resizable: false,
      icons: this.icon,
    });
    win.$content.html(applied ? SUCCESS_HTML : FORM_HTML);
    if (applied) win.$content[0].querySelector("#y2k-finish")?.addEventListener("click", () => win.close());
    return win;
  }

  _fitIntoDesktop() {
    const area = document.getElementById("desktop-area")?.getBoundingClientRect();
    if (!area) return;
    const box = this.win[0].getBoundingClientRect();
    let left = box.left, top = box.top;
    if (box.right > area.right) left = Math.max(area.left, left - (box.right - area.right));
    if (box.bottom > area.bottom) top = Math.max(area.top, top - (box.bottom - area.bottom));
    if (left !== box.left || top !== box.top) this.win.css({ left, top });
  }

  _onLaunch() {
    if (isApplied()) {
      this._fitIntoDesktop();
      return;
    }

    const root = this.win.$content[0];
    const form = root.querySelector("#y2k-form");
    const field = root.querySelector("#y2k-code");
    const status = root.querySelector("#y2k-status");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      this._submit(field, status);
    });

    field.focus();
  }

  _onClose() {
    if (this._installing) this._clearInstall(true);
  }

  _setStatus(status, message) {
    status.hidden = false;
    status.textContent = message;
  }

  async _submit(field, status) {
    if (getRole() !== "team" || !getToken()) {
      this._setStatus(status, "Start a session in Improving CT October first.");
      return;
    }
    const current = await getSession();
    if (current.status === 401) {
      this._setStatus(status, "Start a session in Improving CT October first.");
      return;
    }
    if (current.body?.session?.status === "finished") {
      this._markInstalled();
      return;
    }
    const result = await finishPatch(field.value);
    if (result.status === 200) {
      this._apply();
      refreshCtTimer();
      return;
    }
    if (result.status === 409 && result.body?.error === "team_reset") {
      this._setStatus(
        status,
        "Sorry, your team has been reset. Please contact the admin or start a new session."
      );
      return;
    }
    this._setStatus(status, "The code was not accepted.");
    field.focus();
    field.select();
  }

  _showSuccess() {
    this.win.$content.html(SUCCESS_HTML);
    this.win.setDimensions(this._successSize());
    this.win.center();
    this._fitIntoDesktop();
    this.win.$content[0].querySelector("#y2k-finish")?.addEventListener("click", () => this.win.close());
  }

  _markInstalled() {
    sessionStorage.setItem(APPLIED_KEY, "1");
    this._showSuccess();
  }

  _apply() {
    sessionStorage.setItem(APPLIED_KEY, "1");
    this._showSuccess();
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
      </div>
    `;
    screen.appendChild(overlay);
    this._installing = true;
    this._timer = setTimeout(() => {
      this._installing = false;
      this._timer = null;
      overlay.remove();
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
