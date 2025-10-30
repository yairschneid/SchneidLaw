const { test, expect } = require('@playwright/test');

test('header navigation test', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Test logo visibility
  const logo = page.locator('.logo-tree');
  await expect(logo).toBeVisible();

  // Test navigation links
  const navLinks = page.locator('.nav-links');
  await expect(navLinks).toBeVisible();

  // Test language switcher
  const langSwitcher = page.locator('.language-switcher');
  await expect(langSwitcher).toBeVisible();
});