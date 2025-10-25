import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow', () => {
  test('should redirect to login when accessing admin without authentication', async ({ page }) => {
    await page.goto('/admin');

    // Should be redirected to login page
    await expect(page).toHaveURL('/login');
  });

  test('should login successfully with correct credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="username"]', process.env.ADMIN_USERNAME || 'admin');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || 'admin');

    // Submit form
    await page.click('button[type="submit"]');

    // Should redirect to admin page
    await expect(page).toHaveURL('/admin');

    // Should see admin content
    await expect(page.locator('h1')).toContainText(/admin|ayarlar/i);
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill with wrong credentials
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');

    // Submit form
    await page.click('button[type="submit"]');

    // Should stay on login page or show error
    await expect(page).toHaveURL(/\/login/);
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="username"]', process.env.ADMIN_USERNAME || 'admin');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || 'admin');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/admin');

    // Find and click logout button/link
    const logoutButton = page
      .locator('a[href="/api/logout"], button:has-text("Çıkış"), button:has-text("Logout")')
      .first();
    await logoutButton.click();

    // Should redirect to login or home
    await expect(page).toHaveURL(/\/(login)?$/);
  });
});
