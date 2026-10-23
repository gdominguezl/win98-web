import { test, expect } from '@playwright/test';

const ICON = '.desktop .explorer-icon[data-name="Fotolog.lnk.json"]';
const WINDOW = '.window[data-app-id="fotolog"]';
const TASKBAR_BUTTON = '.taskbar-button:has-text("Fotolog")';

async function expectInsideDesktop(page, win) {
  const winBox = await win.boundingBox();
  const area = await page.locator('#desktop-area').boundingBox();
  const taskbar = await page.locator('.taskbar').boundingBox();
  expect(winBox.y).toBeGreaterThanOrEqual(area.y - 1);
  expect(winBox.x).toBeGreaterThanOrEqual(area.x - 1);
  expect(winBox.x + winBox.width).toBeLessThanOrEqual(area.x + area.width + 1);
  expect(winBox.y + winBox.height).toBeLessThanOrEqual(area.y + area.height + 1);
  expect(winBox.y + winBox.height).toBeLessThanOrEqual(taskbar.y + 1);
  return winBox;
}

test.describe('Fotolog App', () => {
  // A 1440x900 desktop comfortably fits the 1024x768 window.
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    // Answer the frame request for `/fotolog` with a stub page (no
    // background, like a transparent MSN page) so the spec does not
    // depend on a running MSN server.
    await page.route(
      (url) => url.pathname === '/fotolog',
      (route) =>
        route.fulfill({ contentType: 'text/html', body: '<title>fotolog-stub</title>' }),
    );
    await page.goto('/win98-web/');
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
  });

  test('shows the Fotolog icon on the desktop', async ({ page }) => {
    await expect(page.locator(ICON)).toBeVisible();
  });

  test('double click opens a Fotolog window', async ({ page }) => {
    await page.locator(ICON).dblclick();

    const win = page.locator(WINDOW);
    await expect(win).toBeVisible({ timeout: 15000 });
    await expect(win.locator('.window-title')).toHaveText('Fotolog');

    const iframe = win.locator('iframe[title="Fotolog"]');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(new URL(src, page.url()).pathname).toBe('/fotolog');

    await expect(page.locator(TASKBAR_BUTTON)).toBeVisible();

    // 1024x768, not maximized.
    await expect(win).not.toHaveClass(/maximized/);
    const winBox = await win.boundingBox();
    expect(Math.round(winBox.width)).toBe(1024);
    expect(Math.round(winBox.height)).toBe(768);
  });

  test('launches from Start > Programs', async ({ page }) => {
    await page.click('button:has-text("Start")');
    const programs = page.locator('.start-menu-item:has-text("Programs")');
    await expect(programs).toBeVisible({ timeout: 10000 });
    await programs.dispatchEvent('pointerenter');
    await page.click('.menu-item:has-text("Fotolog")', { timeout: 10000 });

    await expect(page.locator(WINDOW)).toBeVisible({ timeout: 15000 });
  });

  test('launches with Enter on the selected icon', async ({ page }) => {
    await page.locator(ICON).click();
    await page.keyboard.press('Enter');
    await expect(page.locator(WINDOW)).toBeVisible({ timeout: 15000 });
  });

  test('is a singleton: a second launch keeps one window', async ({ page }) => {
    await page.locator(ICON).dblclick();
    await expect(page.locator(WINDOW)).toBeVisible({ timeout: 15000 });

    await page.locator(ICON).dblclick();
    await page.waitForTimeout(1000);
    await expect(page.locator(WINDOW)).toHaveCount(1);
  });

  test('relaunching a minimized window restores it without reloading the frame', async ({
    page,
  }) => {
    await page.locator(ICON).dblclick();
    const win = page.locator(WINDOW);
    await expect(win).toBeVisible({ timeout: 15000 });
    const iframe = win.locator('iframe[title="Fotolog"]');
    await expect(iframe).toBeVisible();

    await page.evaluate(() => {
      document.querySelector('.window[data-app-id="fotolog"]').dataset.marker = 'kept';
    });
    await win.locator('.window-minimize-button').click();
    await expect(win).not.toBeVisible();

    // Click the desktop background first: the icon is still selected from
    // the first launch and a click on a selected icon (>500ms) enters
    // rename mode instead of relaunching.
    await page.locator('.desktop').click({ position: { x: 600, y: 300 } });
    await page.locator(ICON).dblclick();
    await expect(win).toBeVisible({ timeout: 15000 });
    const marker = await page.evaluate(
      () => document.querySelector('.window[data-app-id="fotolog"]').dataset.marker,
    );
    expect(marker).toBe('kept');
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
        await window.fs.promises.unlink('/C:/WINDOWS/Desktop/Fotolog.lnk.json');
      } catch (e) {
        // already absent
      }
    });

    await page.reload();
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
    await expect(page.locator(ICON)).toBeVisible();
  });

  test('iframe area renders white behind a transparent document', async ({ page }) => {
    await page.locator(ICON).dblclick();
    const win = page.locator(WINDOW);
    await expect(win).toBeVisible({ timeout: 15000 });
    const iframe = win.locator('iframe[title="Fotolog"]');
    await expect(iframe).toBeVisible();
    await page.waitForTimeout(500);

    const bg = await iframe.evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );
    expect(bg).toBe('rgb(255, 255, 255)');

    const box = await iframe.boundingBox();
    const shot = await page.screenshot({
      clip: { x: box.x + 10, y: box.y + 10, width: 40, height: 40 },
    });
    const pixel = await page.evaluate(async (b64) => {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = 'data:image/png;base64,' + b64;
      });
      const cv = document.createElement('canvas');
      cv.width = img.width;
      cv.height = img.height;
      cv.getContext('2d').drawImage(img, 0, 0);
      return [...cv.getContext('2d').getImageData(20, 20, 1, 1).data];
    }, shot.toString('base64'));
    expect(pixel).toEqual([255, 255, 255, 255]);
  });
});

test.describe('Fotolog window fit', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(
      (url) => url.pathname === '/fotolog',
      (route) =>
        route.fulfill({ contentType: 'text/html', body: '<title>fotolog-stub</title>' }),
    );
    await page.goto('/win98-web/');
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
  });

  test.describe('short desktop', () => {
    test.use({ viewport: { width: 1280, height: 600 } });

    test('opens inside the desktop and above the taskbar', async ({ page }) => {
      await page.evaluate(() => window.System.launchApp('fotolog'));
      const win = page.locator(WINDOW);
      await expect(win).toBeVisible({ timeout: 15000 });
      await expect(win).not.toHaveClass(/maximized/);
      const winBox = await expectInsideDesktop(page, win);
      expect(Math.round(winBox.width)).toBeLessThanOrEqual(1024);
      expect(Math.round(winBox.height)).toBeLessThan(768);
    });

    test('maximize then restore returns to the fitted size', async ({ page }) => {
      await page.evaluate(() => window.System.launchApp('fotolog'));
      const win = page.locator(WINDOW);
      await expect(win).toBeVisible({ timeout: 15000 });
      const before = await expectInsideDesktop(page, win);

      await win.locator('.window-maximize-button').click();
      await expect(win).toHaveClass(/maximized/);
      await win.locator('.window-maximize-button').click();
      await expect(win).not.toHaveClass(/maximized/);

      const after = await expectInsideDesktop(page, win);
      expect(Math.round(after.width)).toBe(Math.round(before.width));
      expect(Math.round(after.height)).toBe(Math.round(before.height));
      expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(1);
    });
  });

  test.describe('tiny desktop', () => {
    test.use({ viewport: { width: 800, height: 400 } });

    test('stays within the desktop and does not shrink below 240px', async ({ page }) => {
      const errors = [];
      page.on('pageerror', (error) => errors.push(String(error)));
      await page.evaluate(() => window.System.launchApp('fotolog'));
      const win = page.locator(WINDOW);
      await expect(win).toBeVisible({ timeout: 15000 });
      const winBox = await expectInsideDesktop(page, win);
      const area = await page.locator('#desktop-area').boundingBox();
      expect(winBox.width).toBeGreaterThanOrEqual(Math.min(240, area.width) - 1);
      expect(winBox.height).toBeGreaterThanOrEqual(Math.min(240, area.height) - 1);
      expect(errors).toEqual([]);
    });
  });
});
