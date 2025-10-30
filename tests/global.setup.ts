import { test as setup, expect } from '@playwright/test';

setup('global setup', async ({ page }) => {
  // Perform any global setup like authentication if needed
  await page.goto('/');
  await expect(page).toHaveURL('/');
});