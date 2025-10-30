import { test, expect } from '@playwright/test';

test('Desktop Header Layout - LTR Languages', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Switch to English
  await page.click('.language-switcher');
  await page.click('.language-option[onclick*="en"]');
  await page.waitForTimeout(500); // Wait for language change

  // Verify LTR layout
  await expect(page.locator('.logo')).toBeVisible();
  await expect(page.locator('.nav-links')).toBeVisible();
  await expect(page.locator('.language-dropdown')).toBeVisible();

  // Check navigation links visibility and spacing
  const navLinks = page.locator('.nav-links a');
  await expect(navLinks).toHaveCount(5);

  // Test hover effect
  const firstLink = navLinks.first();
  await firstLink.hover();
  const color = await firstLink.evaluate((el) => window.getComputedStyle(el).color);
  expect(color).toBe('rgb(184, 134, 11)'); // var(--gold)
});

test('Desktop Header Layout - RTL Language', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Switch to Hebrew
  await page.click('.language-switcher');
  await page.click('.language-option[onclick*="he"]');
  await page.waitForTimeout(500); // Wait for language change

  // Verify RTL layout
  const html = page.locator('html');
  await expect(html).toHaveAttribute('dir', 'rtl');
  
  // Check layout order in RTL
  const logo = page.locator('.logo');
  const langDropdown = page.locator('.language-dropdown');
  
  await expect(logo).toHaveCSS('order', '-1');
  await expect(langDropdown).toHaveCSS('order', '2');
});

test('Mobile Header Layout', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 767, height: 800 });
  await page.waitForTimeout(500); // Wait for responsive changes

  // Check mobile elements
  await expect(page.locator('.mobile-menu-toggle')).toBeVisible();
  await expect(page.locator('.nav-links')).toBeHidden();
  
  // Test mobile menu
  await page.click('.mobile-menu-toggle');
  await expect(page.locator('.mobile-menu.active')).toBeVisible();
  
  // Test menu item click
  await page.click('.mobile-menu a:first-child');
  await page.waitForTimeout(300); // Wait for animation
  await expect(page.locator('.mobile-menu.active')).toBeHidden();
});