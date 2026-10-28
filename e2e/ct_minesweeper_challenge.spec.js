import { test, expect } from "@playwright/test";
import { freshCtState, installCt } from "./ct-mock.js";

const CT_ICON = '.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]';
const CT_WINDOW = '.window[data-app-id="improving-ct-october"]';
const MS_WINDOW = '.window[data-app-id="minesweeper"]';

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

async function openMinesweeper(page) {
  await page.evaluate(() => window.System.launchApp("minesweeper"));
  const win = page.locator(MS_WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  await expect(win.locator(".cell").first()).toBeAttached({ timeout: 10000 });
  return win;
}

async function closeMinesweeper(page) {
  await page.evaluate(() => {
    const app = window.System.appManager.runningApps["minesweeper"];
    if (app && app.win) app.win.close();
  });
  await page.waitForTimeout(300);
}

async function forceWin(page) {
  await page.evaluate(() => {
    const app = window.System.appManager.runningApps["minesweeper"];
    const safe = app.game.board.flat().filter((c) => !c.isMine && !c.isRevealed);
    for (const c of safe.slice(0, -1)) c.isRevealed = true;
    const last = safe[safe.length - 1];
    const el = app.win.element.querySelector(
      `.cell[data-x="${last.x}"][data-y="${last.y}"]`,
    );
    app._revealCellAndUpdateGameState(el);
  });
  await page.waitForTimeout(400);
}

async function forceLoss(page) {
  await page.evaluate(() => {
    const app = window.System.appManager.runningApps["minesweeper"];
    const mine = app.game.board.flat().find((c) => c.isMine && !c.isRevealed);
    const el = app.win.element.querySelector(
      `.cell[data-x="${mine.x}"][data-y="${mine.y}"]`,
    );
    app._revealCellAndUpdateGameState(el);
  });
  await page.waitForTimeout(400);
}

async function resetBoard(page) {
  await page.evaluate(() => {
    window.System.appManager.runningApps["minesweeper"].resetGame();
  });
  await page.waitForTimeout(300);
}

async function boardSize(page) {
  return page.locator(`${MS_WINDOW} .cell`).count();
}

async function closeDialogs(page) {
  const buttons = page.locator(
    '.window:not([data-app-id]) button:has-text("OK")',
  );
  for (let i = 0; i < 5; i++) {
    const ok = buttons.first();
    if (!(await ok.count())) break;
    await ok.click({ force: true }).catch(() => {});
    await page.waitForTimeout(200);
  }
}

test.describe("CT station: Minesweeper challenge", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    await installCt(page, state);
    await boot(page);
    await page.evaluate(() => sessionStorage.clear());
  });

  test("argentina gets an 8x8/10 locked board and the Codigo: 1 reveal", async ({
    page,
  }) => {
    await startTeam(page);
    await page.waitForTimeout(2500);
    const win = await openMinesweeper(page);
    expect(await boardSize(page)).toBe(64);

    await win.locator('.menu-button:has-text("Game")').click();
    const beginner = page.locator(".menu-popup .menu-item:has-text('Beginner')");
    await expect(beginner).toHaveAttribute("aria-disabled", "true", {
      timeout: 10000,
    });
    await page.keyboard.press("Escape");

    await forceWin(page);
    const reveal = page.locator(".window:has-text('Codigo: 1')");
    await expect(reveal).toBeVisible({ timeout: 10000 });
    await expect(page.locator(".window:has-text('fastest time')")).toHaveCount(0);
    await closeDialogs(page);

    await resetBoard(page);
    await forceWin(page);
    await expect(page.locator(".window:has-text('Codigo: 1')")).toHaveCount(0);
  });

  test("chile gets a 6x6/4 board and the BODEGA reveal", async ({ page }) => {
    await startTeam(page, { office: "chile", keyword: "river" });
    await page.waitForTimeout(2500);
    await openMinesweeper(page);
    expect(await boardSize(page)).toBe(36);
    await forceWin(page);
    await expect(
      page.locator(".window:has-text('SECTOR DESBLOQUEADO: BODEGA')"),
    ).toBeVisible({ timeout: 10000 });
    await closeDialogs(page);
  });

  test("taunts start on the third loss and a win resets the count", async ({
    page,
  }) => {
    await startTeam(page);
    await page.waitForTimeout(2500);
    await openMinesweeper(page);

    const taunt = page.locator(
      ".window:has-text('sos re troll'), .window:has-text('LOL te esta'), .window:has-text('dale que se puede'), .window:has-text('ni mi abuela'), .window:has-text('casi, casi')",
    );

    await forceLoss(page);
    await expect(taunt).toHaveCount(0);
    await resetBoard(page);
    await forceLoss(page);
    await expect(taunt).toHaveCount(0);
    await resetBoard(page);
    await forceLoss(page);
    await expect(taunt.first()).toBeVisible({ timeout: 10000 });
    await closeDialogs(page);

    await resetBoard(page);
    await forceWin(page);
    await closeDialogs(page);
    await resetBoard(page);
    await forceLoss(page);
    await expect(taunt).toHaveCount(0);
    await resetBoard(page);
    await forceLoss(page);
    await expect(taunt).toHaveCount(0);
  });

  test("finish restores normal Minesweeper", async ({ page }) => {
    await startTeam(page);
    await page.waitForTimeout(2500);
    state.sessions[1].finishedAt = new Date().toISOString();
    await page.waitForTimeout(2500);
    const win = await openMinesweeper(page);
    expect(await boardSize(page)).toBe(81);
    await win.locator('.menu-button:has-text("Game")').click();
    const beginner = page.locator(".menu-popup .menu-item:has-text('Beginner')");
    await expect(beginner).not.toHaveAttribute("aria-disabled", "true", {
      timeout: 10000,
    });
    await page.keyboard.press("Escape");

    await forceWin(page);
    await expect(
      page.locator(".window:has-text('fastest time')"),
    ).toBeVisible({ timeout: 10000 });
    await closeDialogs(page);
  });

  test("no session means a normal game", async ({ page }) => {
    const win = await openMinesweeper(page);
    expect(await boardSize(page)).toBe(81);
    await win.locator('.menu-button:has-text("Game")').click();
    const beginner = page.locator(".menu-popup .menu-item:has-text('Beginner')");
    await expect(beginner).not.toHaveAttribute("aria-disabled", "true", {
      timeout: 10000,
    });
    await page.keyboard.press("Escape");
  });
});
