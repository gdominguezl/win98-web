import { test, expect } from "@playwright/test";
import { freshCtState, installCt } from "./ct-mock.js";

const ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const WINDOW = '.window[data-app-id="improving-ct-october"]';

async function boot(page) {
  await page.goto("/win98-web/");
  await page.waitForSelector("#boot-screen", { state: "hidden", timeout: 60000 });
}

async function openCt(page) {
  await page.locator(ICON).dblclick();
  const win = page.locator(WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  await expect(win.locator("#ct-team option").first()).toBeAttached({ timeout: 10000 });
  return win;
}

async function adminLogin(win, office = "argentina") {
  await win.locator("#ct-mode-admin").click();
  await win.locator("#ct-admin-office").selectOption(office);
  await win.locator("#ct-password").fill(office === "chile" ? "chile-secret" : "office-secret");
  await win.locator("#ct-admin-enter").click();
  await expect(win.locator("#ct-admin")).toBeVisible();
}

test.describe("Improving CT October", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
  });

  test("is on the desktop and under Start > Programs", async ({ page }) => {
    await expect(page.locator(ICON)).toBeVisible();
    await page.click('button:has-text("Start")');
    const programs = page.locator('.start-menu-item:has-text("Programs")');
    await expect(programs).toBeVisible({ timeout: 10000 });
    await programs.dispatchEvent("pointerenter");
    await expect(page.locator('.menu-item:has-text("Improving CT October")')).toBeVisible({
      timeout: 10000,
    });
  });

  test("opens one window", async ({ page }) => {
    const win = await openCt(page);
    await expect(win.locator(".window-title")).toHaveText("Improving CT October");
    await page.locator(".desktop").click({ position: { x: 1100, y: 200 } });
    await page.locator(ICON).dblclick();
    await page.waitForTimeout(500);
    await expect(page.locator(WINDOW)).toHaveCount(1);
  });

  test("starts a team and keeps the countdown after the window closes", async ({ page }) => {
    const win = await openCt(page);
    const field = win.locator("#ct-keyword");
    await field.fill("nope");
    await win.locator("#ct-start").click();
    await expect(win.locator("#ct-error")).toBeVisible();
    await expect(page.locator("#ct-timer")).toHaveCount(0);
    await expect(field).toBeEnabled();
    await expect(field).toHaveValue("nope");

    await field.fill("onion");
    await win.locator("#ct-start").click();
    await expect(win.locator("#ct-status")).toHaveText("This team is running.");
    await expect(page.locator("#ct-timer")).toBeVisible();
    await expect(page.locator("#ct-timer-over")).toBeHidden();

    await win.locator(".window-close-button, .window-action-close").click();
    await expect(win).toHaveCount(0);
    await expect(page.locator("#ct-timer")).toBeVisible();
  });

  test("resumes the original start and shows Game over after 60 minutes", async ({ page }) => {
    state.sessions[1] = {
      startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      finishedAt: null,
    };
    await openCt(page);
    const win = page.locator(WINDOW);
    await win.locator("#ct-keyword").fill("onion");
    await win.locator("#ct-start").click();
    await expect(page.locator("#ct-timer-time")).toHaveText(/^(50:00|49:5\d)$/);

    state.sessions[1].startedAt = new Date(Date.now() - 61 * 60 * 1000).toISOString();
    await expect(page.locator("#ct-timer-time")).toHaveText("00:00", { timeout: 8000 });
    await expect(page.locator("#ct-timer-over")).toHaveText("Game over");
  });

  test("freezes the clock when the server finishes the session", async ({ page }) => {
    const win = await openCt(page);
    await win.locator("#ct-keyword").fill("onion");
    await win.locator("#ct-start").click();
    await expect(page.locator("#ct-timer")).toHaveAttribute("data-status", "running");
    state.sessions[1].finishedAt = new Date().toISOString();
    await expect(win.locator("#ct-status")).toHaveText("This team has completed the challenge on time.", {
      timeout: 8000,
    });
    await expect(page.locator("#ct-timer-finale")).toHaveText("Challenge complete.");
    await expect(win.locator("#ct-new-game-button")).toBeVisible();
    await win.locator("#ct-mode-admin").click();
    await expect(win.locator("#ct-new-game-button")).toBeHidden();
    await win.locator("#ct-mode-team").click();
    await expect(win.locator("#ct-new-game-button")).toBeVisible();
    await win.locator("#ct-new-game-button").click();
    await expect(win.locator("#ct-keyword")).toBeVisible();
    await expect(win.locator("#ct-status")).toBeHidden();
    await expect(win.locator("#ct-new-game-button")).toBeHidden();
    await expect(page.locator("#ct-timer")).toHaveCount(0, { timeout: 4000 });
  });

  test("a new tab has no countdown until that tab starts", async ({ page }) => {
    test.setTimeout(120000);
    const win = await openCt(page);
    await win.locator("#ct-keyword").fill("onion");
    await win.locator("#ct-start").click();
    await expect(page.locator("#ct-timer")).toBeVisible();

    const page2 = await page.context().newPage();
    await installCt(page2, state);
    await boot(page2);
    await expect(page2.locator("#ct-timer")).toHaveCount(0);
    await openCt(page2);
    await page2.locator(`${WINDOW} #ct-keyword`).fill("onion");
    await page2.locator(`${WINDOW} #ct-start`).click();
    await expect(page2.locator("#ct-timer")).toBeVisible();
    await page2.close();
  });

  test("an admin refreshes the board, edits teams, and resets", async ({ page }) => {
    test.setTimeout(90000);
    const now = Date.now();
    state.teams.push({ id: 4, office: "argentina", name: "Team 4", keyword: "marble" });
    state.sessions[1] = { startedAt: new Date(now - 5 * 60 * 1000).toISOString(), finishedAt: null };
    state.sessions[2] = {
      startedAt: new Date(now - 10 * 60 * 1000).toISOString(),
      finishedAt: new Date(now).toISOString(),
    };
    state.sessions[4] = {
      startedAt: new Date(now - 30 * 60 * 1000).toISOString(),
      finishedAt: new Date(now).toISOString(),
    };

    const win = await openCt(page);
    await win.locator("#ct-mode-admin").click();
    await win.locator("#ct-password").fill("chile-secret");
    await win.locator("#ct-admin-enter").click();
    await expect(win.locator("#ct-admin")).toBeHidden();
    await expect(win.locator("#ct-error")).toBeVisible();

    await win.locator("#ct-password").fill("office-secret");
    await win.locator("#ct-admin-enter").click();
    await expect(win.locator("#ct-teams")).toBeVisible();
    await expect(win.locator("#ct-board")).toContainText(/Team 1 — Running — \d+:\d{2}/);
    await expect(win.locator("#ct-board")).toContainText(/Team 2 — Finished — \d+:\d{2}/);
    await expect(win.locator("#ct-podium li").nth(0)).toHaveText("1. Team 2");
    await expect(win.locator("#ct-podium li").nth(1)).toHaveText("2. Team 4");

    await win.locator("#ct-new-name").fill("Team Extra");
    await win.locator("#ct-new-keyword").fill("badge");
    await win.locator("#ct-create").click();
    const created = win.locator("#ct-teams .ct-row").last();
    await expect(created.locator(".ct-name")).toHaveValue("Team Extra");
    await created.locator(".ct-name").fill("Team Nine");
    await created.locator(".ct-team-keyword").fill("badge-2");
    await created.locator(".ct-save").click();
    await expect(win.locator("#ct-teams .ct-name").last()).toHaveValue("Team Nine", { timeout: 10000 });
    await win.locator("#ct-teams .ct-row").last().locator(".ct-delete").click();
    await win.locator("#ct-refresh").click();
    await expect(win.locator("#ct-board")).not.toContainText("Team Nine");
    await expect(win.locator("#ct-teams .ct-name").first()).toHaveValue("Team 1");

    let dialogPromise = page.waitForEvent("dialog");
    const restartClick = win.locator('#ct-board li:has-text("Team 2") .ct-restart').click();
    let dialog = await dialogPromise;
    expect(dialog.message()).toContain("Restart Team 2");
    await dialog.accept();
    await restartClick;
    await expect(win.locator("#ct-board")).toContainText("Team 2 — Not started");
    await expect(win.locator("#ct-board")).toContainText(/Team 1 — Running/);

    dialogPromise = page.waitForEvent("dialog");
    await win.locator("#ct-reset").click();
    dialog = await dialogPromise;
    const warning = dialog.message();
    await dialog.dismiss();
    expect(warning).toContain("still playing");
    expect(state.resetCalls).toBe(0);

    dialogPromise = page.waitForEvent("dialog");
    await win.locator("#ct-reset").click();
    dialog = await dialogPromise;
    await dialog.accept();
    await expect(win.locator("#ct-board")).toContainText("Team 1 — Not started");
    await expect(win.locator("#ct-teams .ct-name").first()).toHaveValue("Team 1");
    expect(state.resetCalls).toBe(1);

    dialogPromise = page.waitForEvent("dialog");
    await win.locator("#ct-reset").click();
    dialog = await dialogPromise;
    expect(dialog.message()).toContain("Team names will stay");
    await dialog.accept();
  });

  test("an admin sees the office patch code with the default notice", async ({ page }) => {
    const win = await openCt(page);
    await adminLogin(win);
    await expect(win.locator("#ct-patch-code")).toHaveValue("Y2KPATCH99");
    await expect(win.locator("#ct-patch-code-note")).toContainText("still using the default code");
  });

  test("the offices keep separate patch codes", async ({ page }) => {
    const win = await openCt(page);
    await adminLogin(win, "chile");
    const field = win.locator("#ct-patch-code");
    await expect(field).toHaveValue("Y2KPATCH99");
    await field.fill("CHILE-OWN-9");
    await win.locator("#ct-patch-code-save").click();
    await expect(win.locator("#ct-patch-code-note")).toContainText("Code saved.");
    expect(state.patchCodes.chile.code).toBe("CHILE-OWN-9");
    expect(state.patchCodes.argentina.code).toBe("Y2KPATCH99");

    await adminLogin(win, "argentina");
    await expect(win.locator("#ct-patch-code")).toHaveValue("Y2KPATCH99");
    await expect(win.locator("#ct-patch-code-note")).toContainText("still using the default code");
  });

  test("saving a valid code retires the default in Y2K Patch", async ({ page }) => {
    test.setTimeout(90000);
    state.sessions[1] = { startedAt: new Date().toISOString(), finishedAt: null };
    const win = await openCt(page);
    await adminLogin(win);
    await win.locator("#ct-patch-code").fill("ARG-NEW-1");
    const dialogPromise = page.waitForEvent("dialog");
    await win.locator("#ct-patch-code-save").click();
    await (await dialogPromise).accept();
    await expect(win.locator("#ct-patch-code-note")).toHaveText(
      "Code saved. It applies to the next code teams enter.",
    );
    await win.locator(".window-close-button, .window-action-close").click();

    await page.evaluate(() => {
      sessionStorage.setItem("ct-october-token", "team-token");
      sessionStorage.setItem("ct-october-role", "team");
    });
    await page.locator('.desktop .explorer-icon[data-name="Y2K Patch.lnk.json"]').dblclick();
    const patch = page.locator('.window[data-app-id="y2k-patch"]');
    await expect(patch).toBeVisible({ timeout: 15000 });

    await patch.locator("#y2k-code").fill("Y2KPATCH99");
    await patch.locator("#y2k-ok").click();
    await expect(patch.locator("#y2k-status")).toBeVisible();
    await expect(page.locator("#y2k-overlay")).toHaveCount(0);

    await patch.locator("#y2k-code").fill("arg new-1");
    await patch.locator("#y2k-ok").click();
    await expect(page.locator("#y2k-overlay")).toHaveCount(0, { timeout: 10000 });
    await expect(patch.locator("#y2k-installed")).toContainText("Installation complete");
  });

  test("each validation message is shown and the code is not changed", async ({ page }) => {
    const win = await openCt(page);
    await adminLogin(win);
    const field = win.locator("#ct-patch-code");
    const note = win.locator("#ct-patch-code-note");
    await expect(field).toHaveValue("Y2KPATCH99");
    for (const [code, message] of [
      ["", "Enter a code"],
      ["abc", "Use 4 to 32 letters or numbers"],
      ["a".repeat(33), "Use 4 to 32 letters or numbers"],
      ["bad!code", "Use only letters, numbers, spaces and dashes"],
      ["Y2KPATCH99", "Choose a code different from the default"],
    ]) {
      await field.fill(code);
      await win.locator("#ct-patch-code-save").click();
      await expect(note).toHaveText(message);
      expect(state.patchCodes.argentina.code).toBe("Y2KPATCH99");
      expect(state.patchCodes.argentina.isDefault).toBe(true);
    }
  });

  test("Enter in the field saves the code", async ({ page }) => {
    const win = await openCt(page);
    await adminLogin(win);
    const field = win.locator("#ct-patch-code");
    await expect(field).toHaveValue("Y2KPATCH99");
    await field.fill("ENTER-SAVE-4");
    await field.press("Enter");
    await expect(win.locator("#ct-patch-code-note")).toContainText("Code saved.");
    expect(state.patchCodes.argentina.code).toBe("ENTER-SAVE-4");
  });

  test("a running team asks for confirmation before the code changes", async ({ page }) => {
    state.sessions[1] = { startedAt: new Date().toISOString(), finishedAt: null };
    const win = await openCt(page);
    await adminLogin(win);
    const field = win.locator("#ct-patch-code");
    await expect(field).toHaveValue("Y2KPATCH99");
    await field.fill("RUN-OK-77");

    let dialogPromise = page.waitForEvent("dialog");
    await win.locator("#ct-patch-code-save").click();
    let dialog = await dialogPromise;
    expect(dialog.message()).toContain("still playing");
    await dialog.dismiss();
    expect(state.patchPutCalls).toBe(0);
    expect(state.patchCodes.argentina.code).toBe("Y2KPATCH99");

    dialogPromise = page.waitForEvent("dialog");
    await win.locator("#ct-patch-code-save").click();
    dialog = await dialogPromise;
    await dialog.accept();
    await expect(win.locator("#ct-patch-code-note")).toContainText("Code saved.");
    expect(state.patchPutCalls).toBe(1);
    expect(state.patchCodes.argentina.code).toBe("RUN-OK-77");
  });

  test("an expired session returns to the admin login", async ({ page }) => {
    const win = await openCt(page);
    await adminLogin(win);
    await expect(win.locator("#ct-patch-code")).toHaveValue("Y2KPATCH99");
    await page.evaluate(() => {
      sessionStorage.removeItem("ct-october-token");
      sessionStorage.removeItem("ct-october-role");
    });
    await win.locator("#ct-patch-code").fill("NEVER-SAVED");
    await win.locator("#ct-patch-code-save").click();
    await expect(win.locator("#ct-admin-login")).toBeVisible();
    await expect(win.locator("#ct-error")).toHaveText(
      "Your admin session expired. Sign in again.",
    );
    expect(state.patchPutCalls).toBe(0);
  });

  test("a load failure shows a note and keeps Save disabled", async ({ page }) => {
    await page.route("**/ct/admin/patch-code", (route) =>
      route.fulfill({ status: 500, contentType: "application/json", body: "{}" }),
    );
    const win = await openCt(page);
    await adminLogin(win);
    await expect(win.locator("#ct-patch-code-note")).toHaveText(
      "The patch code could not be loaded.",
    );
    await expect(win.locator("#ct-patch-code-save")).toBeDisabled();
    await expect(win.locator("#ct-teams")).toBeVisible();
  });

  test("refreshing the board keeps a typed code", async ({ page }) => {
    const win = await openCt(page);
    await adminLogin(win);
    const field = win.locator("#ct-patch-code");
    await expect(field).toHaveValue("Y2KPATCH99");
    await field.fill("TYPED-IN-6");
    await win.locator("#ct-refresh").click();
    await expect(field).toHaveValue("TYPED-IN-6");
  });

  test("restores the icon on a returning desktop", async ({ page }) => {
    test.setTimeout(120000);
    await page.evaluate(async () => {
      try {
        await window.fs.promises.unlink("/C:/WINDOWS/Desktop/Improving CT October.lnk.json");
      } catch {
        // already absent
      }
    });
    await page.reload();
    await page.waitForSelector("#boot-screen", { state: "hidden", timeout: 60000 });
    await expect(page.locator(ICON)).toBeVisible();
  });
});
