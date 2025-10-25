import { test, expect } from '@playwright/test';

test.describe('Game Configuration', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="username"]', process.env.ADMIN_USERNAME || 'admin');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || 'admin');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/admin');
  });

  test('should display current game configuration', async ({ page }) => {
    await page.goto('/admin');

    // Should see color inputs
    await expect(page.locator('input[type="color"]')).toHaveCount(3); // Background, snake, food colors

    // Should see speed input
    const speedInput = page.locator('input[type="number"]').first();
    await expect(speedInput).toBeVisible();
  });

  test('should update game colors', async ({ page }) => {
    await page.goto('/admin');

    // Change background color
    await page.locator('input[type="color"]').first().fill('#FF0000');

    // Save configuration
    await page.click('button[type="submit"]');

    // Should show success message or stay on page
    await page.waitForTimeout(1000); // Wait for save

    // Verify color was saved (reload and check)
    await page.reload();
    const bgColor = await page.locator('input[type="color"]').first().inputValue();
    expect(bgColor).toBe('#ff0000'); // Note: browsers normalize to lowercase
  });

  test('should update snake speed', async ({ page }) => {
    await page.goto('/admin');

    // Find speed input
    const speedInput = page.locator('input[type="number"]').first();

    // Set new speed
    await speedInput.fill('10');

    // Save
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    // Verify
    await page.reload();
    const newSpeed = await page.locator('input[type="number"]').first().inputValue();
    expect(newSpeed).toBe('10');
  });

  test('should validate speed range', async ({ page }) => {
    await page.goto('/admin');

    const speedInput = page.locator('input[type="number"]').first();

    // Try to set invalid speed (over 30)
    await speedInput.fill('100');
    await page.click('button[type="submit"]');

    // Should show error or prevent submission
    // Check for HTML5 validation or custom error message
    const isInvalid = await speedInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    if (!isInvalid) {
      // If HTML5 validation didn't catch it, should show error message
      await expect(page.locator('text=/hata|error/i')).toBeVisible({ timeout: 2000 });
    }
  });
});
