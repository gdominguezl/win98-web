import { test, expect } from '@playwright/test';

const MSN_ICON = '.desktop .explorer-icon[data-name="MSN Messenger.lnk.json"]';
const WINAMP_ICON = '.desktop .explorer-icon[data-name="Winamp.lnk.json"]';
const FOTOLOG_ICON = '.desktop .explorer-icon[data-name="Fotolog.lnk.json"]';
const MSN_WINDOW = '.window[data-app-id="msn-messenger"]';
const WINAMP_WINDOW = '.window[data-app-id="winamp"]';
const FOTOLOG_WINDOW = '.window[data-app-id="fotolog"]';

function linkFor(pathname, name, icon) {
  return `<a class="app-shortcuts__link" href="${pathname}" aria-label="Abrir ${name}"><img src="${icon}" width="24" height="24" alt=""><span class="app-shortcuts__tooltip" aria-hidden="true">${name}</span></a>`;
}

const MSN_LINK = linkFor('/', 'MSN', '/assets/favicon.png');
const FOTOLOG_LINK = linkFor('/fotolog', 'Fotolog', '/assets/fotolog/favicon.svg');
const WINAMP_LINK = linkFor('/winamp', 'Winamp', '/assets/winamp/favicon.svg');

function stubPage(title, links) {
  return `<!DOCTYPE html><html><head><title>${title}</title></head><body>
<nav class="app-shortcuts" aria-label="Accesos a otras apps">${links}</nav>
</body></html>`;
}

const STUBS = {
  '/': stubPage('msn-stub', FOTOLOG_LINK + WINAMP_LINK),
  '/fotolog': stubPage('fotolog-stub', MSN_LINK + WINAMP_LINK),
  '/winamp': stubPage('winamp-stub', MSN_LINK + FOTOLOG_LINK),
};

async function stubRoutes(page) {
  await page.route(
    (url) => Object.prototype.hasOwnProperty.call(STUBS, url.pathname),
    (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: STUBS[new URL(route.request().url()).pathname],
      }),
  );
}

async function frameDoc(page, windowSelector) {
  const handle = await page.locator(`${windowSelector} iframe`).elementHandle();
  return handle.contentFrame();
}

// Number of `load` events seen on the iframe element itself; the element
// persists across navigations, so a stable count proves the frame did not
// navigate (the document's own JS state would be reset by a real load).
async function navCount(page, windowSelector) {
  return page.locator(`${windowSelector} iframe`).evaluate((el) => {
    if (el.__navCount === undefined) {
      el.__navCount = 0;
      el.addEventListener('load', () => {
        el.__navCount += 1;
      });
    }
    return el.__navCount;
  });
}

async function clickLink(page, windowSelector, name, options = {}) {
  const frame = await frameDoc(page, windowSelector);
  await frame
    .locator(`a.app-shortcuts__link[aria-label="Abrir ${name}"]`)
    .click(options);
}

test.describe('MSN app switcher buttons', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await stubRoutes(page);
    await page.goto('/win98-web/');
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
  });

  test('(a) MSN to Winamp opens a Winamp window without navigating the frame', async ({
    page,
  }) => {
    await page.locator(MSN_ICON).dblclick();
    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });
    const before = await navCount(page, MSN_WINDOW);

    await clickLink(page, MSN_WINDOW, 'Winamp');

    await expect(page.locator(WINAMP_WINDOW)).toBeVisible({ timeout: 15000 });
    expect(await navCount(page, MSN_WINDOW)).toBe(before);
  });

  test('(b) MSN to Fotolog opens a Fotolog window without navigating the frame', async ({
    page,
  }) => {
    await page.locator(MSN_ICON).dblclick();
    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });
    const before = await navCount(page, MSN_WINDOW);

    await clickLink(page, MSN_WINDOW, 'Fotolog');

    await expect(page.locator(FOTOLOG_WINDOW)).toBeVisible({ timeout: 15000 });
    expect(await navCount(page, MSN_WINDOW)).toBe(before);
  });

  test('(c) Winamp to MSN reuses the existing MSN window', async ({ page }) => {
    await page.locator(MSN_ICON).dblclick();
    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });
    await page.locator(WINAMP_ICON).dblclick();
    await expect(page.locator(WINAMP_WINDOW)).toBeVisible({ timeout: 15000 });
    const before = await navCount(page, WINAMP_WINDOW);

    await clickLink(page, WINAMP_WINDOW, 'MSN');

    await page.waitForTimeout(500);
    await expect(page.locator(MSN_WINDOW)).toHaveCount(1);
    await expect(page.locator(MSN_WINDOW)).toBeVisible();
    expect(await navCount(page, WINAMP_WINDOW)).toBe(before);
  });

  test('(d) clicking while the target is minimized restores it', async ({ page }) => {
    await page.locator(FOTOLOG_ICON).dblclick();
    const fotolog = page.locator(FOTOLOG_WINDOW);
    await expect(fotolog).toBeVisible({ timeout: 15000 });
    await fotolog.locator('.window-minimize-button').click();
    await expect(fotolog).not.toBeVisible();

    await page.locator(MSN_ICON).dblclick();
    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });
    await clickLink(page, MSN_WINDOW, 'Fotolog');

    await expect(fotolog).toBeVisible({ timeout: 15000 });
    await expect(page.locator(FOTOLOG_WINDOW)).toHaveCount(1);
  });

  test('(e) Ctrl+click and middle click are not intercepted', async ({ page }) => {
    await page.locator(MSN_ICON).dblclick();
    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });

    await clickLink(page, MSN_WINDOW, 'Winamp', { modifiers: ['Control'] });
    await page.waitForTimeout(500);
    await expect(page.locator(WINAMP_WINDOW)).toHaveCount(0);

    await clickLink(page, MSN_WINDOW, 'Winamp', { button: 'middle' });
    await page.waitForTimeout(500);
    await expect(page.locator(WINAMP_WINDOW)).toHaveCount(0);
  });

  test('(f) Enter on a focused button opens the window', async ({ page }) => {
    await page.locator(MSN_ICON).dblclick();
    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });

    const frame = await frameDoc(page, MSN_WINDOW);
    const link = frame.locator('a.app-shortcuts__link[aria-label="Abrir Winamp"]');
    await link.focus();
    await link.press('Enter');

    await expect(page.locator(WINAMP_WINDOW)).toBeVisible({ timeout: 15000 });
  });

  test('(g) a link to an unmapped path is not intercepted', async ({ page }) => {
    await page.route('**/other', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>other-stub</title>' }),
    );
    await page.locator(MSN_ICON).dblclick();
    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });

    const frame = await frameDoc(page, MSN_WINDOW);
    await frame.evaluate(() => {
      const a = document.createElement('a');
      a.className = 'app-shortcuts__link';
      a.href = '/other';
      a.id = 'other-link';
      document.body.appendChild(a);
    });
    await frame.evaluate(() => document.getElementById('other-link').click());
    await page.waitForTimeout(500);
    const newFrame = await frameDoc(page, MSN_WINDOW);
    expect(new URL(newFrame.url()).pathname).toBe('/other');
    await expect(page.locator(WINAMP_WINDOW)).toHaveCount(0);
    await expect(page.locator(FOTOLOG_WINDOW)).toHaveCount(0);
  });

  test('(h) interception survives an in-frame reload', async ({ page }) => {
    await page.locator(MSN_ICON).dblclick();
    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });
    const before = await navCount(page, MSN_WINDOW);

    const frame = await frameDoc(page, MSN_WINDOW);
    await frame.evaluate(() => window.location.reload()).catch(() => {});
    await expect
      .poll(async () => navCount(page, MSN_WINDOW))
      .toBe(before + 1);

    await clickLink(page, MSN_WINDOW, 'Winamp');
    await expect(page.locator(WINAMP_WINDOW)).toBeVisible({ timeout: 15000 });
  });

  test('(i) a frame page without the switcher does not throw', async ({ page }) => {
    await page.route('**/fotolog', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>no-switcher</title>' }),
    );
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.locator(FOTOLOG_ICON).dblclick();
    await expect(page.locator(FOTOLOG_WINDOW)).toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });

  test('capture beats a bubble-phase SPA-style handler on the link', async ({
    page,
  }) => {
    // Bubble-phase click handler on the link simulating React Router's
    // navigation; interception must stopPropagation before it runs.
    await page.locator(WINAMP_ICON).dblclick();
    await expect(page.locator(WINAMP_WINDOW)).toBeVisible({ timeout: 15000 });
    const frame = await frameDoc(page, WINAMP_WINDOW);
    await frame.evaluate(() => {
      window.__bubbleRan = false;
      document
        .querySelector('a.app-shortcuts__link[href="/"]')
        .addEventListener('click', (e) => {
          window.__bubbleRan = true;
          if (!e.defaultPrevented) window.location.href = '/msn-navigated';
        });
    });

    await frame
      .locator('a.app-shortcuts__link[aria-label="Abrir MSN"]')
      .click();

    await expect(page.locator(MSN_WINDOW)).toBeVisible({ timeout: 15000 });
    const after = await frameDoc(page, WINAMP_WINDOW);
    expect(await after.evaluate(() => window.__bubbleRan)).toBe(false);
    expect(new URL(after.url()).pathname).toBe('/winamp');
  });
});
