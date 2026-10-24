import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const CMD_WINDOW = '.window[data-app-id="command-prompt"]';
const FOLDER = "/C:/THROWBACK";
const ASSETS = {
  "MEMORY.TXT": readFileSync(
    "src/apps/improving-ct-october/stations/assets/argentina-memory.txt",
  ),
  "ERROR.LOG": readFileSync(
    "src/apps/improving-ct-october/stations/assets/argentina-error.log",
  ),
  "PLANO.TXT": readFileSync(
    "src/apps/improving-ct-october/stations/assets/argentina-plano.txt",
  ),
};
const HELP_ASSET = readFileSync(
  "src/apps/improving-ct-october/stations/assets/argentina-help.txt",
);
const DESKTOP_HELP = "/C:/WINDOWS/Desktop/HELP_PANTALLA.TXT";

async function boot(page) {
  await page.goto("/win98-web/");
  await page.waitForSelector("#boot-screen", { state: "hidden", timeout: 60000 });
}

async function fsExists(page, path) {
  return page.evaluate(async (p) => {
    try {
      await window.fs.promises.stat(p);
      return true;
    } catch {
      return false;
    }
  }, path);
}

async function expectPath(page, path, exists, timeout = 15000) {
  await expect.poll(async () => fsExists(page, path), { timeout }).toBe(exists);
}

async function startTeam(page, { office = "argentina", keyword = "onion" } = {}) {
  await page.locator(".desktop").click({ position: { x: 1100, y: 200 } });
  await page.locator(CT_ICON).dblclick();
  const win = page.locator(CT_WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  await expect(win.locator("#ct-team option").first()).toBeAttached({
    timeout: 10000,
  });
  if (office !== "argentina") await win.locator("#ct-office").selectOption(office);
  await win.locator("#ct-keyword").fill(keyword);
  await win.locator("#ct-start").click();
  await expect(win.locator("#ct-status")).toHaveText("This team is running.", {
    timeout: 10000,
  });
  return win;
}

async function openDos(page) {
  await page.evaluate(() => window.System.launchApp("command-prompt"));
  const win = page.locator(CMD_WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  await win.locator(".xterm-helper-textarea").focus();
  await page.waitForTimeout(400);
  return win;
}

async function type(page, command) {
  await page.keyboard.type(command);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(700);
}

test.describe("CT station: Argentina DOS challenge", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
    await page.evaluate(async () => {
      sessionStorage.clear();
      try {
        for (const name of await window.fs.promises.readdir("/C:/THROWBACK")) {
          await window.fs.promises.unlink(`/C:/THROWBACK/${name}`);
        }
        await window.fs.promises.rmdir("/C:/THROWBACK");
      } catch {}
      try {
        await window.fs.promises.unlink(DESKTOP_HELP);
      } catch {}
      document.dispatchEvent(new CustomEvent("desktop-refresh"));
    });
  });

  test("argentina team gets C:\\THROWBACK with exactly the three exact files", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);

    const entries = await page.evaluate(async () => {
      try {
        return await window.fs.promises.readdir("/C:/THROWBACK");
      } catch {
        return [];
      }
    });
    expect(entries.sort()).toEqual(["ERROR.LOG", "MEMORY.TXT", "PLANO.TXT"]);

    for (const [name, expected] of Object.entries(ASSETS)) {
      const bytes = await page.evaluate(async (p) => {
        const buf = new Uint8Array(await window.fs.promises.readFile(p));
        return Array.from(buf);
      }, `${FOLDER}/${name}`);
      expect(bytes, name).toEqual(Array.from(expected));
    }
  });

  test("a stray file inside the folder is cleared on apply", async ({
    page,
  }) => {
    await page.evaluate(async () => {
      await window.fs.promises.mkdir("/C:/THROWBACK", { recursive: true });
      await window.fs.promises.writeFile("/C:/THROWBACK/OLD.TXT", "viejo");
    });
    await startTeam(page);
    await expectPath(page, `${FOLDER}/MEMORY.TXT`, true);
    await expectPath(page, `${FOLDER}/OLD.TXT`, false);
  });

  test("HELP shows the short help screen and CLS works", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    const win = await openDos(page);
    await type(page, "HELP");
    await expect(win).toContainText("Available commands:", { timeout: 10000 });
    await expect(win).toContainText("Displays this help screen.");
    await expect(win).toContainText(
      "Displays the contents of a text file.",
    );
    await expect(win).toContainText("Clears the screen.");
    await expect(win).not.toContainText("Launches an application");
    await expect(win).not.toContainText("MS-DOS COMMAND REFERENCE");
    await type(page, "CLS");
    await expect(win).not.toContainText("Displays this help screen.");
    const entries = await page.evaluate(async () =>
      window.fs.promises.readdir("/C:/THROWBACK"),
    );
    expect(entries.sort()).toEqual(["ERROR.LOG", "MEMORY.TXT", "PLANO.TXT"]);
  });

  test("a new prompt starts at C:\\ and CD THROWBACK works", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    const win = await openDos(page);
    await expect(win).toContainText("C:\\>", { timeout: 10000 });
    await type(page, "CD THROWBACK");
    await expect(win).toContainText("C:\\THROWBACK>", { timeout: 10000 });
    await type(page, "TYPE MEMORY.TXT");
    await expect(win).toContainText("EL TITULO QUE NUNCA FUE", {
      timeout: 10000,
    });
    await type(page, "TYPE ERROR.LOG");
    await expect(win).toContainText("ERROR 1999", { timeout: 10000 });
    await type(page, "TYPE PLANO.TXT");
    await expect(win.locator(".xterm")).toContainText("█", { timeout: 10000 });
  });

  test("HELP_PANTALLA.TXT sits on the desktop byte-exact and opens in Notepad", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, DESKTOP_HELP, true);
    await expectPath(page, `${FOLDER}/HELP_PANTALLA.TXT`, false);
    const bytes = await page.evaluate(async (p) => {
      const buf = new Uint8Array(await window.fs.promises.readFile(p));
      return Array.from(buf);
    }, DESKTOP_HELP);
    expect(bytes).toEqual(Array.from(HELP_ASSET));

    await expect(
      page.locator('.desktop .explorer-icon[data-name="HELP_PANTALLA.TXT"]'),
    ).toBeVisible({ timeout: 15000 });

    await page.evaluate((p) =>
      window.System.launchApp("notepad", { filePath: p }),
    DESKTOP_HELP);
    const win = page.locator('.window[data-app-id="notepad"]');
    await expect(win).toBeVisible({ timeout: 15000 });
    await expect(win).toContainText("MS-DOS COMMAND REFERENCE", {
      timeout: 10000,
    });
    await expect(win).toContainText("EXAMPLES");
  });

  test("finish removes the folder, the desktop file and restores HELP and start dir", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    await expectPath(page, DESKTOP_HELP, true);
    state.sessions[1].finishedAt = new Date().toISOString();
    await expectPath(page, FOLDER, false);
    await expectPath(page, DESKTOP_HELP, false);
    const win = await openDos(page);
    await expect(win).toContainText("C:\\WINDOWS>", { timeout: 10000 });
    await type(page, "HELP");
    await expect(win).toContainText("Available commands:", { timeout: 10000 });
    await expect(win).toContainText("Launches an application");
  });

  test("admin restart removes the folder", async ({ page }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    state.sessions[1] = { startedAt: null, finishedAt: null };
    await expectPath(page, FOLDER, false);
  });

  test("chile team gets its own folder and the C:\\ start dir", async ({
    page,
  }) => {
    await startTeam(page, { office: "chile", keyword: "river" });
    await expectPath(page, `${FOLDER}/PLANO.TXT`, true);
    expect(await fsExists(page, `${FOLDER}/MEMORY.TXT`)).toBe(true);
    expect(await fsExists(page, DESKTOP_HELP)).toBe(false);
    const win = await openDos(page);
    await expect(win).toContainText("C:\\>", { timeout: 10000 });
    await type(page, "HELP");
    await expect(win).toContainText("Muestra los archivos disponibles.", {
      timeout: 10000,
    });
    await expect(win).not.toContainText("MS-DOS COMMAND REFERENCE");
  });

  test("no session means no folder and a C:\\WINDOWS prompt", async ({
    page,
  }) => {
    const win = await openDos(page);
    await expect(win).toContainText("C:\\WINDOWS>", { timeout: 10000 });
    expect(await fsExists(page, FOLDER)).toBe(false);
    expect(await fsExists(page, DESKTOP_HELP)).toBe(false);
  });

  test("reload keeps the folder and the help", async ({ page }) => {
    test.setTimeout(120000);
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    await page.reload();
    await page.waitForSelector("#boot-screen", {
      state: "hidden",
      timeout: 60000,
    });
    await expectPath(page, FOLDER, true);
    const win = await openDos(page);
    await type(page, "HELP");
    await expect(win).toContainText("Displays this help screen.", {
      timeout: 10000,
    });
  });
});
