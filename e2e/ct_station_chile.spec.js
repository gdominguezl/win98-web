import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const CMD_WINDOW = '.window[data-app-id="command-prompt"]';
const FOLDER = "/C:/THROWBACK";
const PLANO_ASSET = readFileSync(
  "src/apps/improving-ct-october/stations/assets/plano.txt",
);

const HELP_LINES = [
  "DIR             Muestra los archivos disponibles.",
  "TYPE ARCHIVO    Abre un archivo de texto.",
  "CD CARPETA      Ingresa a una carpeta.",
];

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

async function readFile(page, path) {
  return page.evaluate(async (p) => {
    try {
      return await window.fs.promises.readFile(p, "utf8");
    } catch {
      return null;
    }
  }, path);
}

async function startTeam(page, { office = "chile", keyword = "river" } = {}) {
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
  await page.click('button:has-text("Start")');
  await page.click("text=Programs");
  await page.click("text=MS-DOS Prompt");
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

test.describe("CT station: Chile throwback folder", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
    await page.evaluate(async () => {
      sessionStorage.clear();
      try {
        const entries = await window.fs.promises.readdir("/C:/THROWBACK");
        for (const name of entries) {
          await window.fs.promises.unlink(`/C:/THROWBACK/${name}`);
        }
        await window.fs.promises.rmdir("/C:/THROWBACK");
      } catch {}
    });
  });

  test("chile team gets C:\\THROWBACK with the three exact files", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    await expectPath(page, `${FOLDER}/PLANO.TXT`, true);
    await expectPath(page, `${FOLDER}/MEMORY.TXT`, true);
    await expectPath(page, `${FOLDER}/ERROR.LOG`, true);

    const plano = await page.evaluate(async (p) => {
      const buf = new Uint8Array(await window.fs.promises.readFile(p));
      return Array.from(buf);
    }, `${FOLDER}/PLANO.TXT`);
    expect(plano).toEqual(Array.from(PLANO_ASSET));

    expect(await readFile(page, `${FOLDER}/MEMORY.TXT`)).toBe(
      "MEMORY BANK UNAVAILABLE.\nACCESS RESERVED FOR FINAL DIAGNOSTIC.",
    );
    expect(await readFile(page, `${FOLDER}/ERROR.LOG`)).toBe(
      "23:51 — CLOCK DESYNCHRONIZED\n23:54 — AUDIO MEMORY RECOVERED\n23:57 — LOCATION MAP CORRUPTED\n23:59 — AGE CALCULATION FAILED",
    );
  });

  test("HELP shows the Spanish lines first then the short block", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    const win = await openDos(page);
    await type(page, "HELP");
    for (const line of HELP_LINES) {
      await expect(win).toContainText(line, { timeout: 10000 });
    }
    await expect(win).toContainText("CLS             Limpia la pantalla.");
    await expect(win).toContainText("HELP            Muestra esta ayuda.");
    await expect(win).toContainText("EXIT            Cierra esta ventana.");
    await expect(win).not.toContainText("Available commands:");
    await expect(win).not.toContainText("Launches an application");
  });

  test("DIR, CD and TYPE work in any letter case", async ({ page }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    const win = await openDos(page);

    await type(page, "DIR \\THROWBACK");
    await expect(win).toContainText("PLANO.TXT", { timeout: 10000 });
    await expect(win).toContainText("MEMORY.TXT");
    await expect(win).toContainText("ERROR.LOG");

    await type(page, "CD \\THROWBACK");
    await expect(win).toContainText("C:\\THROWBACK>", { timeout: 10000 });

    await type(page, "type plano.txt");
    await expect(win.locator(".xterm")).toContainText("█", { timeout: 10000 });

    await type(page, "TYPE memory.txt");
    await expect(win).toContainText("MEMORY BANK UNAVAILABLE.", {
      timeout: 10000,
    });

    await type(page, "TYPE ERROR.LOG");
    await expect(win).toContainText("23:51 — CLOCK DESYNCHRONIZED", {
      timeout: 10000,
    });

    await type(page, "CD \\");
    await type(page, "cd throwback");
    await expect(win).toContainText("C:\\THROWBACK>", { timeout: 10000 });
  });

  test("finish removes the folder, restores HELP and breaks CD", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    const win = await openDos(page);

    state.sessions[3].finishedAt = new Date().toISOString();
    await expectPath(page, FOLDER, false);

    await type(page, "HELP");
    await expect(win).toContainText("Available commands:", { timeout: 10000 });
    await type(page, "CD \\THROWBACK");
    await expect(win).toContainText("Directory not found", { timeout: 10000 });
  });

  test("admin restart removes the folder", async ({ page }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    state.sessions[3] = { startedAt: null, finishedAt: null };
    await expectPath(page, FOLDER, false);
  });

  test("argentina team and no session get no folder and default HELP", async ({
    page,
  }) => {
    await startTeam(page, { office: "argentina", keyword: "onion" });
    await page.waitForTimeout(2500);
    expect(await fsExists(page, FOLDER)).toBe(false);
    const win = await openDos(page);
    await type(page, "HELP");
    await expect(win).toContainText("Available commands:", { timeout: 10000 });
    await expect(win).not.toContainText(HELP_LINES[0]);
  });

  test("a file the team created inside the folder disappears with it", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, FOLDER, true);
    await page.evaluate(async () => {
      await window.fs.promises.writeFile("/C:/THROWBACK/NOTA.TXT", "mio");
    });
    state.sessions[3].finishedAt = new Date().toISOString();
    await expectPath(page, FOLDER, false);
    await expectPath(page, `${FOLDER}/NOTA.TXT`, false);
  });

  test("reload keeps the folder once and HELP stays simple", async ({
    page,
  }) => {
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
    await expect(win).toContainText(HELP_LINES[0], { timeout: 10000 });
    await expect(win).not.toContainText("Available commands:");
  });

  test("exact-name commands behave as before with no session", async ({
    page,
  }) => {
    const win = await openDos(page);
    await type(page, "CD \\");
    await type(page, "DIR");
    await expect(win).toContainText("WINDOWS", { timeout: 10000 });
    await type(page, "HELP");
    await expect(win).toContainText("Available commands:", { timeout: 10000 });
  });
});
