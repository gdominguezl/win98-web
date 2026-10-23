import { test, expect } from '@playwright/test';
import { freshCtState, installCt } from './ct-mock.js';

const ICON = '.desktop .explorer-icon[data-name="Y2K Patch.lnk.json"]';
const WINDOW = '.window[data-app-id="y2k-patch"]';

async function boot(page) {
  await page.goto('/win98-web/');
  await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
}

async function openPatch(page) {
  await page.locator(ICON).dblclick();
  const win = page.locator(WINDOW);
  await expect(win).toBeVisible({ timeout: 15000 });
  return win;
}

test.describe('Y2K Patch', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  let state;

  test.beforeEach(async ({ page }) => {
    state = freshCtState();
    state.sessions[1] = { startedAt: new Date().toISOString(), finishedAt: null };
    await installCt(page, state);
    await page.addInitScript(() => {
      sessionStorage.setItem('ct-october-token', 'team-token');
      sessionStorage.setItem('ct-october-role', 'team');
    });
    await boot(page);
  });

  test('is on the desktop and under Start > Programs', async ({ page }) => {
    await expect(page.locator(ICON)).toBeVisible();

    await page.click('button:has-text("Start")');
    const programs = page.locator('.start-menu-item:has-text("Programs")');
    await expect(programs).toBeVisible({ timeout: 10000 });
    await programs.dispatchEvent('pointerenter');
    await expect(page.locator('.menu-item:has-text("Y2K Patch")')).toBeVisible({
      timeout: 10000,
    });
  });

  test('opens one fixed window', async ({ page }) => {
    const win = await openPatch(page);
    await expect(win.locator('.window-title')).toHaveText('Y2K Patch');
    await expect(win).not.toHaveClass(/maximized/);
    await expect(win.locator('#y2k-code')).toBeVisible();
    await expect(win.locator('#y2k-ok')).toBeVisible();

    await page.locator('.desktop').click({ position: { x: 600, y: 300 } });
    await page.locator(ICON).dblclick();
    await page.waitForTimeout(500);
    await expect(page.locator(WINDOW)).toHaveCount(1);
  });

  test('rejects an empty or wrong code and accepts the exact code', async ({ page }) => {
    test.setTimeout(90000);
    const win = await openPatch(page);
    const field = win.locator('#y2k-code');
    const status = win.locator('#y2k-status');

    await win.locator('#y2k-ok').click();
    await expect(status).toBeVisible();
    await expect(page.locator('#y2k-overlay')).toHaveCount(0);
    await expect(field).toBeEnabled();

    await field.fill('NOTTHECODE');
    await win.locator('#y2k-ok').click();
    await expect(status).toBeVisible();
    await expect(page.locator('#y2k-overlay')).toHaveCount(0);
    await expect(field).toBeEnabled();
    await expect(field).toHaveValue('NOTTHECODE');

    await field.fill('Y2KPATCH99');
    await win.locator('#y2k-form').evaluate((form) => form.requestSubmit());

    const message = page.locator('#y2k-overlay-message');
    await expect(message).toBeVisible({ timeout: 10000 });
    await expect(message).toContainText('patch is installed');
    await expect(message).toContainText('Files, memories, and messages');
    await expect(message).toContainText('midnight');

    await page.locator('#y2k-overlay-ok').click();
    await expect(page.locator('#y2k-overlay')).toHaveCount(0);

    await win.locator('.window-close-button, .window-action-close').click();
    await expect(win).toHaveCount(0);

    await page.locator('.desktop').click({ position: { x: 600, y: 300 } });
    const again = await openPatch(page);
    await expect(again.locator('#y2k-installed')).toBeVisible();
    await expect(again.locator('#y2k-code')).toHaveCount(0);
    await expect(page.locator('#y2k-overlay')).toHaveCount(0);
  });

  test('Enter accepts a loosely typed code', async ({ page }) => {
    const win = await openPatch(page);
    const field = win.locator('#y2k-code');
    await field.click();
    await field.fill('y2k patch-99');
    await field.press('Enter');

    await expect(page.locator('#y2k-overlay-message')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#y2k-overlay-message')).toContainText('survive midnight');
  });

  test('a new tab does not replay the sequence for a finished team', async ({ page }) => {
    test.setTimeout(120000);
    const win = await openPatch(page);
    await win.locator('#y2k-code').fill('Y2KPATCH99');
    await win.locator('#y2k-form').evaluate((form) => form.requestSubmit());
    await expect(page.locator('#y2k-overlay-message')).toBeVisible({ timeout: 10000 });

    const page2 = await page.context().newPage();
    await installCt(page2, state);
    await boot(page2);
    await page2.locator('.desktop .explorer-icon[data-name="Improving CT October.lnk.json"]').dblclick();
    const ct = page2.locator('.window[data-app-id="improving-ct-october"]');
    await expect(ct).toBeVisible({ timeout: 15000 });
    await expect(ct.locator('#ct-team option').first()).toBeAttached({ timeout: 10000 });
    await ct.locator('#ct-keyword').fill('onion');
    await ct.locator('#ct-start').click();
    await expect(ct.locator('#ct-status')).toHaveText('This team has finished.');
    await ct.locator('.window-close-button, .window-action-close').click();

    const calls = state.finishCalls;
    const win2 = await openPatch(page2);
    await win2.locator('#y2k-code').fill('Y2KPATCH99');
    await win2.locator('#y2k-form').evaluate((form) => form.requestSubmit());
    await expect(win2.locator('#y2k-installed')).toBeVisible();
    await expect(page2.locator('#y2k-overlay')).toHaveCount(0);
    expect(state.finishCalls).toBe(calls);
    await page2.close();
  });

  test('asks for a session before accepting a code', async ({ page }) => {
    await page.evaluate(() => {
      sessionStorage.removeItem('ct-october-token');
      sessionStorage.removeItem('ct-october-role');
    });
    const win = await openPatch(page);
    await win.locator('#y2k-code').fill('Y2KPATCH99');
    await win.locator('#y2k-ok').click();
    await expect(win.locator('#y2k-status')).toHaveText(
      'Start a session in Improving CT October first.',
    );
    await expect(page.locator('#y2k-overlay')).toHaveCount(0);
    expect(state.finishCalls).toBe(0);
  });

  test('tells a reset team to start again', async ({ page }) => {
    state.sessions[1] = { startedAt: null, finishedAt: null };
    const win = await openPatch(page);
    await win.locator('#y2k-code').fill('Y2KPATCH99');
    await win.locator('#y2k-ok').click();
    await expect(win.locator('#y2k-status')).toContainText('been reset');
    await expect(win.locator('#y2k-status')).toContainText('start a new session');
    await expect(page.locator('#y2k-overlay')).toHaveCount(0);
    expect(state.finishCalls).toBe(1);
  });

  test('accepts the code after Game over', async ({ page }) => {
    test.setTimeout(90000);
    state.sessions[1].startedAt = new Date(Date.now() - 61 * 60 * 1000).toISOString();
    await page.reload();
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
    await expect(page.locator('#ct-timer-time')).toHaveText('00:00');
    await expect(page.locator('#ct-timer-over')).toHaveText('Game over');

    const win = await openPatch(page);
    await win.locator('#y2k-code').fill('Y2KPATCH99');
    await win.locator('#y2k-form').evaluate((form) => form.requestSubmit());
    await expect(page.locator('#y2k-overlay-message')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#ct-timer-over')).toBeHidden();
    expect(state.finishCalls).toBe(1);
  });

  test('restores the icon on a returning desktop', async ({ page }) => {
    test.setTimeout(120000);
    await page.evaluate(async () => {
      try {
        await window.fs.promises.unlink('/C:/WINDOWS/Desktop/Y2K Patch.lnk.json');
      } catch {
        // already absent
      }
    });

    await page.reload();
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
    await expect(page.locator(ICON)).toBeVisible();
  });
});

test.describe('Y2K Patch on a short screen', () => {
  test.use({ viewport: { width: 800, height: 520 } });

  test('keeps the title bar and OK inside the desktop', async ({ page }) => {
    await boot(page);
    const win = await openPatch(page);
    const title = win.locator('.window-titlebar');
    const ok = win.locator('#y2k-ok');
    await expect(title).toBeVisible();
    await expect(ok).toBeVisible();

    const area = await page.locator('#desktop-area').boundingBox();
    const taskbar = await page.locator('.taskbar').boundingBox();
    const titleBox = await title.boundingBox();
    const okBox = await ok.boundingBox();

    for (const box of [titleBox, okBox]) {
      expect(box.y).toBeGreaterThanOrEqual(area.y - 1);
      expect(box.x).toBeGreaterThanOrEqual(area.x - 1);
      expect(box.x + box.width).toBeLessThanOrEqual(area.x + area.width + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(area.y + area.height + 1);
      expect(box.y + box.height).toBeLessThanOrEqual(taskbar.y + 1);
    }
  });
});
