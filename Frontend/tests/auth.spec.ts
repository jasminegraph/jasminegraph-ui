import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Auth Page Tests', () => {
    test('should load login page and show title', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth`);
        await expect(page).toHaveTitle(/JasmineGraph/i);
    });

    test('should show validation messages on empty submit', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth`);
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Please input your email address!')).toBeVisible();
        await expect(page.locator('text=Please input your password!')).toBeVisible();
    });

    test('should redirect to setup if no admin user', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth`);

        const alert = page.locator('.ant-alert-message');
        if (await alert.isVisible()) {
            await expect(alert).toContainText('Admin User Not Found');
            await page.click('text=Go to Setup');
            await expect(page).toHaveURL(`${BASE_URL}/setup`);
        }
    });
});
