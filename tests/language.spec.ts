import { test, expect } from '@playwright/test';

test('Language Dropdown Functionality', async ({ page }) => {
  // Initial setup
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Test dropdown opening
  await page.click('.language-switcher');
  await page.waitForTimeout(300); // Wait for animation
  await expect(page.locator('.language-options')).toBeVisible();

  // Verify language options
  const options = page.locator('.language-option');
  await expect(options).toHaveCount(3); // English, Hebrew, Russian

  // Check flag icons
  for (const lang of ['en', 'he', 'ru']) {
    const flag = page.locator(`.language-option[onclick*="${lang}"] .flag-icon`);
    await expect(flag).toBeVisible();
  }

  // Test language switching
  const languages = [
    { code: 'en', headerText: 'About' },
    { code: 'he', headerText: 'אודות' },
    { code: 'ru', headerText: 'О нас' }
  ];

  for (const lang of languages) {
    // Open dropdown and select language
    await page.click('.language-switcher');
    await page.waitForTimeout(300);
    await page.click(`.language-option[onclick*="${lang.code}"]`);
    await page.waitForTimeout(500);

    // Verify dropdown closes
    await expect(page.locator('.language-options')).toBeHidden();
    
    // Verify content changed
    await expect(page.locator('nav a[href="#about"]')).toHaveText(lang.headerText);
  }
});

test('Content Translation', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const translations = {
    en: {
      about: 'About',
      team: 'Our Team',
      services: 'Practice Areas',
      contact: 'Contact',
      cta: 'Free Consultation'
    },
    he: {
      about: 'אודות',
      team: 'הצוות שלנו',
      services: 'תחומי התמחות',
      contact: 'צור קשר',
      cta: 'ייעוץ חינם'
    },
    ru: {
      about: 'О нас',
      team: 'Наша команда',
      services: 'Практика',
      contact: 'Контакты',
      cta: 'Бесплатная консультация'
    }
  };

  for (const [lang, text] of Object.entries(translations)) {
    // Switch language
    await page.click('.language-switcher');
    await page.waitForTimeout(300); // Wait for dropdown
    await page.click(`.language-option[onclick*="${lang}"]`);
    await page.waitForTimeout(500); // Wait for language change

    // Verify navigation items
    await expect(page.locator('nav a[href="#about"]')).toHaveText(text.about);
    await expect(page.locator('nav a[href="#theteam"]')).toHaveText(text.team);
    await expect(page.locator('nav a[href="#services"]')).toHaveText(text.services);
    await expect(page.locator('nav a[href="#contact"]')).toHaveText(text.contact);

    // Verify CTA button
    await expect(page.locator('.btn-primary')).toHaveText(new RegExp(text.cta));

    // Check text direction
    const dir = lang === 'he' ? 'rtl' : 'ltr';
    await expect(page.locator('html')).toHaveAttribute('dir', dir);

    // Check for layout breaks
    await expect(page.locator('.header')).toHaveCSS('position', 'fixed');
    await expect(page.locator('.nav')).toBeVisible();
    await expect(page.locator('.logo')).toBeVisible();
  }
});