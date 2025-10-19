import { test, expect } from '@playwright/test';

// Test Suite for SchneidLaw Website Functions

test.describe('SchneidLaw Website Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8080/html/main.html');
    });

    test.describe('Mobile Menu', () => {
        test('toggles mobile menu', async ({ page }) => {
            // Click hamburger menu
            await page.click('.mobile-menu-toggle');
            await expect(page.locator('#mobileMenu')).toHaveClass(/active/);
            
            // Click again to close
            await page.click('.mobile-menu-toggle');
            await expect(page.locator('#mobileMenu')).not.toHaveClass(/active/);
        });

        test('closes on navigation click', async ({ page }) => {
            await page.click('.mobile-menu-toggle');
            await page.click('#mobileMenu a[href="#about"]');
            await expect(page.locator('#mobileMenu')).not.toHaveClass(/active/);
        });
    });

    test.describe('Language Switching', () => {
        test('changes language to English', async ({ page }) => {
            await page.click('.language-switcher');
            await page.click('.language-option[onclick*="en"]');
            
            await expect(page.locator('body')).toHaveAttribute('dir', 'ltr');
            await expect(page.locator('.hero-title')).toHaveText('Experienced Legal Counsel You Can Trust');
        });

        test('changes language to Hebrew', async ({ page }) => {
            await page.click('.language-switcher');
            await page.click('.language-option[onclick*="he"]');
            
            await expect(page.locator('body')).toHaveAttribute('dir', 'rtl');
            await expect(page.locator('.hero-title')).toHaveText('יעוץ משפטי מנוסה שאפשר לסמוך עליו');
        });

        test('changes language to Russian', async ({ page }) => {
            await page.click('.language-switcher');
            await page.click('.language-option[onclick*="ru"]');
            
            await expect(page.locator('body')).toHaveAttribute('dir', 'ltr');
            // Add Russian text verification once added to the site
        });
    });

    test.describe('Navigation', () => {
        test('smooth scrolls to sections', async ({ page }) => {
            await page.click('a[href="#about"]');
            await expect(page.locator('#about')).toBeInViewport();
            
            await page.click('a[href="#services"]');
            await expect(page.locator('#services')).toBeInViewport();
        });
    });

    test.describe('Contact Links', () => {
        test('checks contact links', async ({ page }) => {
            await expect(page.locator('a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:info@schneidlaw.com');
            await expect(page.locator('a[href^="tel:"]')).toHaveAttribute('href', 'tel:555-123-4567');
            await expect(page.locator('a[href^="https://wa.me"]')).toHaveAttribute('href', 'https://wa.me/1234567890');
        });
    });

    test.describe('Responsive Design', () => {
        test('mobile menu appears on small screens', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await expect(page.locator('.mobile-menu-toggle')).toBeVisible();
        });

        test('desktop menu visible on large screens', async ({ page }) => {
            await page.setViewportSize({ width: 1024, height: 768 });
            await expect(page.locator('.nav-links')).toBeVisible();
        });
    });
});