import { test, expect } from '@playwright/test';

test.describe('Improving Theme', () => {
  test('a fresh browser defaults to the Improving theme', async ({ page }) => {
    await page.goto('/win98-web/');
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });

    const activeTheme = await page.evaluate(() =>
      localStorage.getItem('activeTheme'),
    );
    expect(activeTheme).toBe('improving');

    const wallpaperMode = await page.evaluate(() =>
      localStorage.getItem('wallpaperMode'),
    );
    expect(wallpaperMode).toBe('center');

    const backgroundImage = await page.evaluate(
      () =>
        getComputedStyle(document.querySelector('.desktop')).backgroundImage,
    );
    expect(backgroundImage.toLowerCase()).toContain('improving');
  });

  test('an existing theme choice is preserved', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('activeTheme', 'default');
    });
    await page.goto('/win98-web/');
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });

    const activeTheme = await page.evaluate(() =>
      localStorage.getItem('activeTheme'),
    );
    expect(activeTheme).toBe('default');

    const backgroundImage = await page.evaluate(
      () =>
        getComputedStyle(document.querySelector('.desktop')).backgroundImage,
    );
    expect(backgroundImage).toBe('none');
  });

  test('Desktop Themes lists Improving and Windows Default', async ({
    page,
  }) => {
    await page.goto('/win98-web/');
    await page.waitForSelector('#boot-screen', { state: 'hidden', timeout: 60000 });
    await page.evaluate(() => System.launchApp('desktop-themes'));
    const selector = page.locator(
      '.window[data-app-id="desktop-themes"] select#theme-selector',
    );
    await selector.waitFor({ state: 'visible', timeout: 15000 });
    const optionTexts = await selector.locator('option').allTextContents();
    expect(optionTexts).toContain('Improving');
    expect(optionTexts).toContain('Windows Default');
  });
});
