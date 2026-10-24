import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const CMD_WINDOW = '.window[data-app-id="command-prompt"]';
const ARG_FILE = "/C:/WINDOWS/Desktop/Communication System.txt";
const CHILE_FILE = "/C:/My Documents/MORSE.TXT";
const SIGNALS_ASSET = readFileSync(
  "src/apps/improving-ct-october/stations/assets/argentina-signals.txt",
);

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

function decodeTransmissions(text) {
  const table = {};
  const transmissions = {};
  let current = null;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const letter = line.match(/^([A-ZÑ])\s+([.-]+)$/);
    if (letter) {
      table[letter[2]] = letter[1];
      continue;
    }
    const header = line.match(/^TRANSMISI[OÓ]N\s+(\d+)$/);
    if (header) {
      current = header[1];
      transmissions[current] = [];
      continue;
    }
    if (current && /^[.\-/\s]+$/.test(line)) {
      const letters = line
        .split(/\s+/)
        .filter(Boolean)
        .map((code) => table[code] ?? "?");
      transmissions[current].push(letters.join(""));
    }
  }
  return Object.fromEntries(
    Object.entries(transmissions).map(([k, v]) => [k, v.join(" ")]),
  );
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

test.describe("CT stations: Morse clues", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
    await page.evaluate(async () => {
      sessionStorage.clear();
      for (const p of [
        "/C:/WINDOWS/Desktop/Communication System.txt",
        "/C:/My Documents/MORSE.TXT",
      ]) {
        try {
          await window.fs.promises.unlink(p);
        } catch {}
      }
      document.dispatchEvent(new CustomEvent("desktop-refresh"));
    });
  });

  test("argentina gets the desktop file, byte-exact, opening in Notepad", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, ARG_FILE, true);

    const bytes = await page.evaluate(async (p) => {
      const buf = new Uint8Array(await window.fs.promises.readFile(p));
      return Array.from(buf);
    }, ARG_FILE);
    expect(bytes).toEqual(Array.from(SIGNALS_ASSET));

    const icon = page.locator(
      '.desktop .explorer-icon[data-name="Communication System.txt"]',
    );
    await expect(icon).toBeVisible({ timeout: 15000 });
    await page.locator(".desktop").click({ position: { x: 1100, y: 200 } });
    await icon.dblclick();
    const notepad = page.locator('.window[data-app-id="notepad"]');
    await expect(notepad).toBeVisible({ timeout: 15000 });
    await expect(notepad).toContainText("SIGNALS.TXT - MORSE REFERENCE", {
      timeout: 10000,
    });
    await expect(notepad).toContainText("NUMEROS");
  });

  test("chile gets MORSE.TXT that decodes the three transmissions", async ({
    page,
  }) => {
    await startTeam(page, { office: "chile", keyword: "river" });
    await expectPath(page, CHILE_FILE, true);

    const text = await readFile(page, CHILE_FILE);
    expect(text).toContain("A .-");
    expect(text).toContain("Z --..");

    const decoded = decodeTransmissions(text);
    expect(decoded["01"]).toBe("COCINA");
    expect(decoded["02"]).toBe("TELEVISOR");
    expect(decoded["03"]).toBe("ENTRADA");

    const throwback = await page.evaluate(async () =>
      window.fs.promises.readdir("/C:/THROWBACK"),
    );
    expect(throwback.sort()).toEqual(["ERROR.LOG", "MEMORY.TXT", "PLANO.TXT"]);
    expect(await fsExists(page, ARG_FILE)).toBe(false);
  });

  test("argentina does not get MORSE.TXT and the desktop file is removed on finish", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, ARG_FILE, true);
    expect(await fsExists(page, CHILE_FILE)).toBe(false);

    state.sessions[1].finishedAt = new Date().toISOString();
    await expectPath(page, ARG_FILE, false);
    const icon = page.locator(
      '.desktop .explorer-icon[data-name="Communication System.txt"]',
    );
    await expect(icon).toHaveCount(0, { timeout: 15000 });
  });

  test("admin restart removes the files", async ({ page }) => {
    await startTeam(page, { office: "chile", keyword: "river" });
    await expectPath(page, CHILE_FILE, true);
    state.sessions[3] = { startedAt: null, finishedAt: null };
    await expectPath(page, CHILE_FILE, false);
    await expectPath(page, "/C:/THROWBACK", false);
  });

  test("no session means no clue files", async ({ page }) => {
    await page.waitForTimeout(2500);
    expect(await fsExists(page, ARG_FILE)).toBe(false);
    expect(await fsExists(page, CHILE_FILE)).toBe(false);
  });

  test("reload keeps the files and the desktop icon", async ({ page }) => {
    test.setTimeout(120000);
    await startTeam(page);
    await expectPath(page, ARG_FILE, true);
    await page.reload();
    await page.waitForSelector("#boot-screen", {
      state: "hidden",
      timeout: 60000,
    });
    await expectPath(page, ARG_FILE, true);
    await expect(
      page.locator(
        '.desktop .explorer-icon[data-name="Communication System.txt"]',
      ),
    ).toBeVisible({ timeout: 15000 });
  });
});
