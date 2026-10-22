import { test, expect } from '@playwright/test';

test.describe('Webamp App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/win98-web/');
    // Wait for boot screen to disappear
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
  });

  test('should launch classic Webamp', async ({ page }) => {
    // The desktop "Winamp" icon now opens the MSN Winamp; the classic player
    // stays registered under the "webamp" app id.
    await page.evaluate(() => window.System.launchApp('webamp'));

    // Webamp renders to #webamp-container
    await page.waitForSelector('#webamp-container', { timeout: 20000 });

    // Check if webamp canvas/element exists
    const webamp = page.locator('#webamp');
    await expect(webamp).toBeVisible();
  });
});
