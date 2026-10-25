import { test, expect } from "@playwright/test";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const PAINT_WINDOW = '.window[data-app-id="paint"]';
const PUERTA = "/C:/My Documents/PUERTA.BMP";

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

async function openInPaint(page) {
  await page.evaluate((p) => window.System.launchApp("paint", { filePath: p }), PUERTA);
  const win = page.locator(PAINT_WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1500);
  return win;
}

async function canvasStats(page) {
  return page.evaluate((sel) => {
    const c = document.querySelector(`${sel} canvas.main-canvas`);
    const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    let min = 255, nearWhite = 0, dark = 0;
    for (let i = 0; i < d.length; i += 4) {
      const v = Math.min(d[i], d[i + 1], d[i + 2]);
      if (v < min) min = v;
      if (v >= 252 && v < 255) nearWhite++;
      if (v < 50) dark++;
    }
    return { w: c.width, h: c.height, min, nearWhite, dark };
  }, PAINT_WINDOW);
}

async function floodFillBackground(page) {
  const win = page.locator(PAINT_WINDOW);
  await win.locator('.tool[title*="Fill"], .tool[aria-label*="Fill"]').first().click();
  const pt = await page.evaluate((sel) => {
    const c = document.querySelector(`${sel} canvas.main-canvas`);
    const r = c.getBoundingClientRect();
    return { x: r.left + 10, y: r.top + 230 };
  }, PAINT_WINDOW);
  await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(800);
}

async function startTeamViaApp(page, office, keyword) {
  await page.evaluate(() =>
    window.System.launchApp("improving-ct-october"),
  );
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

async function openFileDialog(page) {
  const win = page.locator(PAINT_WINDOW);
  await win.locator(".menu-button", { hasText: "File" }).first().click();
  await page
    .locator(".menu-popup .menu-item", { hasText: "Open" })
    .first()
    .click();
  const picker = page.locator(".file-picker");
  await expect(picker).toBeVisible({ timeout: 10000 });
  return picker;
}

async function closeFileDialog(page) {
  await page
    .locator(".file-picker button", { hasText: "Cancel" })
    .first()
    .click();
  await expect(page.locator(".file-picker")).toHaveCount(0, { timeout: 10000 });
}

test.describe("CT stations: Chile paint clue", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
    await page.evaluate(async () => {
      sessionStorage.clear();
      try {
        await window.fs.promises.unlink("/C:/My Documents/PUERTA.BMP");
      } catch {}
    });
  });

  test("PUERTA.BMP exists during a chile session and decodes as a BMP", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, PUERTA, true);
    const info = await page.evaluate(async (p) => {
      const bytes = new Uint8Array(await window.fs.promises.readFile(p));
      return {
        magic: String.fromCharCode(bytes[0], bytes[1]),
        w: new DataView(bytes.buffer).getInt32(18, true),
        h: new DataView(bytes.buffer).getInt32(22, true),
        bpp: new DataView(bytes.buffer).getUint16(28, true),
      };
    }, PUERTA);
    expect(info).toEqual({ magic: "BM", w: 640, h: 240, bpp: 24 });
  });

  test("image looks uniform in Paint and fill reveals differing pixels", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, PUERTA, true);
    await openInPaint(page);

    const before = await canvasStats(page);
    expect(before.min).toBeGreaterThanOrEqual(252);
    expect(before.nearWhite).toBeGreaterThan(1000);

    await floodFillBackground(page);

    const after = await canvasStats(page);
    expect(after.dark).toBeGreaterThan(100000);
    expect(after.nearWhite).toBeGreaterThan(1000);
  });

  test("file is removed when the session stops running", async ({ page }) => {
    await startTeam(page);
    await expectPath(page, PUERTA, true);
    state.sessions[3] = { startedAt: null, finishedAt: null };
    await expectPath(page, PUERTA, false);
  });

  test("admin restart removes the file", async ({ page }) => {
    await startTeam(page);
    await expectPath(page, PUERTA, true);
    state.sessions[3] = { startedAt: null, finishedAt: null };
    await expectPath(page, PUERTA, false);
  });

  test("File > Open preselects the 24-bit Bitmap type during a chile session", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, PUERTA, true);
    await page.evaluate(() => window.System.launchApp("paint"));
    await expect(page.locator(PAINT_WINDOW)).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);

    const picker = await openFileDialog(page);
    const select = picker.locator("select");
    await expect(select).toHaveValue(/^[1-9]/);
    const label = await select
      .locator("option:checked")
      .textContent();
    expect(label).toContain("24-bit");
    expect(label).toContain("Bitmap");
    await expect(
      picker.locator(".explorer-icon", { hasText: "PUERTA.BMP" }),
    ).toBeVisible({ timeout: 10000 });
    await closeFileDialog(page);
  });

  test("File > Open keeps the default type without a chile session", async ({
    page,
  }) => {
    await page.evaluate(() => window.System.launchApp("paint"));
    await expect(page.locator(PAINT_WINDOW)).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
    const picker = await openFileDialog(page);
    await expect(picker.locator("select")).toHaveValue("0");
    await closeFileDialog(page);
    await startTeamViaApp(page, "argentina", "onion");
    await page.waitForTimeout(2500);
    const picker2 = await openFileDialog(page);
    await expect(picker2.locator("select")).toHaveValue("0");
    await closeFileDialog(page);
  });

  test("File > Open default is restored when the session stops", async ({
    page,
  }) => {
    await startTeam(page);
    await expectPath(page, PUERTA, true);
    await page.evaluate(() => window.System.launchApp("paint"));
    await expect(page.locator(PAINT_WINDOW)).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
    const picker = await openFileDialog(page);
    await expect(picker.locator("select")).toHaveValue(/^[1-9]/);
    await closeFileDialog(page);

    state.sessions[3] = { startedAt: null, finishedAt: null };
    await expectPath(page, PUERTA, false);
    const picker2 = await openFileDialog(page);
    await expect(picker2.locator("select")).toHaveValue("0");
    await closeFileDialog(page);
  });

  test("argentina team and no session get no PUERTA.BMP", async ({ page }) => {
    await startTeam(page, { office: "argentina", keyword: "onion" });
    await page.waitForTimeout(2500);
    expect(await fsExists(page, PUERTA)).toBe(false);
  });

  test("reload keeps the file", async ({ page }) => {
    test.setTimeout(120000);
    await startTeam(page);
    await expectPath(page, PUERTA, true);
    await page.reload();
    await page.waitForSelector("#boot-screen", {
      state: "hidden",
      timeout: 60000,
    });
    await expectPath(page, PUERTA, true);
  });
});
