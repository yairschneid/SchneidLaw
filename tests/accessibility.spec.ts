import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('Screen Reader Compatibility', async ({ page }) => {
    // Check ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCount(await page.locator('[role]').count());
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement.tagName);
    expect(focused.toLowerCase()).toBe('a');

    // Navigate through all focusable elements
    const focusableElements = await page.$$('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    for (let i = 0; i < focusableElements.length; i++) {
      await page.keyboard.press('Tab');
      const isVisible = await focusableElements[i].isVisible();
      expect(isVisible).toBeTruthy();
    }
  });

  test('Color Contrast and Readability', async ({ page }) => {
    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Verify no contrast issues
    const contrastIssues = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    expect(contrastIssues).toHaveLength(0);

    // Check link visibility
    const links = page.locator('a');
    await expect(links).toHaveCSS('text-decoration', /underline|none/);

    // Test font sizes
    const textElements = page.locator('p, h1, h2, h3, h4, h5, h6');
    await expect(textElements).toHaveCSS('font-size', /^(1[2-9]|[2-9][0-9])px/);
  });

  test('Responsive Text Scaling', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Check heading visibility
      await expect(page.locator('h1, h2')).toBeVisible();
      
      // Verify text remains readable
      const fontSize = await page.evaluate(() => {
        const body = document.body;
        return window.getComputedStyle(body).fontSize;
      });
      
      expect(parseInt(fontSize)).toBeGreaterThanOrEqual(12);
    }
  });
});