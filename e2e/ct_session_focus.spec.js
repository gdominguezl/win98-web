import { test, expect } from "@playwright/test";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const DESK = ".desktop .explorer-icon";
const PROGRAMS_PATH = "/C:/WINDOWS/Start Menu/Programs";

async function boot(page) {
  await page.goto("/win98-web/");
  await page.waitForSelector("#boot-screen", { state: "hidden", timeout: 60000 });
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

function deskIcon(page, name) {
  return page.locator(`${DESK}[data-name="${name}"]`);
}

async function iconCount(page, name) {
  return deskIcon(page, name).count();
}

async function programsLabels(page) {
  await page.click('button:has-text("Start")');
  const item = page.locator('.start-menu-item[data-id="Programs"]');
  await expect(item).toBeVisible({ timeout: 10000 });
  await item.dispatchEvent("pointerenter");
  const popup = page.locator(".menu-popup-wrapper.start-menu-popup.open .menu-popup");
  await expect(popup.locator(".menu-item").first()).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(400);
  return popup.locator(".menu-item").allTextContents();
}

async function accessoriesLabels(page) {
  const popup = page.locator(".menu-popup-wrapper.start-menu-popup.open .menu-popup").last();
  const acc = popup.locator('.menu-item:has-text("Accessories")');
  await acc.dispatchEvent("pointerenter");
  const popups = page.locator(".menu-popup-wrapper.start-menu-popup.open .menu-popup");
  await expect(popups).toHaveCount(2, { timeout: 10000 });
  const submenu = popups.filter({
    hasNot: page.locator('.menu-item:has-text("Accessories")'),
  });
  await expect(submenu).toHaveCount(1);
  await page.waitForTimeout(400);
  return submenu.locator(".menu-item").allTextContents();
}

async function closeMenus(page) {
  await page.keyboard.press("Escape");
  await page.locator(".desktop").click({ position: { x: 1100, y: 200 } });
  await page.waitForTimeout(300);
}

async function openGamesFolder(page) {
  await page.evaluate(() => window.System.launchApp("explorer", "/Desktop/Games"));
  const win = page.locator('.window[data-app-id="explorer"]').last();
  await expect(win).toBeVisible({ timeout: 15000 });
  await expect(win.locator(".explorer-icon").first()).toBeVisible({ timeout: 10000 });
  return win;
}

test.describe("CT session focus", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
  });

  test("argentina session hides apps and pins MS-DOS Prompt first", async ({ page }) => {
    test.setTimeout(120000);
    await startTeam(page, { office: "argentina", keyword: "onion" });

    await expect.poll(() => iconCount(page, "Agent.lnk.json"), { timeout: 15000 }).toBe(0);
    expect(await iconCount(page, "Desktop Themes.lnk.json")).toBe(0);
    await expect(page.locator(`${DESK}:has-text("Network Neighborhood")`)).toHaveCount(0);
    expect(await iconCount(page, "sheep.lnk.json")).toBe(1);
    await expect(page.locator(`${DESK}:has-text("Internet Explorer")`)).toHaveCount(1);

    const games = await openGamesFolder(page);
    for (const lnk of ["Diablo.lnk.json", "Commander Keen.lnk.json", "Doom.lnk.json", "Quake.lnk.json"]) {
      await expect(games.locator(`.explorer-icon[data-name="${lnk}"]`)).toHaveCount(0);
    }
    await expect(games.locator('.explorer-icon[data-name="Minesweeper.lnk.json"]')).toHaveCount(1);
    await games.locator(".window-close-button, .window-action-close").first().click();

    const labels = await programsLabels(page);
    expect(labels[0]).toBe("MS-DOS Prompt");
    for (const hidden of ["Diablo", "Commander Keen", "Doom", "Quake", "DOS Games Downloader", "Buy me a coffee"]) {
      expect(labels).not.toContain(hidden);
    }
    const acc = await accessoriesLabels(page);
    for (const hidden of ["Agent", "Report a Bug", "Entertainment"]) {
      expect(acc).not.toContain(hidden);
    }
    expect(acc).toContain("Notepad");
    await closeMenus(page);
  });

  test("chile session hides the same apps", async ({ page }) => {
    test.setTimeout(120000);
    await startTeam(page, { office: "chile", keyword: "river" });

    await expect.poll(() => iconCount(page, "Agent.lnk.json"), { timeout: 15000 }).toBe(0);
    expect(await iconCount(page, "Desktop Themes.lnk.json")).toBe(0);
    await expect(page.locator(`${DESK}:has-text("Network Neighborhood")`)).toHaveCount(0);

    const labels = await programsLabels(page);
    expect(labels[0]).toBe("MS-DOS Prompt");
    expect(labels).not.toContain("DOS Games Downloader");
    expect(labels).not.toContain("Quake");
    await closeMenus(page);
  });

  test("no session shows every app in the original order", async ({ page }) => {
    expect(await iconCount(page, "Agent.lnk.json")).toBe(1);
    expect(await iconCount(page, "Desktop Themes.lnk.json")).toBe(1);
    await expect(page.locator(`${DESK}:has-text("Network Neighborhood")`)).toHaveCount(1);

    const labels = await programsLabels(page);
    expect(labels[0]).not.toBe("MS-DOS Prompt");
    for (const app of ["MS-DOS Prompt", "DOS Games Downloader", "Diablo", "Commander Keen", "Doom", "Quake"]) {
      expect(labels).toContain(app);
    }
    const acc = await accessoriesLabels(page);
    for (const app of ["Agent", "Report a Bug", "Entertainment"]) {
      expect(acc).toContain(app);
    }
    expect(labels).not.toContain("Buy me a coffee");
    expect(acc).not.toContain("Buy me a coffee");
    await closeMenus(page);
  });

  test("admin restart restores every hidden app", async ({ page }) => {
    test.setTimeout(120000);
    await startTeam(page, { office: "argentina", keyword: "onion" });
    await expect.poll(() => iconCount(page, "Agent.lnk.json"), { timeout: 15000 }).toBe(0);

    state.sessions[1] = { startedAt: null, finishedAt: null };
    await expect.poll(() => iconCount(page, "Agent.lnk.json"), { timeout: 15000 }).toBe(1);
    expect(await iconCount(page, "Desktop Themes.lnk.json")).toBe(1);
    await expect(page.locator(`${DESK}:has-text("Network Neighborhood")`)).toHaveCount(1);

    const labels = await programsLabels(page);
    expect(labels[0]).not.toBe("MS-DOS Prompt");
    expect(labels).toContain("DOS Games Downloader");
    expect(labels).toContain("Quake");
    await closeMenus(page);
  });

  test("Buy me a coffee stays hidden even when its shortcut is stored", async ({ page }) => {
    await page.evaluate(async (dir) => {
      await window.fs.promises.mkdir(dir, { recursive: true });
      await window.fs.promises.writeFile(
        `${dir}/Buy me a coffee.lnk.json`,
        JSON.stringify({ type: "shortcut", appId: "buy-me-a-coffee", args: null }),
      );
    }, PROGRAMS_PATH);

    const labels = await programsLabels(page);
    expect(labels).not.toContain("Buy me a coffee");
    await closeMenus(page);
  });
});
