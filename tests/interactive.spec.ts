import { test, expect } from '@playwright/test';

test('Floating Action Buttons', async ({ page, context }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Get the buttons
  const whatsappButton = page.locator('.fab-button[onclick*="WhatsApp"]');
  const emailButton = page.locator('.fab-button[onclick*="Email"]');

  // Check initial visibility
  await expect(whatsappButton).toBeVisible();
  await expect(emailButton).toBeVisible();

  // Test WhatsApp button
  const whatsappPromise = context.waitForEvent('page');
  await whatsappButton.click();
  const whatsappPage = await whatsappPromise;
  expect(whatsappPage.url()).toContain('whatsapp.com');

  // Test Email button
  const emailPromise = context.waitForEvent('page');
  await emailButton.click();
  const emailPage = await emailPromise;
  expect(emailPage.url()).toContain('mailto:');

  // Test position after scroll
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await expect(whatsappButton).toBeVisible();
  await expect(emailButton).toBeVisible();

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

    // Check buttons remain visible and properly positioned
    await expect(whatsappButton).toBeVisible();
    await expect(emailButton).toBeVisible();

    // Verify buttons don't overlap content
    const buttonBox = await whatsappButton.boundingBox();
    const pageWidth = viewport.width;
    expect(buttonBox.right).toBeLessThanOrEqual(pageWidth);
  }
});

test('Contact Form Interaction', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Navigate to contact section
  await page.click('a[href="#contact"]');
  await page.waitForTimeout(1000); // Wait for scroll

  // Test contact boxes
  const contactBoxes = page.locator('.contact-box');
  await expect(contactBoxes).toHaveCount(3);

  // Test each contact method
  const phoneLink = page.locator('a[href^="tel:"]');
  const emailLink = page.locator('a[href^="mailto:"]');
  const directionsLink = page.getByText('Get Directions');

  await expect(phoneLink).toBeVisible();
  await expect(emailLink).toBeVisible();
  await expect(directionsLink).toBeVisible();

  // Test languages
  const languages = ['en', 'he', 'ru'];
  for (const lang of languages) {
    // Switch language
    await page.click('.language-switcher');
    await page.waitForTimeout(300);
    await page.click(`.language-option[onclick*="${lang}"]`);
    await page.waitForTimeout(500);

    // Verify contact box content updates
    await expect(contactBoxes.first()).toBeVisible();
    
    // Test directions dialog
    const dialogPromise = page.waitForEvent('dialog');
    await directionsLink.click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain('Directions:');
    await dialog.accept();
  }
});