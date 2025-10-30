import { test, expect } from '@playwright/test';

test('Smooth Scroll Navigation', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Custom function to check if element is in viewport
  const isInViewport = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    }, selector);
  };

  // Click each navigation link and verify scroll
  const sections = ['about', 'theteam', 'services', 'articles', 'contact'];
  for (const section of sections) {
    // Get initial position
    const initialY = await page.evaluate(() => window.scrollY);
    
    // Click navigation link
    await page.click(`a[href="#${section}"]`);
    await page.waitForTimeout(1000); // Wait for smooth scroll
    
    // Verify scroll position changed
    const newY = await page.evaluate(() => window.scrollY);
    expect(newY).not.toBe(initialY);
    
    // Verify section visibility
    expect(await isInViewport(`#${section}`)).toBe(true);
  }
});

test('Hero Section', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Check video background
  const video = page.locator('.video-background');
  await expect(video).toBeVisible();
  
  // Verify video attributes and playback
  await expect(video).toHaveJSProperty('paused', false);
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveJSProperty('loop', true);
  
  // Check overlay content
  const heroContent = page.locator('.hero-content');
  await expect(heroContent).toBeVisible();
  
  // Test CTA buttons
  const primaryBtn = page.locator('.cta-buttons .btn-primary');
  const secondaryBtn = page.locator('.cta-buttons .btn-secondary');
  
  await expect(primaryBtn).toBeVisible();
  await expect(secondaryBtn).toBeVisible();
  
  // Test responsive behavior
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 375, height: 667 }
  ];
  
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(500);
    await expect(heroContent).toBeVisible();
    await expect(primaryBtn).toBeVisible();
    await expect(secondaryBtn).toBeVisible();
  }
});

// Custom matcher to check if element is in viewport
expect.extend({
  async toBeInViewport(element) {
    const isVisible = await element.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
    });
    return {
      pass: isVisible,
      message: () => `expected element to ${isVisible ? 'not ' : ''}be in viewport`,
    };
  },
});