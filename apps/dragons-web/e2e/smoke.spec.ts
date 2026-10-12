import { expect, test } from '@playwright/test';

test('starts a game against the real API', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start game' }).click();

  await expect(page.getByRole('button', { name: /^Solve / }).first()).toBeVisible();
});
