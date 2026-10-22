import { test, expect } from '@playwright/test';

const ICON = '.desktop .explorer-icon[data-name="Winamp.lnk.json"]';
const WINDOW = '.window[data-app-id="winamp"]';
const TASKBAR_BUTTON = '.taskbar-button:has-text("Winamp")';
const DESKTOP_LNK = '/C:/WINDOWS/Desktop/Winamp.lnk.json';
const PROGRAMS_LNK = '/C:/WINDOWS/Start Menu/Programs/Winamp.lnk.json';
const STARTUP_LNK = '/C:/WINDOWS/Start Menu/Programs/StartUp/Winamp.lnk.json';
const MARKER = '/C:/.winamp_msn_migrated';
const LAYOUT = '/C:/WINDOWS/Desktop.zen_layout.json';

const webampShortcut = JSON.stringify({ type: 'shortcut', appId: 'webamp' }, null, 2);

async function readLnkAppId(page, path) {
  return page.evaluate(async (p) => {
    try {
      const text = await window.fs.promises.readFile(p, 'utf8');
      return JSON.parse(text).appId;
    } catch (e) {
      return null;
    }
  }, path);
}

test.describe('Winamp App', () => {
  // A 1440x900 desktop comfortably fits the 640x480 window.
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    // Answer the frame request for `/winamp` with a stub page so the spec
    // does not depend on a running MSN server.
    await page.route(
      (url) => url.pathname === '/winamp',
      (route) =>
        route.fulfill({ contentType: 'text/html', body: '<title>winamp-stub</title>' }),
    );
    await page.goto('/win98-web/');
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
  });

  test('shows the Winamp icon on the desktop', async ({ page }) => {
    await expect(page.locator(ICON)).toBeVisible();
  });

  test('double click opens a Winamp window', async ({ page }) => {
    await page.locator(ICON).dblclick();

    const win = page.locator(WINDOW);
    await expect(win).toBeVisible({ timeout: 15000 });
    await expect(win.locator('.window-title')).toHaveText('Winamp');

    const iframe = win.locator('iframe[title="Winamp"]');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(new URL(src, page.url()).pathname).toBe('/winamp');

    await expect(page.locator(TASKBAR_BUTTON)).toBeVisible();

    // 640x480, not maximized.
    await expect(win).not.toHaveClass(/maximized/);
    const winBox = await win.boundingBox();
    expect(Math.round(winBox.width)).toBe(640);
    expect(Math.round(winBox.height)).toBe(480);
  });

  test('Programs lists Winamp and not Winamp Classic', async ({ page }) => {
    await page.click('button:has-text("Start")');
    const programs = page.locator('.start-menu-item:has-text("Programs")');
    await expect(programs).toBeVisible({ timeout: 10000 });
    await programs.dispatchEvent('pointerenter');
    await expect(
      page.locator('.menu-item:has-text("Winamp")').first(),
    ).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.menu-item:has-text("Winamp Classic")')).toHaveCount(0);
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

  test('closing removes the window and taskbar button', async ({ page }) => {
    await page.locator(ICON).dblclick();
    const win = page.locator(WINDOW);
    await expect(win).toBeVisible({ timeout: 15000 });
    await expect(page.locator(TASKBAR_BUTTON)).toBeVisible();

    await win.locator('.window-close-button, .window-action-close').click();
    await expect(win).not.toBeVisible();
    await expect(page.locator(TASKBAR_BUTTON)).not.toBeVisible();
  });

  test('classic Webamp still launches with launchApp("webamp")', async ({ page }) => {
    await page.evaluate(() => window.System.launchApp('webamp'));
    await page.waitForSelector('#webamp-container', { timeout: 20000 });
    await expect(page.locator('#webamp')).toBeVisible();
  });

  test('migrates old shortcuts in place, keeps position, touches nothing else', async ({
    page,
  }) => {
    test.setTimeout(120000); // two full boots
    // Seed a pre-migration profile: both shortcuts point at the classic
    // player, a deliberate StartUp shortcut to it, a saved icon position and
    // no migration marker.
    await page.evaluate(
      async ({ desktopLnk, programsLnk, startupLnk, marker, layout, shortcut }) => {
        await window.fs.promises.writeFile(desktopLnk, shortcut);
        await window.fs.promises.writeFile(programsLnk, shortcut);
        await window.fs.promises.mkdir('/C:/WINDOWS/Start Menu/Programs/StartUp', {
          recursive: true,
        });
        await window.fs.promises.writeFile(startupLnk, shortcut);
        try {
          const raw = await window.fs.promises.readFile(layout, 'utf8');
          const parsed = JSON.parse(raw);
          parsed.positions = parsed.positions || {};
          parsed.positions['Winamp.lnk.json'] = { x: 500, y: 250 };
          await window.fs.promises.writeFile(layout, JSON.stringify(parsed, null, 2));
        } catch (e) {
          await window.fs.promises.writeFile(
            layout,
            JSON.stringify({ positions: { 'Winamp.lnk.json': { x: 500, y: 250 } } }, null, 2),
          );
        }
        try {
          await window.fs.promises.unlink(marker);
        } catch (e) {
          // no marker yet
        }
      },
      { desktopLnk: DESKTOP_LNK, programsLnk: PROGRAMS_LNK, startupLnk: STARTUP_LNK, marker: MARKER, layout: LAYOUT, shortcut: webampShortcut },
    );

    await page.reload();
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });

    // Both default shortcuts now point at the MSN Winamp.
    expect(await readLnkAppId(page, DESKTOP_LNK)).toBe('winamp');
    expect(await readLnkAppId(page, PROGRAMS_LNK)).toBe('winamp');
    // The migration marker was written.
    await expect
      .poll(() =>
        page.evaluate(
          (m) => window.fs.promises.stat(m).then(() => true).catch(() => false),
          MARKER,
        ),
      )
      .toBe(true);
    // The StartUp shortcut to the classic player is untouched.
    expect(await readLnkAppId(page, STARTUP_LNK)).toBe('webamp');
    // Exactly one Winamp icon, still at the saved position.
    await expect(page.locator(ICON)).toHaveCount(1);
    const pos = await page.locator(ICON).evaluate((el) => ({
      left: el.style.left,
      top: el.style.top,
    }));
    expect(pos).toEqual({ left: '500px', top: '250px' });

    // The migrated icon opens the new window.
    await page.locator(ICON).dblclick();
    await expect(page.locator(WINDOW)).toBeVisible({ timeout: 15000 });
  });

  test('skips a shortcut with invalid JSON and still writes the marker', async ({
    page,
  }) => {
    test.setTimeout(120000); // two full boots
    await page.evaluate(
      async ({ desktopLnk, marker }) => {
        await window.fs.promises.writeFile(desktopLnk, 'this is not json');
        try {
          await window.fs.promises.unlink(marker);
        } catch (e) {
          // no marker yet
        }
      },
      { desktopLnk: DESKTOP_LNK, marker: MARKER },
    );

    await page.reload();
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });

    const content = await page.evaluate(
      (p) => window.fs.promises.readFile(p, 'utf8'),
      DESKTOP_LNK,
    );
    expect(content).toBe('this is not json');
    await expect
      .poll(() =>
        page.evaluate(
          (m) => window.fs.promises.stat(m).then(() => true).catch(() => false),
          MARKER,
        ),
      )
      .toBe(true);
  });

  test('does not override shortcuts after the marker exists', async ({ page }) => {
    test.setTimeout(120000); // two full boots
    // Simulate a user who deliberately pointed the shortcuts back at the
    // classic player after the migration already ran.
    await page.evaluate(
      async ({ desktopLnk, programsLnk, marker, shortcut }) => {
        await window.fs.promises.writeFile(desktopLnk, shortcut);
        await window.fs.promises.writeFile(programsLnk, shortcut);
        await window.fs.promises.writeFile(marker, 'done');
      },
      { desktopLnk: DESKTOP_LNK, programsLnk: PROGRAMS_LNK, marker: MARKER, shortcut: webampShortcut },
    );

    await page.reload();
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });

    expect(await readLnkAppId(page, DESKTOP_LNK)).toBe('webamp');
    expect(await readLnkAppId(page, PROGRAMS_LNK)).toBe('webamp');
  });
});
