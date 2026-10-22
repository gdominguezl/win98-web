import { test, expect } from '@playwright/test';

const ICON = '.desktop .explorer-icon[data-name="MSN Messenger.lnk.json"]';
const WINDOW = '.window[data-app-id="msn-messenger"]';
const TASKBAR_BUTTON = '.taskbar-button:has-text("MSN Messenger")';

test.describe('MSN Messenger App', () => {
  // The default 1280x720 viewport is shorter than the 796px window; use a
  // taller desktop so the "compact" assertions stay meaningful.
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    // Answer the frame request for `/` (the default MSN URL) with a stub page
    // so the spec does not depend on a running MSN server.
    await page.route(
      (url) => url.pathname === '/',
      (route) =>
        route.fulfill({ contentType: 'text/html', body: '<title>msn-stub</title>' }),
    );
    await page.goto('/win98-web/');
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
  });

  test('shows the MSN Messenger icon on the desktop', async ({ page }) => {
    await expect(page.locator(ICON)).toBeVisible();
  });

  test('double click opens a compact MSN Messenger window', async ({ page }) => {
    await page.locator(ICON).dblclick();

    const win = page.locator(WINDOW);
    await expect(win).toBeVisible({ timeout: 15000 });
    await expect(win.locator('.window-title')).toHaveText('MSN Messenger');

    const iframe = win.locator('iframe[title="MSN Messenger"]');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(new URL(src, page.url()).pathname).toBe('/');

    await expect(page.locator(TASKBAR_BUTTON)).toBeVisible();

    // Compact: not maximized, narrower than half the desktop, shorter than it.
    await expect(win).not.toHaveClass(/maximized/);
    const winBox = await win.boundingBox();
    const desktopBox = await page.locator('.desktop').boundingBox();
    expect(winBox.width).toBeLessThan(desktopBox.width / 2);
    expect(winBox.height).toBeLessThan(desktopBox.height);
    expect(winBox.height).toBeGreaterThan(winBox.width); // portrait, like the contact list

    // Maximizing makes it larger.
    await win.locator('.window-maximize-button').click();
    await expect(win).toHaveClass(/maximized/);
    const maxBox = await win.boundingBox();
    expect(maxBox.width).toBeGreaterThan(winBox.width);
    expect(maxBox.height).toBeGreaterThan(winBox.height);
  });

  test('is a singleton: a second launch keeps one window', async ({ page }) => {
    await page.locator(ICON).dblclick();
    await expect(page.locator(WINDOW)).toBeVisible({ timeout: 15000 });

    await page.locator(ICON).dblclick();
    await page.waitForTimeout(1000);
    await expect(page.locator(WINDOW)).toHaveCount(1);
  });

  test('launches with Enter on the selected icon', async ({ page }) => {
    await page.locator(ICON).click();
    await page.keyboard.press('Enter');
    await expect(page.locator(WINDOW)).toBeVisible({ timeout: 15000 });
  });

  test('launches from Start > Programs', async ({ page }) => {
    await page.click('button:has-text("Start")');
    const programs = page.locator('.start-menu-item:has-text("Programs")');
    await expect(programs).toBeVisible({ timeout: 10000 });
    await programs.dispatchEvent('pointerenter');
    await page.click('.menu-item:has-text("MSN Messenger")', { timeout: 10000 });

    await expect(page.locator(WINDOW)).toBeVisible({ timeout: 15000 });
  });

  test('closing removes the window and taskbar button', async ({ page }) => {
    await page.locator(ICON).dblclick();
    const win = page.locator(WINDOW);
    await expect(win).toBeVisible({ timeout: 15000 });
    await expect(page.locator(TASKBAR_BUTTON)).toBeVisible();

    await win.locator('.window-close-button, .window-action-close').click();
    await expect(win).not.toBeVisible();
    await expect(page.locator(TASKBAR_BUTTON)).not.toBeVisible();
  });

  test('restores the icon for a returning user whose desktop lacks it', async ({ page }) => {
    test.setTimeout(120000); // two full boots
    // Simulate a desktop persisted before this app existed: remove the shortcut.
    await page.evaluate(async () => {
      try {
        await window.fs.promises.unlink('/C:/WINDOWS/Desktop/MSN Messenger.lnk.json');
      } catch (e) {
        // already absent
      }
    });

    await page.reload();
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
    await expect(page.locator(ICON)).toBeVisible();
  });
});
