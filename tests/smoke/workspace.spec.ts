import { test, expect } from '../fixtures';

test.describe('Authenticated Workspace Suite', () => {
  test('Test 1: Access workspace dashboard directly with authenticated page', async ({ page }) => {
    // Act: Navigate to workspace directly (already authenticated!)
    await page.goto('/workspace');

    // Assert: User lands directly on dashboard without login form
    await expect(page).toHaveURL(/.*workspace/);
    await expect(page.locator('app-header')).toBeVisible();
  });

  test('Test 2: Access schools directly with authenticated page', async ({ page }) => {
    // Act: Navigate to another protected route directly
    await page.goto('/schools');

    // Assert: Authenticated session persists across independent tests
    await expect(page).toHaveURL(/.*schools/);
  });
});
